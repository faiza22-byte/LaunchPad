import googleTrends from "google-trends-api";
import fetch from "node-fetch";

export const getTrendsValidation = async (req, res) => {
  try {
    const { industry, technology, idea, region } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        message: "Startup idea is required",
      });
    }

    // 🧠 STEP 1: Parse Idea
    const parsedIdea = typeof idea === "string" ? JSON.parse(idea) : idea;

    const prompt = buildPrompt({
      industry,
      technology,
      region,
      idea: parsedIdea,
    });

    // 🤖 STEP 2: CALL GEMINI API
    const keywords = await getKeywordsFromGemini(prompt);

    if (!keywords || keywords.length === 0) {
      throw new Error("No keywords generated from LLM");
    }

    console.log("LLM Keywords:", keywords);

    // 📊 STEP 3: RUN GOOGLE TRENDS FOR EACH KEYWORD
    const results = [];

    for (let keyword of keywords.slice(0, 5)) {
      try {
        const interestRes = await googleTrends.interestOverTime({
          keyword,
          timeframe: "today 12-m",
        });

        const interestDataRaw = JSON.parse(interestRes);

        const interestData =
          interestDataRaw.default.timelineData.map((item) => ({
            date: new Date(item.time * 1000),
            value: item.value[0],
          }));

        const trendScore = calculateTrendScore(interestData);

        results.push({
          keyword,
          trendScore,
          interestOverTime: aggregateTrends(interestData),
        });
      } catch (err) {
        console.log(`Skipped keyword: ${keyword}`);
      }
    }

    // 🏆 STEP 4: PICK BEST KEYWORD
    const bestKeywordData = results.sort(
      (a, b) => b.trendScore - a.trendScore
    )[0];

    // 🌍 STEP 5: EXTRA DATA FOR BEST KEYWORD
    let topRegions = [];
    let risingQueries = [];
    let topQueries = [];

    if (bestKeywordData) {
      const keyword = bestKeywordData.keyword;

      const regionRes = await googleTrends.interestByRegion({ keyword });
      const regionDataRaw = JSON.parse(regionRes);

      topRegions = regionDataRaw.default.geoMapData
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((item) => ({
          region: item.geoName,
          value: item.value[0],
        }));

      const relatedRes = await googleTrends.relatedQueries({ keyword });
      const relatedDataRaw = JSON.parse(relatedRes);

      risingQueries =
        relatedDataRaw.default.rankedList[0]?.rankedKeyword.map(
          (q) => q.query
        ) || [];

      topQueries =
        relatedDataRaw.default.rankedList[1]?.rankedKeyword.map(
          (q) => q.query
        ) || [];
    }
    const formattedBestKeyword = bestKeywordData
  ? {
      ...bestKeywordData,
      interestOverTime: aggregateTrends(bestKeywordData.interestOverTime),
    }
  : null;
    return res.status(200).json({
      success: true,
      data: {
        bestKeyword: formattedBestKeyword,
        allKeywords: results,
        llmGeneratedKeywords: keywords,
        topRegions,
        risingQueries,
        topQueries,
      },
    });
  } catch (error) {
    console.error("Trends Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trends data",
      error: error.message,
    });
  }
};



// 🤖 GEMINI CALL FUNCTION
const getKeywordsFromGemini = async (prompt) => {
  const API_KEY ="GEMINI_API";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return parseKeywords(text);
};



// 🧠 PROMPT BUILDER (VERY IMPORTANT 🔥)
const buildPrompt = ({ industry, technology, region, idea }) => {
  return `
You are a startup market research expert.

Extract 5-8 HIGH QUALITY Google search keywords for validating a startup idea.

Rules:
- Keywords must be realistic search terms
- Focus on demand (what users actually search)
- Include regional variation if relevant
- Avoid generic words like "startup" or "business"
- Keep them short (2-4 words)

Startup Details:
Industry: ${industry}
Technology: ${technology}
Region: ${region}

Problem: ${idea.problem}
Solution: ${idea.solution}
Target Market: ${idea.target_market}

Return ONLY a JSON array like:
["keyword1", "keyword2", "keyword3"]
`;
};



// 🧠 PARSE KEYWORDS FROM LLM
const parseKeywords = (text) => {
  try {
    const match = text.match(/\[.*\]/s);
    if (!match) return [];

    const parsed = JSON.parse(match[0]);

    return parsed.map((k) => k.toLowerCase().trim());
  } catch (err) {
    console.error("Keyword parse error:", err);
    return [];
  }
};


// 🧠 TREND SCORE
const calculateTrendScore = (data) => {
  if (data.length < 2) return 0;

  const first = data[0].value;
  const last = data[data.length - 1].value;

  if (last > first) return 80;
  if (last === first) return 50;
  return 20;
};
const aggregateTrends = (interestOverTime) => {
  if (!interestOverTime || interestOverTime.length === 0) {
    return [];
  }

  // Step 1: Remove zero-heavy noise
  let cleaned = interestOverTime.filter((d) => d.value > 0);

  // If everything is zero, fallback to original (avoid empty charts)
  if (cleaned.length < 5) {
    cleaned = interestOverTime;
  }

  // Step 2: Downsample to max 100 points
  const MAX_POINTS = 100;

  let sampled = cleaned;

  if (cleaned.length > MAX_POINTS) {
    const step = Math.ceil(cleaned.length / MAX_POINTS);
    sampled = cleaned.filter((_, index) => index % step === 0);
  }

  // Step 3: Format for frontend charts
  return sampled.map((item) => ({
    date: new Date(item.date).toISOString().slice(0, 10), // YYYY-MM-DD
    value: item.value,
  }));
};
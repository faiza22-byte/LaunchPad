import fetch from "node-fetch";

const GEMINI_API_KEY ="GEMINI_API";

export const redditAnalysis = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required",
      });
    }

    // =========================
    // 1. FETCH REDDIT DATA
    // =========================
    // =========================
// 1. FETCH REDDIT DATA (FIXED)
// =========================
const redditRes = await fetch(
  `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=15`,
  {
    headers: {
      "User-Agent": "LaunchpadAI/1.0 (by u/research_bot)",
      "Accept": "application/json",
    },
  }
);

// ✅ Handle blocked / failed request
if (!redditRes.ok) {
  console.error("Reddit API Error:", redditRes.status);

  // Instead of crashing → continue with empty posts
  console.log("⚠️ Reddit blocked → continuing without Reddit data");

  return res.json({
    success: true,
    keyword,
    posts: [],
    analysis: {
      pain_points: ["Reddit data unavailable"],
      complaints: [],
      feature_requests: [],
      opportunities: ["Try again later or rely on AI insights"],
      sentiment: "Neutral",
    },
    analysis_proof: [],
  });
}

// ✅ Ensure it's JSON
const contentType = redditRes.headers.get("content-type");

if (!contentType || !contentType.includes("application/json")) {
  const text = await redditRes.text();
  console.error("Non-JSON response from Reddit:", text);

  throw new Error("Invalid Reddit response format");
}

const redditJson = await redditRes.json();

// ✅ Safe parsing
if (!redditJson?.data?.children) {
  throw new Error("Invalid Reddit data structure");
}

const posts = redditJson.data.children.map((p) => ({
  title: p.data.title,
  selftext: p.data.selftext,
  subreddit: p.data.subreddit,
  upvotes: p.data.ups,
  comments: p.data.num_comments,
  url: `https://www.reddit.com${p.data.permalink}`,
}));

    // ✅ Extract URLs for proof section
    const analysisProof = posts.map((p) => p.url);

    // =========================
    // 2. PREPARE TEXT FOR LLM
    // =========================
    const combinedText = posts
      .map(
        (p, i) => `
Post ${i + 1}:
Title: ${p.title}
Content: ${p.selftext}
Upvotes: ${p.upvotes}
Comments: ${p.comments}
Subreddit: ${p.subreddit}
`
      )
      .join("\n");

    // =========================
    // 3. GEMINI ANALYSIS
    // =========================
    const prompt = `
You are a startup market analyst.

Analyze the following Reddit posts about "${keyword}".

Extract:

1. Pain Points
2. User Complaints
3. Feature Requests
4. Market Opportunities
5. Sentiment Summary

Return STRICT JSON:

{
  "pain_points": [],
  "complaints": [],
  "feature_requests": [],
  "opportunities": [],
  "sentiment": ""
}

Reddit Data:
${combinedText}
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    const geminiData = await geminiRes.json();

    let analysisText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // =========================
    // 4. CLEAN JSON RESPONSE
    // =========================
    let parsed;
    try {
      parsed = JSON.parse(analysisText);
    } catch (err) {
      const match = analysisText.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    // =========================
    // 5. FINAL RESPONSE
    // =========================
    return res.json({
      success: true,
      keyword,
      posts,
      analysis: parsed,

      // ✅ NEW FIELD
      analysis_proof: analysisProof,
    });
  } catch (error) {
    console.error("Reddit Analysis Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze Reddit data",
      error: error.message,
    });
  }
};
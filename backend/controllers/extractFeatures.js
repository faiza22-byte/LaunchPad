import playwright from "playwright";
import axios from "axios";

export const competitorPipeline = async (req, res) => {
  try {
    const { competitorsData , bestKeyword } = req.body;

    if (!competitorsData || !Array.isArray(competitorsData)) {
      return res.status(400).json({
        success: false,
        message: "Competitors are required",
      });
    }

    if (!bestKeyword) {
      return res.status(400).json({
        success: false,
        message: "bestKeyword is required",
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // -------------------------------
    // 1. PLAYWRIGHT SCRAPING
    // -------------------------------
    const browser = await playwright.chromium.launch({ headless: true });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    });

    const scrapedResults = [];

for (let i = 0; i < Math.min(competitorsData.length, 4); i++) {
  const comp = competitorsData[i];
  const page = await context.newPage();

  try {
    await page.goto(comp.link, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const data = await page.evaluate(() => {
      const getText = (selector) =>
        Array.from(document.querySelectorAll(selector)).map(
          (el) => el.innerText
        );

      return {
        title: document.title || "",
        metaDescription:
          document.querySelector('meta[name="description"]')?.content || "",
        h1: getText("h1"),
        h2: getText("h2"),
        bodyText: document.body.innerText.slice(0, 2000),
        links: Array.from(document.querySelectorAll("a"))
          .slice(0, 20)
          .map((a) => ({
            text: a.innerText,
            href: a.href,
          })),
      };
    });

    scrapedResults.push({
      competitor: comp.title,
      url: comp.link,
      domain: comp.domain,
      snippet: comp.snippet,
      features: data,
    });

  } catch (err) {
    scrapedResults.push({
      competitor: comp.title,
      url: comp.link,
      error: err.message,
    });
  } finally {
    await page.close();
  }
}

   

    await browser.close();

    // -------------------------------
    // 2. GEMINI FEATURE EXTRACTION
    // -------------------------------
    const analyzedResults = [];

    for (const comp of scrapedResults) {
      if (!comp.features) {
        analyzedResults.push({
          competitor: comp.competitor,
          url: comp.url,
          error: "No scraped features",
        });
        continue;
      }

      try {
        const prompt = `
Extract structured competitor intelligence.

Startup Keyword:
${bestKeyword}

Competitor Data:
${JSON.stringify(comp.features, null, 2)}

Return STRICT JSON:

{
  "positioning": {
    "title": "",
    "metaDescription": "",
    "h1": []
  },
  "features": {
    "products": [],
    "headings": [],
    "modules": []
  },
  "keywords": [],
  "categories": [],
  "gaps": []
}

Return ONLY JSON.
        `;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );

        const text =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { raw: text };
        }

        analyzedResults.push({
          competitor: comp.competitor,
          url: comp.url,
          analysis: parsed,
        });
      } catch (err) {
        analyzedResults.push({
          competitor: comp.competitor,
          url: comp.url,
          error: "Feature extraction failed",
        });
      }
    }

    // -------------------------------
    // 3. GEMINI SCORING / COMPARISON
    // -------------------------------
    const scoredResults = [];

    for (const comp of analyzedResults) {
      try {
        const prompt = `
You are a startup competitor scoring expert.

Startup Keyword:
${bestKeyword}

Competitor Analysis:
${JSON.stringify(comp.analysis, null, 2)}

Score this competitor.

Return STRICT JSON:

{
  "overallScore": number,
  "breakdown": {
    "positioning": number,
    "features": number,
    "seo": number,
    "content": number,
    "relevance": number
  },
  "strengths": [],
  "weaknesses": [],
  "opportunities": [],
  "summary": ""
}

Return ONLY JSON.
        `;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );

        const text =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { raw: text };
        }

        scoredResults.push({
          competitor: comp.competitor,
          url: comp.url,
          score: parsed,
        });
      } catch (err) {
        scoredResults.push({
          competitor: comp.competitor,
          url: comp.url,
          error: "Scoring failed",
        });
      }
    }

    // -------------------------------
    // 4. RANKING
    // -------------------------------
    const ranked = [...scoredResults].sort(
      (a, b) => (b.score?.overallScore || 0) - (a.score?.overallScore || 0)
    );

    const averageScore =
      ranked.reduce((acc, r) => acc + (r.score?.overallScore || 0), 0) /
      (ranked.length || 1);

    // -------------------------------
    // FINAL RESPONSE
    // -------------------------------
    return res.json({
      success: true,
      data: {
        scraped: scrapedResults,
        analyzed: analyzedResults,
        ranking: ranked,
        insights: {
          topCompetitor: ranked[0] || null,
          averageScore,
        },
      },
    });
  } catch (error) {
    console.error("Pipeline error:", error);

    return res.status(500).json({
      success: false,
      message: "Pipeline failed",
      error: error.message,
    });
  }
};
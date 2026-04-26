// backend/controllers/fetchRevenueDetails.js
import fetch from "node-fetch";

const GEMINI_API_KEY = "GEMINI_API";
const GEMINI_MODEL = "gemini-2.5-flash";

// Safely parse Gemini JSON output
const safeParseJSON = (text) => {
  try {
    if (!text) return {};
    // Remove <think> blocks
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    // Extract the first { ... } block
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return {};
    const jsonStr = cleaned.substring(start, end + 1);

    return JSON.parse(jsonStr);
  } catch (err) {
    console.warn("❌ JSON parse failed:", err.message);
    return {};
  }
};

// Normalize data to always be array of objects
const normalizeData = (data) => {
  if (!data || !data.revenue_streams) return [];
  return data.revenue_streams.map((r) => ({
    name: r.name || "",
    description: r.description || "",
    analysis: r.analysis || "",
  }));
};

// Main controller
export const fetchRevenueDetails = async (req, res) => {
  const { generatedIdea, revenue_streams } = req.body;

  if (!generatedIdea || !revenue_streams) {
    return res
      .status(400)
      .json({ error: "generatedIdea and revenue_streams are required." });
  }

  // Construct prompt for Gemini
  const prompt = `
Analyze the following revenue streams for the startup "${generatedIdea}":
${Array.isArray(revenue_streams) ? revenue_streams.join("\n") : revenue_streams}

Return ONLY valid JSON in this format:
{
  "revenue_streams": [
    {
      "name": "...",
      "description": "...",
      "analysis": "..."
    }
  ]
}
Do NOT include any extra text or <think> tags.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const json = await response.json();
    console.log("💬 Gemini RAW RESPONSE:", JSON.stringify(json, null, 2));

    let rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    console.log("💬 Gemini RAW TEXT:", rawText);

    let parsedData = safeParseJSON(rawText);

    // If empty, return placeholder revenue_streams
    if (!parsedData || !parsedData.revenue_streams || parsedData.revenue_streams.length === 0) {
      console.warn("⚠️ Gemini returned empty, using placeholder data.");
      parsedData = {
        revenue_streams: revenue_streams.map((name) => ({
          name,
          description: "Description not generated",
          analysis: "Analysis not generated",
        })),
      };
    }

    const cleanedData = normalizeData(parsedData);

    // ✅ Send structured response
    res.json({
      success: true,
      revenue_streams: cleanedData,
      count: cleanedData.length,
    });
  } catch (err) {
    console.error("❌ Gemini API call failed:", err);
    res.status(500).json({
      error: "Gemini API call failed",
      details: err.message,
      revenue_streams: [],
      count: 0,
    });
  }
};
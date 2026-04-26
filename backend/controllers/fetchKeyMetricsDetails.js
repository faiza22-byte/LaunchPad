import fetch from "node-fetch";

const GEMINI_API_KEY = "GEMINI_API";
const GEMINI_MODEL = "gemini-2.5-flash";

// ✅ Safe JSON parser
const safeParseJSON = (text) => {
  try {
    if (!text) return {};

    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

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

// ✅ Normalize response
const normalizeData = (data) => {
  if (!data?.key_metrics) return [];

  return data.key_metrics.map((k) => ({
    name: k.name || "",
    description: k.description || "",
    analysis: k.analysis || "",
  }));
};

// ✅ Controller
export const fetchKeyMetricsDetails = async (req, res) => {
  const { generatedIdea, key_metrics } = req.body;

  if (!generatedIdea || !key_metrics) {
    return res.status(400).json({
      error: "generatedIdea and key_metrics are required.",
    });
  }

  const prompt = `
You are a business analyst.

Analyze the following key metrics for the startup: "${generatedIdea}"

Metrics:
${Array.isArray(key_metrics) ? key_metrics.join("\n") : key_metrics}

Return ONLY valid JSON in this format:

{
  "key_metrics": [
    {
      "name": "metric name",
      "description": "clear explanation of the metric",
      "analysis": "business insights and interpretation"
    }
  ]
}

Rules:
- Output ONLY JSON
- No markdown
- No extra text
- No <think> tags
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    const json = await response.json();

    console.log("💬 FULL GEMINI RESPONSE:\n", JSON.stringify(json, null, 2));

    // ✅ Handle API errors explicitly
    if (json.error) {
      console.error("❌ Gemini API Error:", json.error);
      return res.status(500).json({
        success: false,
        error: json.error.message || "Gemini API error",
        key_metrics: [],
        count: 0,
      });
    }

    // ✅ Extract text safely
    const rawText =
      json?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("💬 RAW TEXT:\n", rawText);

    if (!rawText) {
      console.warn("⚠️ No candidates returned (possible safety block or quota issue)");

      return res.json({
        success: true,
        key_metrics: Array.isArray(key_metrics)
          ? key_metrics.map((name) => ({
              name,
              description: "Fallback: description not generated",
              analysis: "Fallback: analysis not generated",
            }))
          : [],
        count: Array.isArray(key_metrics) ? key_metrics.length : 0,
      });
    }

    // ✅ Parse JSON
    const parsedData = safeParseJSON(rawText);

    if (!parsedData?.key_metrics || parsedData.key_metrics.length === 0) {
      console.warn("⚠️ Parsed data empty, using fallback.");

      return res.json({
        success: true,
        key_metrics: Array.isArray(key_metrics)
          ? key_metrics.map((name) => ({
              name,
              description: "Fallback: description not generated",
              analysis: "Fallback: analysis not generated",
            }))
          : [],
        count: Array.isArray(key_metrics) ? key_metrics.length : 0,
      });
    }

    const cleanedData = normalizeData(parsedData);

    return res.json({
      success: true,
      key_metrics: cleanedData,
      count: cleanedData.length,
    });
  } catch (err) {
    console.error("❌ Gemini API call failed:", err);

    return res.status(500).json({
      success: false,
      error: "Gemini API call failed",
      details: err.message,
      key_metrics: [],
      count: 0,
    });
  }
};
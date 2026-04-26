// backend/controllers/uniqueValueController.js
import fetch from "node-fetch";

// ✅ Gemini API key & model (store GEMINI_API_KEY in .env)
const GEMINI_API_KEY ="GEMINI_API"; // replace with your own key if needed
const GEMINI_MODEL = "gemini-2.5-flash";

// ✅ Safe JSON parser (cleans extra text)
const safeParseJSON = (text) => {
  try {
    if (!text) return {};
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return {};
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch (err) {
    console.warn("JSON parse failed:", err.message);
    return {};
  }
};

// ✅ Normalize the response to always have these keys
const normalizeData = (data) => ({
  unique_statement: "",
  benefits: [],
  differentiation: "",
  narrative: "",
  ...data,
});

// ✅ Controller
export const fetchUniqueValueDetails = async (req, res) => {
  const { unique_value, generatedIdea } = req.body;
  if (!unique_value || !generatedIdea) {
    return res
      .status(400)
      .json({ error: "unique_value and generatedIdea are required." });
  }

  const prompt = `
Analyze the following unique value proposition (UVP) in depth:

"${unique_value}"

Return ONLY valid JSON with actual values.

Format:
{
  "unique_statement": "...",
  "benefits": ["..."],
  "differentiation": "...",
  "narrative": "..."
}

Do NOT include extra text or <think> blocks.
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // ✅ Gemini API call
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const json = await response.json();
    console.log("💬 Gemini RAW:", JSON.stringify(json, null, 2));

    let rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    let parsedData = safeParseJSON(rawText);

    // 🔁 Retry with stricter prompt if empty
    if (!parsedData || Object.keys(parsedData).length === 0) {
      console.log("⚠️ Retry with stricter prompt...");
      const retryPrompt = prompt + "\nSTRICT: ONLY JSON";

      const retryResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: retryPrompt }] }],
        }),
      });

      const retryJson = await retryResponse.json();
      console.log("🔁 Gemini Retry RAW:", JSON.stringify(retryJson, null, 2));

      rawText = retryJson?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      parsedData = safeParseJSON(rawText);
    }

    const generatedData = normalizeData(parsedData);
    res.json({ details: generatedData });
  } catch (err) {
    console.error("❌ Gemini API call failed:", err);
    res
      .status(500)
      .json({ error: "Gemini API call failed", details: err.message });
  }
};
// backend/controllers/solutionController.js
import fetch from "node-fetch";

// ✅ Gemini API key & model (store in .env for production)
const GEMINI_API_KEY ="GEMINI_API"; // replace with your own key if needed
const GEMINI_MODEL = "gemini-2.5-flash";

// ✅ Safe JSON parser (removes extra <think> blocks)
const safeParseJSON = (text) => {
  try {
    if (!text) return null;
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch (err) {
    console.warn("JSON parse failed:", err.message);
    return null;
  }
};

// ✅ Ensure consistent structure
const normalizeGeneratedData = (data) => ({
  solution_overview: "",
  benefits: [],
  steps: [],
  narrative: "",
  ...data,
});

// ✅ Main controller
export const fetchSolutionDetails = async (req, res) => {
  const { solution, generatedIdea } = req.body;

  if (!solution || !generatedIdea) {
    return res.status(400).json({ error: "Solution and generatedIdea required." });
  }

  const fullPrompt = `
Analyze the following solution in depth:

"${solution}"

Return ONLY valid JSON with actual values.

Format:
{
  "solution_overview": "...",
  "benefits": ["..."],
  "steps": ["..."],
  "narrative": "..."
}

Do NOT include extra text or <think> blocks.
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // ✅ Call Gemini API
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    const json = await response.json();
    console.log("💬 Gemini RAW:", JSON.stringify(json, null, 2));

    if (!json?.candidates?.length) {
      return res.status(500).json({ error: "No response from Gemini", raw: json });
    }

    let rawText = json.candidates[0]?.content?.parts?.[0]?.text || "{}";
    let parsedData = safeParseJSON(rawText);

    // 🔁 Retry if JSON empty
    if (!parsedData || Object.keys(parsedData).length === 0) {
      console.log("⚠️ Retry with stricter prompt...");
      const retryPrompt = fullPrompt + "\nSTRICT: ONLY JSON";

      const retryResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: retryPrompt }] }],
        }),
      });

      const retryJson = await retryResponse.json();
      console.log("🔁 Gemini Retry RAW:", JSON.stringify(retryJson, null, 2));

      rawText = retryJson.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      parsedData = safeParseJSON(rawText);
    }

    const generatedData = normalizeGeneratedData(parsedData);
    res.json({ details: generatedData });
  } catch (err) {
    console.error("❌ Gemini API call failed:", err);
    res.status(500).json({ error: "Gemini API call failed", details: err.message });
  }
};
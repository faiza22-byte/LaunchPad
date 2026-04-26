// backend/controllers/problemController.js
import fetch from "node-fetch";

// ✅ Gemini API key & model
const GEMINI_API_KEY = "GEMINI_API"; // replace with your own key if needed
const GEMINI_MODEL = "gemini-2.5-flash";

// ✅ Clean + safe JSON extractor
const cleanJSON = (text) => {
  try {
    if (!text) return {};
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return {};
    const jsonString = cleaned.substring(start, end + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn("JSON parse failed:", err.message);
    return {};
  }
};

// ✅ Ensure consistent structure
const normalizeGeneratedData = (data) => ({
  background: "",
  pain_points: [],
  implications: "",
  narrative: "",
  ...data,
});

// ✅ Main controller
export const fetchProblemDetails = async (req, res) => {
  const { problem, generatedIdea } = req.body;

  if (!problem) {
    return res.status(400).json({ error: "Problem is required." });
  }

  const fullPrompt = `
Analyze the following problem statement in depth:

"${problem}"

Return ONLY valid JSON with actual values.

Format:
{
  "background": "...",
  "pain_points": ["..."],
  "implications": "...",
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
    let parsedData = cleanJSON(rawText);

    // 🔁 Retry if JSON is empty
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
      parsedData = cleanJSON(rawText);
    }

    const generatedData = normalizeGeneratedData(parsedData);

    // ✅ Send response fully compatible with frontend localStorage
    res.json({
      ...generatedIdea, // keep previous idea data
      problem_details: generatedData,
    });
  } catch (err) {
    console.error("❌ Gemini API call failed:", err);
    res.status(500).json({ error: "Gemini API call failed", details: err.message });
  }
};
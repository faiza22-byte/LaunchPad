import fetch from "node-fetch";
import Idea from "../models/Idea.js";

// ✅ Environment variables
const GEMINI_API_KEY ="GEMINI_API";
const GEMINI_MODEL = "gemini-2.5-flash";

// ✅ Normalize LLM output
const normalizeGeneratedData = (data) => ({
  startup_name: "Unknown Startup",
  problem: "",
  solution: "",
  target_market: "",
  unique_value_proposition: "",
  revenue_streams: "",
  key_metrics: "",
  cost_structure: "",
  marketing_strategy: "",
  technology_stack: "",
  ...data,
});

// ✅ Save idea to MongoDB and respond
const saveIdeaAndRespond = async (generatedData, req, res) => {
  const { prompt, industry, technology, budget, region, user } = req.body;
  const userId = user?.id || user?._id;

  if (!userId) return res.status(400).json({ error: "User ID missing" });

  const idea = new Idea({
    userId,
    prompt,
    industry,
    technology,
    budget,
    region,
    generatedData,
  });

  await idea.save();
  console.log("✅ Idea saved:", userId);
  res.json(generatedData);
};

// ✅ Clean JSON returned by Gemini (sometimes extra text)
const cleanJSON = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return {};
  }
};

// ✅ Main controller
export const generateStartupIdea = async (req, res) => {
  const { prompt, industry, technology, budget, region, user } = req.body;

  if (!prompt || !industry || !technology || !budget || !region || !user) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const fullPrompt = `
Return ONLY valid JSON:
{
  "startup_name": "...",
  "problem": "...",
  "solution": "...",
  "target_market": "...",
  "unique_value_proposition": "...",
  "revenue_streams": "...",
  "key_metrics": "...",
  "cost_structure": "...",
  "marketing_strategy": "...",
  "technology_stack": "..."
}

Idea:
- Prompt: ${prompt}
- Industry: ${industry}
- Technology: ${technology}
- Budget: ${budget}
- Region: ${region}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    const json = await response.json();

    // 🔥 Debug log to check raw response (optional)
    console.log("Gemini RAW:", JSON.stringify(json, null, 2));

    if (!json?.candidates?.length) {
      return res.status(500).json({ error: "No response from Gemini", raw: json });
    }

    const rawText = json.candidates[0]?.content?.parts?.[0]?.text || "{}";

    const parsed = cleanJSON(rawText);
    const data = normalizeGeneratedData(parsed);

    await saveIdeaAndRespond(data, req, res);
  } catch (err) {
    console.error("❌ Gemini API call failed:", err);
    res.status(500).json({ error: "Gemini API call failed", details: err.message });
  }
};
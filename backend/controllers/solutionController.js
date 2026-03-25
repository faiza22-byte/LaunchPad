import axios from "axios";

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

export const fetchSolutionDetails = async (req, res) => {
  const { solution, generatedIdea } = req.body;
  if (!solution || !generatedIdea) return res.status(400).json({ error: "Solution and generatedIdea required." });

  try {
    const prompt = `
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

    const hfResponse = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1:fastest",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        response_format: { type: "json_object" },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}`, "Content-Type": "application/json" },
        timeout: 120000,
      }
    );

    const textOutput = hfResponse.data?.choices?.[0]?.message?.content || "";
    console.log("Raw AI Output:", textOutput);
    const parsedData = safeParseJSON(textOutput);
    console.log("Parsed AI Output:", parsedData);

    if (!parsedData) return res.status(500).json({ error: "Failed to parse AI output." });
    res.json({ details: parsedData });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server failed", message: err.message });
  }
};
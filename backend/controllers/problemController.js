// backend/controllers/problemController.js
import axios from "axios";

// ✅ Clean JSON extractor
const safeParseJSON = (text) => {
  try {
    if (!text) return null;
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const jsonString = cleaned.substring(start, end + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn("JSON parse failed:", err.message);
    return null;
  }
};

export const fetchProblemDetails = async (req, res) => {
  const { problem, generatedIdea } = req.body;

  if (!problem || !generatedIdea) {
    console.log("Bad Request: Missing problem or generatedIdea");
    return res.status(400).json({ error: "Problem and generatedIdea are required." });
  }

  try {
    const modelPrompt = `
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

    console.log("Sending prompt to Hugging Face:", modelPrompt);

    const hfResponse = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1:fastest",
        messages: [{ role: "user", content: modelPrompt }],
        max_tokens: 1000,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const textOutput = hfResponse.data?.choices?.[0]?.message?.content || "";
    console.log("Raw AI Output:", textOutput); // ✅ print raw AI response

    const parsedData = safeParseJSON(textOutput);

    console.log("Parsed AI Output:", parsedData); // ✅ print parsed JSON

    if (!parsedData) {
      return res.status(500).json({ error: "Failed to parse AI output." });
    }

    // ✅ Return AI-generated problem details
    res.json({ details: parsedData });
  } catch (err) {
    if (err.response) {
      console.error("HF API error:", err.response.status, err.response.data);
      res.status(500).json({ error: "HF API failed", data: err.response.data });
    } else {
      console.error("Server error:", err.message);
      res.status(500).json({ error: "Server failed", message: err.message });
    }
  }
};
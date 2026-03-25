import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import Idea from "../models/Idea.js";

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Absolute path to Python script
const scriptPath = path.join(__dirname, "../utils/local_llm.py");

// ✅ Clean + safe JSON extractor
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

// ✅ Ensure structure
const normalizeGeneratedData = (data) => {
  const defaultData = {
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
  };

  if (!data || typeof data !== "object") return defaultData;

  return { ...defaultData, ...data };
};

// ✅ Save + Respond helper
const saveIdeaAndRespond = async (generatedData, req, res) => {
  const { prompt, industry, technology, budget, region, user } = req.body;

  const userId = user?.id || user?._id;

  if (!userId) {
    return res.status(400).json({ error: "User ID missing" });
  }

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

  console.log("✅ Idea saved for user:", userId);

  res.json(generatedData);
};

// ✅ MAIN CONTROLLER
export const generateStartupIdea = async (req, res) => {
  const { prompt, industry, technology, budget, region, user } = req.body;

  if (!prompt || !industry || !technology || !budget || !region || !user) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const fullPrompt = `
Return ONLY valid JSON.

Do NOT include:
- <think>
- explanations
- extra text

JSON format:
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

Idea: ${prompt}
Industry: ${industry}
Technology: ${technology}
Budget: ${budget}
Region: ${region}
`;

    console.log("🚀 Using script path:", scriptPath);

    execFile(
      "python",
      [scriptPath, fullPrompt],
      { encoding: "utf-8", maxBuffer: 1024 * 1024 * 10 },
      async (error, stdout, stderr) => {
        if (error) {
          console.error("❌ ERROR:", error.message);
          console.error("STDERR:", stderr);
          return res.status(500).json({ error: "Local LLM failed" });
        }

        console.log("🧠 Raw LLM Output:", stdout);

        let parsedData = safeParseJSON(stdout);

        // 🔁 RETRY if parsing fails
        if (!parsedData) {
          console.log("⚠️ Retrying with stricter prompt...");

          execFile(
            "python",
            [scriptPath, fullPrompt + "\nSTRICT: ONLY JSON"],
            { encoding: "utf-8", maxBuffer: 1024 * 1024 * 10 },
            async (err2, stdout2, stderr2) => {
              if (err2) {
                console.error("❌ Retry ERROR:", err2.message);
                console.error("STDERR:", stderr2);
                return res.status(500).json({ error: "Retry failed" });
              }

              console.log("🔁 Retry Output:", stdout2);

              parsedData = safeParseJSON(stdout2);

              const generatedData = normalizeGeneratedData(parsedData);

              await saveIdeaAndRespond(generatedData, req, res);
            }
          );
        } else {
          const generatedData = normalizeGeneratedData(parsedData);
          await saveIdeaAndRespond(generatedData, req, res);
        }
      }
    );
  } catch (err) {
    console.error("❌ Server error:", err.message);

    res.status(500).json({
      error: "Failed to generate startup idea",
    });
  }
};
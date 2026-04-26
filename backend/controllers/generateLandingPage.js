import fetch from "node-fetch";
import LandingPage from "../models/LandingPage.js";

export const generateLandingPage = async (req, res) => {
  try {
    const { generatedIdea } = req.body;

    if (!generatedIdea) {
      return res.status(400).json({
        success: false,
        error: "Missing generatedIdea",
      });
    }

    const ideaObj =
      typeof generatedIdea === "string"
        ? JSON.parse(generatedIdea)
        : generatedIdea;

    const prompt = `
You are a professional UI/UX designer and frontend developer.

Generate a COMPLETE, MODERN, BEAUTIFUL landing page using:
- HTML
- CSS (inside <style>)
- JavaScript (inside <script>)

IMPORTANT:
- Return ONLY raw HTML
- Do NOT include markdown (no \`\`\`)
- Do NOT explain anything

Requirements:
- SaaS-style modern design
- MULTICOLOR theme (use vibrant gradients like purple, blue, pink, orange)
- Include a BEAUTIFUL NAVBAR at top
- Include a HERO SECTION with optional background image (if suitable)
- Clean typography (Poppins or Inter)
- Smooth animations
- Fully responsive layout
- Card-based sections
- Modern UI like startup websites

Sections:
1. Navbar
2. Hero section (startup name + tagline + CTA)
3. Problem section
4. Solution section
5. Target market
6. Unique value proposition
7. Revenue streams
8. Key metrics
9. CTA section
10. Footer

Startup Name: ${ideaObj.startup_name}

Problem:
${ideaObj.problem}

Solution:
${ideaObj.solution}

Target Market:
${ideaObj.target_market}

Unique Value Proposition:
${ideaObj.unique_value_proposition}

Revenue Streams:
${ideaObj.revenue_streams?.join(", ") || ""}

Key Metrics:
${ideaObj.key_metrics?.join(", ") || ""}

Cost Structure:
${ideaObj.cost_structure?.join(", ") || ""}

Marketing Strategy:
${ideaObj.marketing_strategy?.join(", ") || ""}

Technology Stack:
${ideaObj.technology_stack?.join(", ") || ""}

Design Guidelines:
- Use MULTICOLOR gradients throughout
- Add hover effects
- Add subtle animations
- Use modern spacing and layout
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=GEMINI_API",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (data?.promptFeedback?.blockReason) {
      return res.status(200).json({
        success: false,
        error: `Prompt blocked: ${data.promptFeedback.blockReason}`,
      });
    }

    if (!data?.candidates || data.candidates.length === 0) {
      return res.status(200).json({
        success: false,
        error: "No response from Gemini",
      });
    }

    let rawText =
      data.candidates[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    if (!rawText) {
      return res.status(200).json({
        success: false,
        error: "Empty response from Gemini",
      });
    }

    let html = rawText
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ SAVE TO DB
    const savedPage = await LandingPage.create({
      startupName: ideaObj.startup_name,
      idea: ideaObj,
      html,
    });

    return res.json({
      success: true,
      html,
      id: savedPage._id, // useful later
    });
  } catch (err) {
    console.error("Controller Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
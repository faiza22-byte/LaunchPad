// backend/controllers/ideasController.js
import Idea from "../models/Idea.js"; // Your Mongoose model

export const getUserIdeas = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Fetch all ideas for this user
    const ideas = await Idea.find({ userId }).sort({ createdAt: -1 });

    // Map to only summary data for dashboard
    const summary = ideas.map((idea) => ({
      id: idea._id,
      startup_name: idea.generatedData?.startup_name || "",
      industry: idea.industry,
      technology: idea.technology,
      budget: idea.budget,
      region: idea.region,
      snippet: idea.generatedData?.problem?.substring(0, 100) + "...",
      createdAt: idea.createdAt,
    }));

    res.json({ success: true, ideas: summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
};
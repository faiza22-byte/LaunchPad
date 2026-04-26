import Idea from "../models/Idea.js";

// GET /api/ideas/:id
export const getIdeaById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid idea ID" });
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.json(idea); // send idea data to frontend
  } catch (error) {
    console.error("Error fetching idea:", error);
    res.status(500).json({ message: "Server error" });
  }
};
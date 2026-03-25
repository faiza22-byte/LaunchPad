import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  industry: { type: String, required: true },
  technology: { type: String, required: true },
  budget: { type: String, required: true },
  region: { type: String, required: true },
  generatedData: { type: Object, required: true }, // The Grok API response
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Idea", ideaSchema);
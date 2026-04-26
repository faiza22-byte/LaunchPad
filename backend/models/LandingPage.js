// models/LandingPage.js
import mongoose from "mongoose";

const landingPageSchema = new mongoose.Schema({
  startupName: String,
  idea: Object,
  html: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LandingPage", landingPageSchema);
import express from "express";
import { redditAnalysis } from "../controllers/redditAnalysisController.js";
const router = express.Router();

router.post("/", redditAnalysis);

export default router;
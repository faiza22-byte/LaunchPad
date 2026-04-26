import express from "express";
import { competitorPipeline } from "../controllers/extractFeatures.js";

const router = express.Router();

router.post("/extract-features", competitorPipeline);

export default router;
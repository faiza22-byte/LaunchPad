import express from "express";
import { getCompetitorDashboard } from "../controllers/ProductHunt.js";

const router = express.Router();

// GET /api/competitor?url=https://example.com
router.get("/", getCompetitorDashboard);

export default router;
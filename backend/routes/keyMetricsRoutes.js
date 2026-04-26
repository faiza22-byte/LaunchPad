import express from "express";
import { fetchKeyMetricsDetails } from "../controllers/fetchKeyMetricsDetails.js";

const router = express.Router();

// POST /api/key-metrics-details
router.post("/key-metrics-details", fetchKeyMetricsDetails);

export default router;
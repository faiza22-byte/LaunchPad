import express from "express";
import { fetchRevenueDetails } from "../controllers/fetchRevenueDetails.js";

const router = express.Router();

// POST /api/revenue-details
router.post("/", fetchRevenueDetails);

export default router;
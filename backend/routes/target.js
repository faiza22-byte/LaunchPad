// backend/routes/targetMarketRoutes.js
import express from "express";
import { fetchTargetMarketDetails } from "../controllers/targetMarketController.js";

const router = express.Router();

// POST /api/target-market-details
router.post("/", fetchTargetMarketDetails);

export default router;
import express from "express";
import { getTrendsValidation } from "../controllers/trendsController.js";
const router = express.Router();
// GET /api/trends?keyword=AI startup
router.post("/", getTrendsValidation);
export default router;
import express from "express";
import { generateLandingPage } from "../controllers/generateLandingPage.js";

const router = express.Router();

// POST /api/landing-page/generate
router.post("/generate", generateLandingPage);

export default router;
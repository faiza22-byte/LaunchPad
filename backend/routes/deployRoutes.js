import express from "express";
import { deployLandingPage } from "../controllers/deployController.js";

const router = express.Router();

// POST /api/deploy
router.post("/", deployLandingPage);

export default router;
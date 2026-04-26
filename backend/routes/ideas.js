import express from "express";
import { getIdeaById } from "../controllers/ideaController.js";

const router = express.Router();

// GET /api/ideas/:id
router.get("/:id", getIdeaById);

export default router;
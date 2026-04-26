import express from "express";
import { getUserIdeas } from "../controllers/IdeasController.js";

const router = express.Router();

// GET all ideas for a specific user
router.get("/:userId", getUserIdeas);

export default router;
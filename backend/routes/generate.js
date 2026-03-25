import express from "express";
import { generateStartupIdea } from "../controllers/generateController.js";

const router = express.Router();

router.post("/", generateStartupIdea);

export default router;
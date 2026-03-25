// backend/routes/problemRoutes.js
import express from "express";
import { fetchSolutionDetails } from "../controllers/solutionController.js";

const router = express.Router();

router.post("/", fetchSolutionDetails);

export default router;
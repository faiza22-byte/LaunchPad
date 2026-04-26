import express from "express";
import { getCompetitors } from "../controllers/getCompetitors_serp.js";

const router = express.Router();

router.get("/competitors", getCompetitors);

export default router;
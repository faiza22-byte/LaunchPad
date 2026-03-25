// backend/routes/problemRoutes.js
import express from "express";
import { fetchProblemDetails } from "../controllers/problemController.js";

const router = express.Router();

router.post("/", fetchProblemDetails);

export default router;
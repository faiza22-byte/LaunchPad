import express from "express";
import { fetchUniqueValueDetails } from "../controllers/uniqueValueController.js";

const router = express.Router();

// POST /api/unique-value-details
router.post("/", fetchUniqueValueDetails);

export default router;
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import generateRoutes from "./routes/generate.js";
import problem from "./routes/problem.js";
import solution from "./routes/solution.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai/generate", generateRoutes);
app.use("/api/problem-details", problem);
app.use("/api/solution-details", solution);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
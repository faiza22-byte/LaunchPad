import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import deployRoutes from "./routes/deployRoutes.js";
import generateRoutes from "./routes/generate.js";
import ideas from "./routes/ideas.js";
import ideasRoutes from "./routes/ideasRoutes.js";
import keyMetricsRoutes from "./routes/keyMetricsRoutes.js";
import landingPageRoutes from "./routes/landingPageRoutes.js";
import problem from "./routes/problem.js";
import redditRoutes from "./routes/redditRoute.js";
import revenueDetails from "./routes/revenue_details.js";
import solution from "./routes/solution.js";
import targetMarket from "./routes/target.js";
import trendsRoutes from "./routes/trendsRoutes.js";
import uniqueValue from "./routes/unique_value.js";
import SERPRoute from "./routes/SERProute.js"
import extractFeatures from "./routes/extractFeatures.js";
import competitorRoutes from "./routes/competitorRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/deployments", express.static(path.join(process.cwd(), "deployments")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai/generate", generateRoutes);
app.use("/api/problem-details", problem);
app.use("/api/solution-details", solution);
app.use("/api/target-market-details", targetMarket);
app.use("/api/unique-value-details", uniqueValue);
app.use("/api/revenue-details", revenueDetails);
app.use("/api/ideas", ideasRoutes);
app.use("/api/idea", ideas);
app.use("/api", keyMetricsRoutes);
app.use("/api/trends", trendsRoutes);
app.use("/api/reddit", redditRoutes);
app.use("/api/landing-page", landingPageRoutes);
app.use("/api/deploy", deployRoutes);
app.use("/api/serp", SERPRoute);
app.use("/api", extractFeatures);
app.use("/api/competitor", competitorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
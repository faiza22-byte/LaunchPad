import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const deployLandingPage = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        success: false,
        error: "Missing HTML content",
      });
    }

    // ✅ Generate unique ID
    const id = uuidv4();

    // ✅ Create deployments folder if not exists
    const deployDir = path.join(process.cwd(), "deployments");
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir);
    }

    // ✅ Create project folder
    const projectPath = path.join(deployDir, id);
    fs.mkdirSync(projectPath);

    // ✅ Save index.html
    const filePath = path.join(projectPath, "index.html");
    fs.writeFileSync(filePath, html);

    // ✅ Create public URL (served via express static)
    const liveUrl = `http://localhost:5000/deployments/${id}/index.html`;

    return res.json({
      success: true,
      url: liveUrl,
    });
  } catch (err) {
    console.error("Deploy Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
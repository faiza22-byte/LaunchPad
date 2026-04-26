import React, { useEffect, useState } from "react";
import PptxGenJS from "pptxgenjs";
import { Button } from "../components/ui/button";

export default function PitchDeckGenerator() {
  const [startupData, setStartupData] = useState(null);

  // Helper to safely parse localStorage JSON
  const getJSON = (key, fallback = {}) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return typeof item === "string" ? JSON.parse(item) : item;
    } catch (err) {
      console.warn(`Error parsing ${key}:`, err);
      return fallback;
    }
  };

  useEffect(() => {
    const idea = getJSON("generatedIdea", {});
    const revenueData = getJSON("revenueData", {});
    const marketingData = getJSON("marketingData", {});
    const techStackData = getJSON("techStackData", {});
    const costData = getJSON("costData", {});
    const marketAnalysis = getJSON("market_analysis", {});
    const competitorsData = getJSON("competitorsData", []);

    setStartupData({
      idea,
      revenueData,
      marketingData,
      techStackData,
      costData,
      marketAnalysis,
      competitorsData,
    });
  }, []);

  const generatePitchDeck = () => {
    if (!startupData) return;

    const pptx = new PptxGenJS();

    // --- Slide 1: Cover ---
    const slide1 = pptx.addSlide();
    slide1.addText(startupData.idea.startup_name || "Startup Name", {
      x: 0.5,
      y: 1.5,
      fontSize: 44,
      bold: true,
      color: "363636",
    });
    slide1.addText(startupData.idea.industry || "", {
      x: 0.5,
      y: 3,
      fontSize: 28,
      color: "555555",
    });
    slide1.addText("Pitch Deck", { x: 0.5, y: 4, fontSize: 36, color: "7C3AED" });

    // --- Slide 2: Problem ---
    const slide2 = pptx.addSlide();
    slide2.addText("Problem", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "E11D48" });
    slide2.addText(startupData.idea.problem || "Problem not defined", {
      x: 0.5,
      y: 1.5,
      fontSize: 22,
      color: "111111",
      wrap: true,
      w: 9,
    });

    // --- Slide 3: Solution ---
    const slide3 = pptx.addSlide();
    slide3.addText("Solution", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "10B981" });
    slide3.addText(startupData.idea.solution || startupData.idea.snippet || "Solution not provided", {
      x: 0.5,
      y: 1.5,
      fontSize: 22,
      color: "111111",
      wrap: true,
      w: 9,
    });

    // --- Slide 4: Market Analysis ---
    if (startupData.marketAnalysis) {
      const slide4 = pptx.addSlide();
      slide4.addText("Market Analysis", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "3B82F6" });
      slide4.addText(`Best Keyword: ${startupData.marketAnalysis.bestKeyword || "N/A"}`, {
        x: 0.5,
        y: 1.5,
        fontSize: 20,
      });
      slide4.addText(
        `Top Queries: ${startupData.marketAnalysis.topQueries?.join(", ") || "N/A"}`,
        { x: 0.5, y: 2, fontSize: 20, wrap: true, w: 9 }
      );
    }

    // --- Slide 5: Competitors ---
    if (startupData.competitorsData?.length > 0) {
      const slide5 = pptx.addSlide();
      slide5.addText("Competitors", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "F59E0B" });
      startupData.competitorsData.forEach((c, i) => {
        slide5.addText(`${i + 1}. ${c.title || "No title"} - ${c.domain || ""}`, {
          x: 0.5,
          y: 1.5 + i * 0.5,
          fontSize: 18,
          color: "111111",
          wrap: true,
          w: 9,
        });
      });
    }

    // --- Slide 6: Revenue Streams ---
    if (startupData.revenueData?.revenue_streams?.length > 0) {
      const slide6 = pptx.addSlide();
      slide6.addText("Revenue Streams", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "8B5CF6" });
      startupData.revenueData.revenue_streams.forEach((r, i) => {
        slide6.addText(`${i + 1}. ${r.name || ""}: ${r.description || ""}`, {
          x: 0.5,
          y: 1.5 + i * 1.0,
          fontSize: 18,
          color: "111111",
          wrap: true,
          w: 9,
        });
      });
    }

    // --- Slide 7: Technology Stack ---
    if (startupData.techStackData?.layers?.length > 0) {
      const slide7 = pptx.addSlide();
      slide7.addText("Technology Stack", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "14B8A6" });
      startupData.techStackData.layers.forEach((layer, i) => {
        slide7.addText(`${layer.name}: ${layer.tools?.join(", ") || ""}`, {
          x: 0.5,
          y: 1.5 + i * 0.5,
          fontSize: 18,
          color: "111111",
          wrap: true,
          w: 9,
        });
      });
    }

    // --- Slide 8: Marketing Plan ---
    if (startupData.marketingData?.funnel?.length > 0) {
      const slide8 = pptx.addSlide();
      slide8.addText("Marketing Plan", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "F472B6" });
      startupData.marketingData.funnel.forEach((stage, i) => {
        slide8.addText(`${stage.stage}: ${stage.channels?.join(", ") || ""}`, {
          x: 0.5,
          y: 1.5 + i * 0.5,
          fontSize: 18,
          color: "111111",
          wrap: true,
          w: 9,
        });
      });
    }

    // --- Slide 9: Cost Structure ---
    if (startupData.costData?.cost_structure?.monthly_costs?.categories?.length > 0) {
      const slide9 = pptx.addSlide();
      slide9.addText("Cost Structure", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: "FBBF24" });
      startupData.costData.cost_structure.monthly_costs.categories.forEach((c, i) => {
        slide9.addText(`${c.name}: $${c.monthly_cost}`, {
          x: 0.5,
          y: 1.5 + i * 0.5,
          fontSize: 18,
          wrap: true,
          w: 9,
        });
      });
    }

    // --- Download ---
    pptx.writeFile({ fileName: `${startupData.idea.startup_name || "Startup"}-Pitch-Deck.pptx` });
  };

  if (!startupData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">{startupData.idea.startup_name || "Startup"} Pitch Deck</h1>
      <Button
        onClick={generatePitchDeck}
        className="px-6 py-3 text-lg font-semibold bg-purple-500 text-white rounded-xl hover:bg-purple-600"
      >
        Download PowerPoint
      </Button>
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import ProgressBar from "../components/ui/ProgressBar";

export default function DetailsStep2() {
  const [, setLocation] = useLocation();

  const [budget, setBudget] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [region, setRegion] = useState("");
  const [customRegion, setCustomRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");

    const finalBudget = budget === "Other" ? customBudget.trim() : budget;
    const finalRegion = region === "Other" ? customRegion.trim() : region;

    if (!finalBudget || !finalRegion) {
      setError("Please fill all required fields.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const prompt = localStorage.getItem("ideaPrompt");
    const industry = localStorage.getItem("industry");
    const technology = localStorage.getItem("technology");

    if (!user || !prompt || !industry || !technology) {
      setError("Missing user or previous step data.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            industry,
            technology,
            budget: finalBudget,
            region: finalRegion,
            user,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      // ✅ Ensure backend returned valid structured data
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response from AI");
      }

      // ✅ Save result safely
      localStorage.setItem("generatedIdea", JSON.stringify(data));

      // ✅ Navigate to result page
      setLocation("/result");

    } catch (err) {
      console.error("Failed to generate ideas:", err);

      if (err.message.includes("Failed to fetch")) {
        setError(
          "⚠️ Cannot connect to backend. Make sure server is running on port 5000"
        );
      } else if (err.message.includes("Invalid response")) {
        setError("⚠️ AI returned invalid data. Try again.");
      } else {
        setError(err.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 bg-gradient-to-b from-purple-50 to-white relative">

      {/* PROGRESS BAR */}
      <div className="w-full max-w-4xl mb-8">
        <ProgressBar step={2} />
      </div>

      {/* FORM */}
      <div className="max-w-md w-full space-y-6 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200 relative z-10">
        <h2 className="text-3xl font-extrabold text-center text-foreground tracking-tight">
          Final Details
        </h2>

        <p className="text-center text-muted-foreground">
          Select your budget and region for your startup idea.
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* BUDGET */}
        <select
          onChange={(e) => setBudget(e.target.value)}
          value={budget}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="">Select Budget</option>
          <option>Low (&lt; $5k)</option>
          <option>Medium ($5k–$50k)</option>
          <option>High ($50k+)</option>
          <option>Other</option>
        </select>

        {budget === "Other" && (
          <input
            type="text"
            placeholder="Enter your budget"
            value={customBudget}
            onChange={(e) => setCustomBudget(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-300 transition"
          />
        )}

        {/* REGION */}
        <select
          onChange={(e) => setRegion(e.target.value)}
          value={region}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="">Select Region</option>
          <option>Global</option>
          <option>Pakistan</option>
          <option>South Asia</option>
          <option>USA / Europe</option>
          <option>Other</option>
        </select>

        {region === "Other" && (
          <input
            type="text"
            placeholder="Enter your region"
            value={customRegion}
            onChange={(e) => setCustomRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-300 transition"
          />
        )}

        {/* BUTTON */}
        <Button
          onClick={handleGenerate}
          className="w-full py-4 bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg text-white font-semibold rounded-2xl transition-all"
          disabled={
            loading ||
            !budget ||
            !region ||
            (budget === "Other" && !customBudget.trim()) ||
            (region === "Other" && !customRegion.trim())
          }
        >
          {loading ? "Generating..." : "Generate Ideas 🚀"}
        </Button>
      </div>

      {/* DECOR */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse pointer-events-none" />
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import ProgressBar from "../components/ui/ProgressBar";
import { motion } from "framer-motion";

export default function DetailsStep1() {
  const [, setLocation] = useLocation();

  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [technology, setTechnology] = useState("");
  const [customTechnology, setCustomTechnology] = useState("");

  const handleNext = () => {
    const finalIndustry = industry === "Other" ? customIndustry.trim() : industry;
    const finalTechnology = technology === "Other" ? customTechnology.trim() : technology;

    if (!finalIndustry || !finalTechnology) return;

    localStorage.setItem("industry", finalIndustry);
    localStorage.setItem("technology", finalTechnology);

    setLocation("/details-2");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 bg-gradient-to-b from-purple-50 to-white relative">

      {/* PROGRESS BAR */}
      <div className="w-full max-w-4xl mb-8">
        <ProgressBar step={1} />
      </div>

      {/* FORM CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-6 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200 relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-center text-foreground tracking-tight">
          Customize Your Idea
        </h2>

        <p className="text-center text-muted-foreground">
          Select the industry and technology for your startup idea.
        </p>

        {/* INDUSTRY SELECT */}
        <select
          onChange={(e) => setIndustry(e.target.value)}
          value={industry}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        >
          <option value="">Select Industry</option>
          <option>Food & Delivery</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>E-commerce</option>
          <option>Finance</option>
          <option>AI / SaaS</option>
          <option>Other</option>
        </select>

        {/* CUSTOM INDUSTRY INPUT */}
        {industry === "Other" && (
          <motion.input
            type="text"
            placeholder="Enter your industry"
            value={customIndustry}
            onChange={(e) => setCustomIndustry(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`w-full p-3 border border-gray-300 rounded-xl 
              focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-60
              transition-all duration-300
              ${customIndustry ? "ring-2 ring-purple-400" : ""}`}
          />
        )}

        {/* TECHNOLOGY SELECT */}
        <select
          onChange={(e) => setTechnology(e.target.value)}
          value={technology}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        >
          <option value="">Select Technology</option>
          <option>AI/ML</option>
          <option>Mobile App</option>
          <option>Web Platform</option>
          <option>Blockchain</option>
          <option>IoT</option>
          <option>Other</option>
        </select>

        {/* CUSTOM TECHNOLOGY INPUT */}
        {technology === "Other" && (
          <motion.input
            type="text"
            placeholder="Enter your technology"
            value={customTechnology}
            onChange={(e) => setCustomTechnology(e.target.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`w-full p-3 border border-gray-300 rounded-xl 
              focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-60
              transition-all duration-300
              ${customTechnology ? "ring-2 ring-purple-400" : ""}`}
          />
        )}

        {/* NEXT BUTTON */}
        <Button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg text-white font-semibold rounded-2xl transition-all"
          disabled={
            !industry ||
            !technology ||
            (industry === "Other" && !customIndustry.trim()) ||
            (technology === "Other" && !customTechnology.trim())
          }
        >
          Next →
        </Button>
      </motion.div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse pointer-events-none" />
    </div>
  );
}
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";

const colors = [
  "from-pink-200 via-purple-200 to-indigo-200",
  "from-yellow-200 via-orange-200 to-pink-200",
  "from-green-200 via-teal-200 to-blue-200",
  "from-purple-200 via-indigo-200 to-blue-200",
];

export default function RevenueSlides() {
  const [, setLocation] = useLocation();
  const [revenue, setRevenue] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleBack = () => setLocation("/result");

  useEffect(() => {
  const fetchRevenue = async () => {
    try {
      const idea = JSON.parse(localStorage.getItem("generatedIdea"));
      if (!idea) return;

      const response = await fetch("http://localhost:5000/api/revenue-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedIdea: idea.startup_name || idea.generatedIdea,
          revenue_streams: idea.revenue_streams || [
            "Subscription plans",
            "Freemium model",
            "Ads",
            "Affiliate marketing"
          ],
        }),
      });

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (data.success) {
        setRevenue(data);

        // ✅ Store in localStorage
        localStorage.setItem(
          "revenueData",
          JSON.stringify(data)
        );

        // Optional: also attach to generatedIdea
        localStorage.setItem(
          "generatedIdea",
          JSON.stringify({ ...idea, revenue_data: data })
        );
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // First, check if we already have stored revenue data
  const storedRevenue = localStorage.getItem("revenueData");
  if (storedRevenue) {
    setRevenue(JSON.parse(storedRevenue));
    setLoading(false);
  } else {
    fetchRevenue();
  }
}, []);

  const nextSlide = () => {
    if (index < revenue.revenue_streams.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (loading || !revenue) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">

      {/* Glass Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-10 flex flex-col items-center gap-6">

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 via-green-400/10 to-emerald-500/20 blur-2xl opacity-50"></div>

        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Main Text */}
        <h3 className="text-white text-xl font-semibold tracking-wide">
          Generating revenue strategies
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </h3>

        {/* Steps */}
        <div className="flex flex-col gap-2 text-sm text-white/70 text-center">
          <p className="animate-pulse">Exploring monetization models...</p>
          <p className="animate-pulse delay-200">Analyzing profitability...</p>
          <p className="animate-pulse delay-500">Structuring revenue streams...</p>
        </div>

      </div>
    </div>
  );
}

  const item = revenue.revenue_streams[index];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 p-6">

       <div className="absolute top-6 right-40 z-50">
  <motion.button
    onClick={handleBack}
    whileHover={{ scale: 1.1 }} // slight hover pop
    whileTap={{ scale: 0.95 }}
    className="relative flex items-center gap-3 px-8 py-4 rounded-full 
               backdrop-blur-xl bg-white/70 border border-white/60 
               shadow-xl overflow-hidden"
  >
    {/* Glow effect */}
    <div
      className="absolute inset-0 rounded-full 
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 opacity-30 blur-xl"
      style={{ zIndex: 0 }}
    />

    {/* Animated Arrow */}
    <motion.span
      animate={{ x: [0, -5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="relative text-gray-900 z-10 text-xl" // larger arrow
    >
      ←
    </motion.span>

    {/* Back Text */}
    <span className="relative text-lg font-bold text-gray-900 z-10">
      Back
    </span>
  </motion.button>
</div>

     

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -100, rotate: -2 }}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-xl rounded-3xl p-8 shadow-2xl bg-gradient-to-br ${colors[index % colors.length]} relative`}
        >
          {/* Cute Badge */}
          <div className="absolute top-4 right-4 bg-white/70 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Revenue Idea
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            💰 {item.name}
          </h1>

          {/* Description */}
          <p className="text-gray-800 text-lg mb-4">
            {item.description}
          </p>

          {/* Analysis */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl">
            <p className="text-gray-700 italic">
              {item.analysis}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-8">

        <Button
          onClick={prevSlide}
          disabled={index === 0}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-white shadow"
        >
          <ChevronLeft />
        </Button>

        <div className="flex gap-2">
          {revenue.revenue_streams.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-purple-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextSlide}
          disabled={index === revenue.revenue_streams.length - 1}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-white shadow"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
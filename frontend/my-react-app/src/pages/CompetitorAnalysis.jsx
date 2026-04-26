import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function CompetitorAnalysis() {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const keyword = localStorage.getItem("bestKeyword");

  const fetchCompetitors = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/serp/competitors?keyword=${encodeURIComponent(keyword)}`
      );

      const data = await res.json();

      if (data.success) {
        setCompetitors(data.competitors);

        localStorage.setItem(
          "competitorsData",
          JSON.stringify(data.competitors)
        );
      }

    } catch (error) {
      console.error("Error fetching competitors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("competitorsData");

    if (cachedData) {
      setCompetitors(JSON.parse(cachedData));
    } else {
      fetchCompetitors();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 relative">

      {/* 🔝 TOP RIGHT BUTTONS */}
      <div className="absolute top-6 right-6 flex gap-4 items-center z-40">

        {/* BACK BUTTON */}
        <motion.button
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2 px-5 py-2 rounded-full 
                     backdrop-blur-xl bg-white/20 border border-white/30 
                     shadow-xl overflow-hidden"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
          <span className="text-sm font-semibold text-white">
            Back
          </span>
        </motion.button>

        {/* EXTRACT FEATURES BUTTON */}
        <motion.button
          onClick={() => setLocation("/features")}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            scale: [1, 1.04, 1],
            boxShadow: [
              "0 0 12px rgba(34,197,94,0.25)",
              "0 0 30px rgba(16,185,129,0.5)",
              "0 0 12px rgba(34,197,94,0.25)"
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 px-6 py-2 rounded-full 
                     backdrop-blur-xl bg-white/20 border border-white/30 
                     shadow-xl overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 
                          opacity-30 blur-2xl animate-pulse" />

          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative w-8 h-8 rounded-full 
                       bg-gradient-to-br from-green-600 to-emerald-500 
                       flex items-center justify-center shadow-md"
          >
            <BarChart3 className="w-4 h-4 text-white" />
          </motion.div>

          <span className="relative text-sm font-extrabold text-white">
            Extract Features
          </span>
        </motion.button>

      </div>

      {/* 🔮 Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-pulse">

            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

            <p className="text-white text-sm font-medium">
              Analyzing competitors...
            </p>

            <p className="text-gray-400 text-xs text-center">
              Gathering market data and insights
            </p>

          </div>
        </div>
      )}

      {/* Page Content */}
      <h1 className="text-2xl font-bold mb-2">
        Related companies
      </h1>

      <p className="text-gray-400 mb-6">
        Following are the websites related to your startup{" "}
        <span className="text-white">{keyword}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {competitors.map((comp, index) => (
          <div
            key={index}
            className="bg-black/80 border border-white/10 rounded-xl p-4 hover:bg-white/5 transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              {comp.title}
            </h2>

            <p className="text-xs text-gray-400 mb-2">
              {comp.domain}
            </p>

            <p className="text-sm text-gray-300 mb-3">
              {comp.snippet}
            </p>

            <a
              href={comp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm hover:underline"
            >
              Visit Website →
            </a>
          </div>
        ))}
      </div>

      {!loading && competitors.length === 0 && (
        <p className="text-gray-500 mt-6">No competitors found.</p>
      )}
    </div>
  );
}
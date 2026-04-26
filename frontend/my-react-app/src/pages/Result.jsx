import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { UserRound } from "lucide-react";
export default function Result() {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useLocation();
 useEffect(() => {
  const storedIdea = localStorage.getItem("generatedIdea");

  if (storedIdea) {
    try {
      const parsed = JSON.parse(storedIdea);
      setIdea(parsed);
    } catch {
      setIdea({ rawText: storedIdea });
    }
  } else {
    setError("No generated idea found. Please complete all steps first.");
  }

  setLoading(false);
}, [location]); // ✅ now valid

  const handleBack = () => setLocation("/details-2");

  if (loading) return <p className="text-center mt-20 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  const sections = [
    { title: "Problem", key: "problem", color: "from-purple-50 to-purple-100", textColor: "text-purple-800" },
    { title: "Solution", key: "solution", color: "from-green-50 to-green-100", textColor: "text-green-800" },
    { title: "Target Market", key: "target_market", color: "from-blue-50 to-blue-100", textColor: "text-blue-800" },
    { title: "Unique Value", key: "unique_value_proposition", color: "from-yellow-50 to-yellow-100", textColor: "text-yellow-800" },
    { title: "Revenue Streams", key: "revenue_streams", color: "from-pink-50 to-pink-100", textColor: "text-pink-800" },
    { title: "Key Metrics", key: "key_metrics", color: "from-indigo-50 to-indigo-100", textColor: "text-indigo-800" },
    { title: "Cost Structure", key: "cost_structure", color: "from-orange-50 to-orange-100", textColor: "text-orange-800" },
    { title: "Marketing Strategy", key: "marketing_strategy", color: "from-teal-50 to-teal-100", textColor: "text-teal-800" },
    { title: "Technology Stack", key: "technology_stack", color: "from-gray-50 to-gray-100", textColor: "text-gray-800" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 bg-gradient-to-b from-gray-50 to-white relative">
     {/* Top Left Buttons */}
<div className="absolute top-6 left-6 flex flex-col gap-3">
  {/* Pitch Deck Button */}
  <motion.button
    onClick={() => setLocation("/pitch-deck")}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative flex items-center gap-2 px-5 py-2 rounded-full 
               backdrop-blur-xl bg-white/30 border border-white/40 shadow-md overflow-hidden"
  >
    <div className="absolute inset-0 rounded-full 
                    bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 
                    opacity-25 blur-xl animate-pulse" />
    <span className="relative text-sm font-semibold text-gray-900">
      Pitch Deck
    </span>
    <motion.span
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-gray-900"
    >
      ↗
    </motion.span>
  </motion.button>

  {/* Get Landing Page Button */}
  <motion.button
    onClick={() => setLocation("/page")}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative flex items-center gap-2 px-5 py-2 rounded-full 
               backdrop-blur-xl bg-white/30 border border-white/40 shadow-md overflow-hidden"
  >
    <div className="absolute inset-0 rounded-full 
                    bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 
                    opacity-25 blur-xl animate-pulse" />
    <span className="relative text-sm font-semibold text-gray-900">
      Get Landing Page
    </span>
  </motion.button>
</div>
    {/* Top Right Validate Button */}
    <div className="absolute top-6 right-6">
      <motion.button
        onClick={() => setLocation("/trends")}
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          scale: [1, 1.03, 1],
          boxShadow: [
            "0 0 10px rgba(99,102,241,0.2)",
            "0 0 25px rgba(168,85,247,0.4)",
            "0 0 10px rgba(99,102,241,0.2)"
          ]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg overflow-hidden"
      >
        {/* Glow Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-25 blur-xl" />
    
        {/* Avatar */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md"
        >
          <UserRound className="w-5 h-5 text-white" />
        </motion.div>
    
        {/* Bold Text */}
        <span className="relative text-base font-extrabold text-gray-900 tracking-wide">
          Validate Your Idea
        </span>
      </motion.button>
    </div>
      {/* Startup Name */}
      {idea.startup_name && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-center text-gray-900 mb-10"
        >
          {idea.startup_name}
        </motion.h1>
      )}

      {/* Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
      >
        {sections.map((section, idx) => {
          const content = idea[section.key];
          if (!content) return null;

          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              }}
              className={`bg-gradient-to-br ${section.color} rounded-3xl p-6 shadow-md flex flex-col border-l-4 border-${section.textColor.split("-")[1]}-500`}
            >
              <div className={`text-lg font-bold mb-3 ${section.textColor}`}>
                {section.title}
              </div>
              <p className="text-gray-900 text-sm leading-relaxed line-clamp-6">{content}</p>

              {/* View More button navigates to dedicated page */}
              <Button
                onClick={() => {
                  // Save the section key in localStorage so detail page knows what to fetch
                  localStorage.setItem("selectedSection", section.key);
                  // Navigate to the dedicated detail page
                  setLocation(`/details/${section.key}`);
                }}
                className="mt-4 self-start bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white rounded-full px-5 py-2 shadow-md text-sm"
              >
                View Detail
              </Button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
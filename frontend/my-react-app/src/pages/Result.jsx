import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";

export default function Result() {
  const [, setLocation] = useLocation();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load idea from localStorage
    const storedIdea = localStorage.getItem("generatedIdea");
    if (storedIdea) {
      try {
        const parsed = JSON.parse(storedIdea);
        setIdea(parsed);

        // Ensure latest version is stored
        localStorage.setItem("generatedIdea", JSON.stringify(parsed));
      } catch {
        const fallback = { rawText: storedIdea };
        setIdea(fallback);
        localStorage.setItem("generatedIdea", JSON.stringify(fallback));
      }
    } else {
      setError("No generated idea found. Please complete all steps first.");
    }
    setLoading(false);
  }, []);

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
      {/* Back Button */}
      <div className="w-full max-w-5xl mb-6">
        <Button
          onClick={handleBack}
          className="bg-white text-black border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
        >
          ← Back
        </Button>
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
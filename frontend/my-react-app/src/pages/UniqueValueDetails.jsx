// frontend/pages/UniqueValueSlides.jsx
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DetailsCard from "../components/ui/DetailsCard";
import { Button } from "../components/ui/button";

// Section configuration: Icon + gradient background
const sectionStyles = {
  unique_statement: { Icon: Lightbulb, bg: "from-green-50 to-green-100" },
  benefits: { Icon: FileText, bg: "from-yellow-50 to-yellow-100" },
  differentiation: { Icon: FileText, bg: "from-purple-50 to-purple-100" },
  narrative: { Icon: FileText, bg: "from-blue-50 to-blue-100" },
};

export default function UniqueValueSlides() {
  const [, setLocation] = useLocation();
  const [uniqueValue, setUniqueValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const sectionKeys = Object.keys(sectionStyles);

  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));

    if (!idea || !idea.unique_value_proposition) {
      setError("No unique value data found. Generate idea first.");
      setLoading(false);
      return;
    }

    if (idea.unique_value_details) {
      setUniqueValue(idea.unique_value_details);
      setLoading(false);
    } else {
      fetchUniqueValueDetails(idea.unique_value_proposition, idea);
    }
  }, []);

  const fetchUniqueValueDetails = async (value, idea) => {
    setLoading(true);
    setError("");
    setUniqueValue(null);
    try {
      const res = await fetch("http://localhost:5000/api/unique-value-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_value: value, generatedIdea: idea }),
      });
      const data = await res.json();
      const detailsData = data.details || {};
      setUniqueValue(detailsData);
      setLoading(false);

      localStorage.setItem(
        "generatedIdea",
        JSON.stringify({ ...idea, unique_value_details: detailsData })
      );
    } catch (err) {
      setError(err.message || "Something went wrong while fetching unique value details.");
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sectionKeys.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + sectionKeys.length) % sectionKeys.length);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 bg-gray-50">
      {/* Back Button */}
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

  <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-10">
        Unique Value
      </h1>

      {loading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">

    {/* Glass Card */}
    <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-10 flex flex-col items-center gap-6">

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-yellow-500/10 to-purple-500/20 blur-2xl opacity-50"></div>

      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
      </div>

      {/* Main Text */}
      <h3 className="text-white text-xl font-semibold tracking-wide">
        Shaping your unique value
        <span className="inline-flex ml-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </span>
      </h3>

      {/* Steps */}
      <div className="flex flex-col gap-2 text-sm text-white/70 text-center">
        <p className="animate-pulse">Defining core value...</p>
        <p className="animate-pulse delay-200">Highlighting differentiation...</p>
        <p className="animate-pulse delay-500">Crafting narrative...</p>
      </div>

    </div>
  </div>
)}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Slides */}
      {uniqueValue && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`w-full p-6 rounded-2xl shadow-xl bg-gradient-to-br ${sectionStyles[sectionKeys[currentSlide]].bg}`}
            >
              <DetailsCard
                title={sectionKeys[currentSlide].replace("_", " ").toUpperCase()}
                sectionKey={sectionKeys[currentSlide]}
                Icon={sectionStyles[sectionKeys[currentSlide]].Icon}
                openSections={{ [sectionKeys[currentSlide]]: true }}
                toggleSection={() => {}}
                gradientClass=""
                iconColorClass="text-gray-700"
              >
                {Array.isArray(uniqueValue[sectionKeys[currentSlide]]) ? (
                  <ul className="list-disc pl-5 space-y-2 text-base md:text-lg">
                    {uniqueValue[sectionKeys[currentSlide]].map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base md:text-lg">{uniqueValue[sectionKeys[currentSlide]]}</p>
                )}
              </DetailsCard>
            </motion.div>
          </AnimatePresence>

          {/* Slide Controls */}
          <div className="mt-6 flex gap-4">
            <Button onClick={prevSlide} className="bg-black-200 text-gray-800 hover:bg-gray-300">
              ← Previous
            </Button>
            <Button onClick={nextSlide} className="bg-black-200 text-gray-800 hover:bg-gray-300">
              Next →
            </Button>
          </div>

         
        </div>
      )}
    </div>
  );
}
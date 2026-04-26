import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Globe, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DetailsCard from "../components/ui/DetailsCard";
import { Button } from "../components/ui/button";

const sectionStyles = {
  demographics: { Icon: Users, bg: "from-pink-50 to-pink-100" },
  region: { Icon: Globe, bg: "from-green-50 to-green-100" },
  budget: { Icon: DollarSign, bg: "from-yellow-50 to-yellow-100" },
  preferences: { Icon: MapPin, bg: "from-blue-50 to-blue-100" },
};

export default function TargetMarketSlides() {
  const [, setLocation] = useLocation();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionKeys = Object.keys(sectionStyles);

  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));
    const storedMarket = JSON.parse(localStorage.getItem("targetMarketDetails"));

    if (!idea || !idea.target_market) {
      setError("No target market data found. Generate idea first.");
      setLoading(false);
      return;
    }

    if (storedMarket) {
      setMarket(storedMarket);
      setLoading(false);
    } else {
      fetchTargetMarketDetails(idea.target_market);
    }
  }, []);

  const fetchTargetMarketDetails = async (marketText) => {
    setLoading(true);
    setError("");
    setMarket(null);
    try {
      const idea = JSON.parse(localStorage.getItem("generatedIdea"));
      const res = await fetch("http://localhost:5000/api/target-market-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_market: marketText, generatedIdea: idea }),
      });
      const data = await res.json();
      const detailsData = data.details || {
        demographics: "",
        region: "",
        budget: "",
        preferences: "",
      };
      setMarket(detailsData);
      setLoading(false);

      // ✅ Store target market details separately
      localStorage.setItem("targetMarketDetails", JSON.stringify(detailsData));
    } catch (err) {
      setError(err.message || "Something went wrong while fetching target market details.");
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sectionKeys.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sectionKeys.length) % sectionKeys.length);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 bg-gray-50">
      {/* Back Button */}
      <div className="absolute top-6 right-40 z-50">
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl"
            style={{ zIndex: 0 }}
          />
          <motion.span
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative text-gray-900 z-10 text-xl"
          >
            ←
          </motion.span>
          <span className="relative text-lg font-bold text-gray-900 z-10">
            Back
          </span>
        </motion.button>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-10">
        Target Market
      </h1>

      {loading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">

    {/* Glass Card */}
    <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-10 flex flex-col items-center gap-6">

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-blue-500/10 to-purple-500/20 blur-2xl opacity-50"></div>

      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
      </div>

      {/* Main Text */}
      <h3 className="text-white text-xl font-semibold tracking-wide">
        Analyzing target market
        <span className="inline-flex ml-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </span>
      </h3>

      {/* Steps */}
      <div className="flex flex-col gap-2 text-sm text-white/70 text-center">
        <p className="animate-pulse">Identifying customer segments...</p>
        <p className="animate-pulse delay-200">Analyzing regions & budgets...</p>
        <p className="animate-pulse delay-500">Mapping preferences...</p>
      </div>

    </div>
  </div>
)}
      {error && <p className="text-center text-red-500">{error}</p>}

      {market && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`w-full p-6 rounded-2xl shadow-lg bg-gradient-to-br ${sectionStyles[sectionKeys[currentSlide]].bg}`}
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
                <p className="text-base md:text-lg">{market[sectionKeys[currentSlide]]}</p>
              </DetailsCard>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex gap-4">
            <Button onClick={prevSlide} className="bg-black-900 text-gray-800 hover:bg-gray-300">
              ← Previous
            </Button>
            <Button onClick={nextSlide} className="bg-black-900 text-gray-800 hover:bg-gray-300">
              Next →
            </Button>
          </div>

          <p className="mt-4 text-gray-600">
            Slide {currentSlide + 1} of {sectionKeys.length}
          </p>
        </div>
      )}
    </div>
  );
}
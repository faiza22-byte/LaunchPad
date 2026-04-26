// frontend/pages/KeyMetricsSlides.jsx
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BarChart3, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";

const sectionStyles = {
  name: { Icon: Activity, bg: "from-blue-50 to-blue-100", title: "Metric Name" },
  description: { Icon: FileText, bg: "from-green-50 to-green-100", title: "Description" },
  analysis: { Icon: BarChart3, bg: "from-purple-50 to-purple-100", title: "Analysis" },
};

export default function KeyMetricsSlides() {
  const [, setLocation] = useLocation();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));

    if (!idea || !idea.key_metrics) {
      setError("No key metrics found. Generate idea first.");
      setLoading(false);
      return;
    }

    // If cached in localStorage, use it
    if (idea.key_metrics_details) {
      setMetrics(idea.key_metrics_details);
      setLoading(false);
    } else {
      fetchMetricsDetails(idea);
    }
  }, []);

  const fetchMetricsDetails = async (idea) => {
    setLoading(true);
    setError("");
    setMetrics([]);

    try {
      const res = await fetch("http://localhost:5000/api/key-metrics-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedIdea: idea.generatedData?.startup_name || "Startup",
          key_metrics: idea.key_metrics,
        }),
      });

      const data = await res.json();

      if (data?.key_metrics && Array.isArray(data.key_metrics)) {
        setMetrics(data.key_metrics);

        // Save in localStorage
        const updatedIdea = { ...idea, key_metrics_details: data.key_metrics };
        localStorage.setItem("generatedIdea", JSON.stringify(updatedIdea));
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch key metrics.");
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % metrics.length);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + metrics.length) % metrics.length);

  if (loading)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">

      {/* Glass Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-10 flex flex-col items-center gap-6">

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-indigo-500/20 blur-2xl opacity-50"></div>

        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Main Text */}
        <h3 className="text-white text-xl font-semibold tracking-wide">
          Analyzing key metrics
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </h3>

        {/* Steps */}
        <div className="flex flex-col gap-2 text-sm text-white/70 text-center">
          <p className="animate-pulse">Identifying success indicators...</p>
          <p className="animate-pulse delay-200">Evaluating performance signals...</p>
          <p className="animate-pulse delay-500">Generating insights...</p>
        </div>

      </div>
    </div>
  );

  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;

  if (!metrics.length) return null;

  const currentMetric = metrics[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 bg-gray-50">
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
        Key Metrics
      </h1>

      {/* Slides */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        {["name", "description", "analysis"].map((field) => {
          const { Icon, bg, title } = sectionStyles[field];
          const content = currentMetric?.[field];

          return (
            <AnimatePresence key={field} mode="wait">
              <motion.div
                key={currentSlide + field}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className={`w-full p-6 rounded-2xl shadow-xl bg-gradient-to-br ${bg}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-8 h-8 text-gray-700" />
                  <h2 className="text-2xl font-semibold">{title}</h2>
                </div>
                <div className="text-base md:text-lg text-gray-700">
                  {content}
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })}

        {/* Controls */}
        <div className="mt-6 flex gap-4">
          <Button
            onClick={prevSlide}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            ← Previous
          </Button>
          <Button
            onClick={nextSlide}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Next →
          </Button>
        </div>

        <p className="mt-4 text-gray-600">
          Metric {currentSlide + 1} of {metrics.length}
        </p>
      </div>
    </div>
  );
}
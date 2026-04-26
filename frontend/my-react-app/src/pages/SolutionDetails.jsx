import {
  CheckCircle,
  FileText,
  Lightbulb,
  Zap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

export default function SolutionDetails() {
  const [, setLocation] = useLocation();

  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));
    const storedSolution = JSON.parse(localStorage.getItem("solutionDetails"));

    if (!idea || !idea.solution) {
      setError("No solution found.");
      setLoading(false);
      return;
    }

    if (storedSolution) {
      setSolution(storedSolution);
      setLoading(false);
    } else {
      fetchSolutionDetails(idea.solution);
    }
  }, []);

  const fetchSolutionDetails = async (solutionText) => {
    try {
      const idea = JSON.parse(localStorage.getItem("generatedIdea"));
      const res = await fetch("http://localhost:5000/api/solution-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution: solutionText, generatedIdea: idea }),
      });

      const data = await res.json();

      const detailsData = data.details || {
        solution_overview: "",
        benefits: [],
        steps: [],
        narrative: "",
      };

      setSolution(detailsData);
      setLoading(false);

      // ✅ Store solution details separately in localStorage
      localStorage.setItem("solutionDetails", JSON.stringify(detailsData));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch solution details");
      setLoading(false);
    }
  };

  if (loading)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">

      {/* Glass Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-10 flex flex-col items-center gap-6">

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-purple-500/20 blur-2xl opacity-50"></div>

        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Main Text */}
        <h3 className="text-white text-xl font-semibold tracking-wide">
          Crafting your solution
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </h3>

        {/* Steps */}
        <div className="flex flex-col gap-2 text-sm text-white/70 text-center">
          <p className="animate-pulse">Designing solution flow...</p>
          <p className="animate-pulse delay-200">Mapping key benefits...</p>
          <p className="animate-pulse delay-500">Structuring execution steps...</p>
        </div>

      </div>
    </div>
  );
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  // 🎯 Slides Config
  const slides = [
    {
      title: "Solution Overview",
      icon: Lightbulb,
      color: "from-purple-50 to-indigo-100",
      content: solution.solution_overview,
    },
    {
      title: "Key Benefits",
      icon: CheckCircle,
      color: "from-green-50 to-emerald-100",
      content: solution.benefits,
      isBenefits: true,
    },
    {
      title: "How It Works",
      icon: Zap,
      color: "from-blue-50 to-cyan-100",
      content: solution.steps,
      isSteps: true,
    },
    {
      title: "Narrative",
      icon: FileText,
      color: "from-pink-50 to-rose-100",
      content: solution.narrative,
    },
  ];

  const nextSlide = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));

  const prevSlide = () =>
    setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 p-6">
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
        Solution
      </h1>

      {/* Slide */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-3xl p-10 rounded-3xl shadow-xl bg-gradient-to-br ${slide.color} border border-white/40`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{slide.title}</h2>
        </div>

        {/* Content Types */}
        {slide.isBenefits && (
          <div className="flex flex-wrap gap-3">
            {slide.content?.map((b, idx) => (
              <span
                key={idx}
                className="bg-white px-4 py-2 rounded-full shadow-sm text-gray-800 text-sm font-medium"
              >
                ✔ {b}
              </span>
            ))}
          </div>
        )}

        {slide.isSteps && (
          <div className="space-y-4">
            {slide.content?.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/80 p-4 rounded-xl shadow-sm flex items-start gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-800">{step}</p>
              </div>
            ))}
          </div>
        )}

        {!slide.isBenefits && !slide.isSteps && (
          <p className="text-lg leading-relaxed text-gray-800">{slide.content}</p>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-8">
        <Button onClick={prevSlide} disabled={currentSlide === 0}>
          <ArrowLeft />
        </Button>

        <span className="text-gray-600 font-medium">
          {currentSlide + 1} / {slides.length}
        </span>

        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
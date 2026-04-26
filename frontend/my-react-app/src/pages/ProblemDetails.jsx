import {
  AlertCircle,
  BookOpen,
  FileText,
  Zap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

export default function ProblemDetails() {
  const [, setLocation] = useLocation();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));
    const storedDetails = JSON.parse(localStorage.getItem("problemDetails"));

    if (!idea || !idea.problem) {
      setError("No problem statement found.");
      setLoading(false);
      return;
    }

    if (storedDetails) {
      setDetails(storedDetails);
      setLoading(false);
    } else {
      fetchProblemDetails(idea.problem);
    }
  }, []);

  const fetchProblemDetails = async (problemStatement) => {
    try {
      const idea = JSON.parse(localStorage.getItem("generatedIdea"));
      const res = await fetch("http://localhost:5000/api/problem-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problemStatement, generatedIdea: idea }),
      });

      const data = await res.json();

      const detailsData = data.problem_details || {
        background: "",
        pain_points: [],
        implications: "",
        narrative: "",
      };

      setDetails(detailsData);
      setLoading(false);

      // Store separately in localStorage
      localStorage.setItem("problemDetails", JSON.stringify(detailsData));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problem details");
      setLoading(false);
    }
  };

 if (loading)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">

      {/* Glass Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-10 flex flex-col items-center gap-6">

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-blue-500/20 blur-2xl opacity-50"></div>

        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Main Text */}
        <h3 className="text-white text-xl font-semibold tracking-wide">
          Analyzing problem deeply
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </h3>

        {/* Steps */}
        <div className="flex flex-col gap-2 text-sm text-white/70 text-center">
          <p className="animate-pulse">Understanding context...</p>
          <p className="animate-pulse delay-200">Extracting pain points...</p>
          <p className="animate-pulse delay-500">Building insights...</p>
        </div>

      </div>
    </div>
  );
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  const slides = [
    {
      title: "Background",
      icon: BookOpen,
      color: "from-blue-50 to-indigo-100",
      content: details.background,
    },
    {
      title: "Pain Points",
      icon: AlertCircle,
      color: "from-red-50 to-pink-100",
      content: details.pain_points,
      isList: true,
    },
    {
      title: "Implications",
      icon: Zap,
      color: "from-yellow-50 to-orange-100",
      content: details.implications,
    },
    {
      title: "Narrative",
      icon: FileText,
      color: "from-green-50 to-teal-100",
      content: details.narrative,
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
        Problem
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

        {/* Content */}
        {slide.isList ? (
          <div className="space-y-4">
            {slide.content?.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur p-4 rounded-xl flex items-start gap-3 shadow-sm border"
              >
                <ArrowRight className="mt-1 text-gray-600" />
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        ) : (
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
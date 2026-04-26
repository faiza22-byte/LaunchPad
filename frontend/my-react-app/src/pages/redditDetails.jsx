import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Download,
    Lightbulb,
    Link as LinkIcon,
    MessageCircle,
    Target,
} from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MarketAnalysisSlides() {
  const [, setLocation] = useLocation();
  const reportRef = useRef();

  const [analysis, setAnalysis] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBack = () => setLocation("/trends");

 useEffect(() => {
  const fetchAnalysis = async () => {
    try {
      const cached = localStorage.getItem("market_analysis");

      if (cached) {
        const parsed = JSON.parse(cached);

        setAnalysis(parsed.analysis);
        setPosts(parsed.posts || []);
        setLoading(false);
        return;
      }

      const ideaData = JSON.parse(localStorage.getItem("generatedIdea"));
      const keyword = ideaData?.keyword || "specialized tools online";

      const res = await fetch("http://localhost:5000/api/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const data = await res.json();

      if (!data.success) throw new Error("API failed");

      setAnalysis(data.analysis);
      setPosts(data.posts || []);

      // ✅ store FULL response (analysis + posts + proof)
      localStorage.setItem("market_analysis", JSON.stringify(data));

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis");
      setLoading(false);
    }
  };

  fetchAnalysis();
}, []);
useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [currentSlide]);
  const nextSlide = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));

  const prevSlide = () =>
    setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const handleRetry = () => {
    localStorage.removeItem("market_analysis");
    setLoading(true);
    setError("");
    window.location.reload();
  };

  // ✅ PDF Export
  const exportPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("market-analysis.pdf");
  };

  // ✅ Sentiment chart (simple mock distribution)
  const sentimentData = [
    { name: "Positive", value: 40 },
    { name: "Neutral", value: 35 },
    { name: "Negative", value: 25 },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  const slides = [
  {
    title: "Market Analysis",
    icon: BarChart3,
    color: "from-purple-100 to-indigo-200",
    type: "intro",
  },
  {
    title: "Pain Points",
    icon: AlertTriangle,
    color: "from-purple-50 to-indigo-100",
    content: analysis?.pain_points?.slice(0, 10) || [],
    type: "list",
  },
  {
    title: "Complaints",
    icon: MessageCircle,
    color: "from-red-50 to-rose-100",
    content: analysis?.complaints?.slice(0, 10) || [],
    type: "list",
  },
  {
    title: "Feature Requests",
    icon: Lightbulb,
    color: "from-yellow-50 to-amber-100",
    content: analysis?.feature_requests?.slice(0, 10) || [],
    type: "list",
  },
  {
    title: "Opportunities",
    icon: Target,
    color: "from-green-50 to-emerald-100",
    content: analysis?.opportunities?.slice(0, 10) || [],
    type: "list",
  },
  {
    title: "Sentiment Analysis",
    icon: BarChart3,
    color: "from-blue-50 to-cyan-100",
    type: "chart",
  },
  {
    title: "Analysis Proof (Reddit Sources)",
    icon: LinkIcon,
    color: "from-pink-50 to-purple-100",
    content: analysis?.analysis_proof || [],
    type: "links",
  },
];

  const slide = slides[currentSlide];
  const Icon = slide?.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 p-6 relative">

   <div className="absolute top-6 right-6 z-50 flex items-center gap-4">

  {/* BACK BUTTON */}
  <motion.button
    onClick={handleBack}
    initial={{ opacity: 1, scale: 1 }}
    animate={{
      scale: [1, 1.03, 1],
      boxShadow: [
        "0 0 10px rgba(34,197,94,0.2)",
        "0 0 25px rgba(16,185,129,0.4)",
        "0 0 10px rgba(34,197,94,0.2)"
      ]
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="relative flex items-center gap-3 px-6 py-3 rounded-full 
               backdrop-blur-xl bg-white/30 border border-white/40 
               shadow-lg overflow-hidden"
  >
    {/* Glow Background */}
    <div className="absolute inset-0 rounded-full 
                    bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 
                    opacity-25 blur-xl" />

    {/* Icon Circle */}
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-10 h-10 rounded-full 
                 bg-gradient-to-br from-green-500 to-emerald-600 
                 flex items-center justify-center shadow-md"
    >
      <ArrowLeft className="w-5 h-5 text-white" />
    </motion.div>

    {/* Text */}
    <span className="relative text-base font-extrabold text-gray-900 tracking-wide">
      Go Back
    </span>
  </motion.button>


  {/* EXPORT BUTTON */}
  <motion.button
    onClick={exportPDF}
    initial={{ opacity: 1, scale: 1 }}
    animate={{
      scale: [1, 1.03, 1],
      boxShadow: [
        "0 0 10px rgba(59,130,246,0.2)",
        "0 0 25px rgba(147,197,253,0.4)",
        "0 0 10px rgba(59,130,246,0.2)"
      ]
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="relative flex items-center gap-3 px-6 py-3 rounded-full 
               backdrop-blur-xl bg-white/30 border border-white/40 
               shadow-lg overflow-hidden"
  >
    {/* Glow Background */}
    <div className="absolute inset-0 rounded-full 
                    bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 
                    opacity-25 blur-xl" />

    {/* Icon Circle */}
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="relative w-10 h-10 rounded-full 
                 bg-gradient-to-br from-blue-500 to-indigo-600 
                 flex items-center justify-center shadow-md"
    >
      <Download className="w-5 h-5 text-white" />
    </motion.div>

    {/* Text */}
    <span className="relative text-base font-extrabold text-gray-900 tracking-wide">
      Export PDF
    </span>
  </motion.button>

</div>

<style>
{`
@keyframes shine {
  0% { left: -100%; }
  100% { left: 200%; }
}
`}
</style>

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-white/40">
          <motion.div className="text-lg font-medium text-gray-700">
            Loading analysis...
          </motion.div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center mt-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && analysis && (
        <>
          <div ref={reportRef} className="w-full max-w-5xl">

            {/* SLIDE */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-10 rounded-3xl shadow-xl bg-gradient-to-br ${slide.color}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon />
                <h2 className="text-3xl font-bold">{slide.title}</h2>
              </div>

              {/* LIST */}
              {slide.type === "list" && (
                <div className="flex flex-wrap gap-4">
                  {slide.content.map((item, i) => (
                    <span
                      key={i}
                      className="bg-white px-5 py-3 rounded-full font-semibold shadow"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* CHART */}
              {slide.type === "chart" && (
                <div className="w-full h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
               
{/* TOP INTRO (OUTSIDE CARD) */}
{currentSlide === 0 && (
  <div className="mb-10 text-center space-y-6">

    {/* Heading */}
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide
                   text-transparent bg-clip-text 
                   bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
                   animate-[gradientShift_5s_ease_infinite]">
      Reddit Market Analysis
    </h1>

    {/* Description */}
    <div className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
      Reddit analysis helps validate your idea by analyzing real conversations from users across communities.
      It uncovers pain points, complaints, feature requests, and emerging needs directly from people discussing real problems.

      <p className="mt-3 text-sm text-gray-600">
        This allows you to understand genuine demand, identify market gaps,
        and build solutions people actually want — reducing the risk of failure.
      </p>
    </div>

    {/* FEATURE BUTTONS */}
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {slides.slice(1).map((s, i) => {
        const IconBtn = s.icon;
        return (
          <motion.button
            key={i}
            onClick={() => setCurrentSlide(i + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 10px rgba(168,85,247,0.2)",
                "0 0 25px rgba(236,72,153,0.4)",
                "0 0 10px rgba(168,85,247,0.2)"
              ]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative flex items-center gap-2 px-5 py-2 rounded-full
                       backdrop-blur-xl bg-white/30 border border-white/40
                       shadow-lg overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-full 
                            bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 
                            opacity-25 blur-xl" />

            {/* Icon */}
            <IconBtn className="relative w-4 h-4 text-gray-800" />

            {/* Text */}
            <span className="relative font-semibold text-gray-900 text-sm">
              {s.title}
            </span>
          </motion.button>
        );
      })}
    </div>

  </div>
)}
<style>
{`
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
</style>
              {/* LINKS */}
              {slide.type === "links" && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {slide.content.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="block bg-white p-3 rounded-xl shadow hover:underline text-blue-600"
                    >
                      Reddit Source {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>

            {/* REDDIT POSTS PREVIEW */}
            {slide.type === "links" && (
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
    {posts.slice(0, 6).map((post, i) => (
      <div key={i} className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-bold text-sm mb-2">{post.title}</h3>

        <p className="text-xs text-gray-500">
          r/{post.subreddit}
        </p>

        <p className="text-xs">
          👍 {post.upvotes} | 💬 {post.comments}
        </p>

        <a
          href={post.url}
          target="_blank"
          className="text-blue-500 text-xs underline"
        >
          View Post
        </a>
      </div>
    ))}
  </div>
)}
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center gap-6 mt-8">
            <Button onClick={prevSlide} disabled={currentSlide === 0}>
              <ArrowLeft />
            </Button>

            <span>
              {currentSlide + 1} / {slides.length}
            </span>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
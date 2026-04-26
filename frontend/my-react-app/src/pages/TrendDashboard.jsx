import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { motion } from "framer-motion";
import {  BarChart3 } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
export default function TrendDashboard() {
  const [data, setData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
  const fetchTrends = async () => {
    try {
      setLoading(true);

      // ✅ CHECK CACHE FIRST
      const cachedData = localStorage.getItem("trendsData");

      if (cachedData) {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      const generatedIdeaRaw = localStorage.getItem("generatedIdea");
      const industry = localStorage.getItem("industry");
      const technology = localStorage.getItem("technology");
      const region = localStorage.getItem("region");

      if (!generatedIdeaRaw) throw new Error("No generatedIdea found in localStorage");

      const generatedIdea = JSON.parse(generatedIdeaRaw);

      const res = await fetch("http://localhost:5000/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: industry || "N/A",
          technology: technology || "N/A",
          region: region || "",
          idea: generatedIdea,
        }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message || "Failed to fetch trends");

      const trendsData = result.data;

      // ✅ STORE COMPLETE RESPONSE
      localStorage.setItem("trendsData", JSON.stringify(trendsData));

      // ✅ STORE BEST KEYWORD
      if (trendsData?.bestKeyword?.keyword) {
        localStorage.setItem("bestKeyword", trendsData.bestKeyword.keyword);
      }

      // ✅ STORE ALL KEYWORDS
      if (trendsData?.allKeywords) {
        localStorage.setItem("allKeywords", JSON.stringify(trendsData.allKeywords));
      }

      setData(trendsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchTrends();
}, []);

  const LoadingModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-semibold">Loading Trends</p>
        <p className="text-sm text-gray-500">Analyzing insights...</p>
      </div>
    </div>
  );

  if (loading) return <LoadingModal />;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!data) return <div className="p-6">No data available</div>;

  const slides = ["Overview", "Keyword Trends", "Regions"];
  const selectedKeyword = data.allKeywords?.[selectedKeywordIndex] || data.bestKeyword;

  const Card = ({ children }) => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl transition border border-purple-100">
      {children}
    </div>
  );

  const COLORS = ["#6D28D9", "#8B5CF6", "#A78BFA", "#C4B5FD"];

  const renderOverview = () => {
    const keywordData = data.allKeywords || [];
    const pieData = keywordData.map(k => ({ name: k.keyword, value: k.trendScore }));

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-purple-600 text-sm">Best Matching Keyword </h2>
            <p className="text-2xl font-bold mt-2">{data.bestKeyword?.keyword}</p>
          </Card>

          <Card>
            <h2 className="text-purple-600 text-sm">Trend Score</h2>
            <p className="text-4xl font-extrabold mt-2">{data.bestKeyword?.trendScore}</p>
          </Card>

          <Card>
            <h2 className="text-purple-600 text-sm">Keyword Distribution</h2>
            <div className="h-40">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-6 bg-gradient-to-r from-green-50 to-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-purple-700">
              What is Google Trends Analysis?
            </h3>
          </div>
          <div className="md:w-2/3 text-gray-700 leading-relaxed">
            Google Trends analysis helps validate your idea by measuring real-world search interest over time. By analyzing keyword popularity, regional demand, and related queries, it reveals whether people are actively searching for solutions in your niche. This allows you to identify market demand, detect rising opportunities, and reduce the risk of building products or services with low interest.
            <p className="text-gray-600 mt-3 text-sm">
              Higher and consistent trends indicate strong demand, while rising queries highlight emerging opportunities.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderKeywordTrends = () => (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {data.allKeywords?.map((k, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedKeywordIndex(idx)}
            className={`px-4 py-2 rounded-full text-sm shadow transition transform hover:scale-105 ${
              idx === selectedKeywordIndex
                ? "bg-purple-600 text-white"
                : "bg-green-100 hover:bg-green-200"
            }`}
          >
            {k.keyword}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="mb-2 font-semibold">Interest Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={selectedKeyword?.interestOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6D28D9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 font-semibold">Trend Growth</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={selectedKeyword?.interestOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#6D28D9" fill="#A78BFA" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRegions = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <h2 className="font-semibold mb-3">Top Regions</h2>
        <div className="h-96">
          <ResponsiveContainer>
            <BarChart data={data.topRegions || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6D28D9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Regional Share</h2>
        <div className="h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data.topRegions || []} dataKey="value" nameKey="region" outerRadius={120}>
                {data.topRegions?.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );

  const renderSlideContent = () => {
    switch (activeSlide) {
      case 0: return renderOverview();
      case 1: return renderKeywordTrends();
      case 2: return renderRegions();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-purple-50 to-white p-6 space-y-8">
    <div className="flex flex-col space-y-6">
  
  {/* HEADER */}
  <div className="flex items-center justify-between gap-4 flex-wrap">
    
    {/* LEFT - Back Button */}
    <motion.button
      onClick={() => setLocation("/result")}
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
      className="relative flex items-center gap-3 px-6 py-3 rounded-full 
                 backdrop-blur-xl bg-white/30 border border-white/40 
                 shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 rounded-full 
                      bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 
                      opacity-25 blur-xl" />

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-10 h-10 rounded-full 
                   bg-gradient-to-br from-green-500 to-emerald-600 
                   flex items-center justify-center shadow-md"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </motion.div>

      <span className="relative text-base font-extrabold text-gray-900 tracking-wide">
        Go Back
      </span>
    </motion.button>

    {/* CENTER - TITLE */}
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-center flex-1
      text-transparent bg-clip-text 
      bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
      animate-[gradientShift_5s_ease_infinite]">
      Google Trends Analysis
    </h1>

    {/* RIGHT - BUTTONS STACK */}
    <div className="flex flex-col items-end gap-3">

      {/* Reddit Button */}
      <motion.button
        onClick={() => setLocation("/reddit")}
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          scale: [1, 1.04, 1],
          boxShadow: [
            "0 0 12px rgba(168,85,247,0.25)",
            "0 0 30px rgba(236,72,153,0.5)",
            "0 0 12px rgba(168,85,247,0.25)"
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
        <div className="absolute inset-0 rounded-full 
                        bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 
                        opacity-30 blur-2xl animate-pulse" />

        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative w-8 h-8 rounded-full 
                     bg-gradient-to-br from-purple-600 to-pink-500 
                     flex items-center justify-center shadow-md"
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </motion.div>

        <span className="relative text-sm font-extrabold text-black">
          Reddit View
        </span>
      </motion.button>

      <motion.button
  onClick={() => setLocation("/competitors")}
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
  className="relative flex items-center gap-3 px-7 py-3 rounded-full 
             backdrop-blur-xl bg-white/20 border border-white/30 
             shadow-xl overflow-hidden"
>
  {/* Animated Gradient Glow */}
  <div className="absolute inset-0 rounded-full 
                  bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 
                  opacity-30 blur-2xl animate-pulse" />

  {/* Shine Sweep */}
  <div className="absolute inset-0 overflow-hidden rounded-full">
    <div className="absolute -left-full top-0 h-full w-1/2 
                    bg-white/20 skew-x-[-20deg] 
                    animate-[shine_3s_infinite]" />
  </div>

  {/* Icon Bubble */}
  <motion.div
    animate={{ rotate: [0, 10, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity }}
    className="relative w-10 h-10 rounded-full 
               bg-gradient-to-br from-green-600 to-emerald-500 
               flex items-center justify-center shadow-md"
  >
    <BarChart3 className="w-5 h-5 text-white" />
  </motion.div>

  {/* Text */}
  <span className="relative text-base font-extrabold text-black tracking-wide">
    Competitor Analysis
  </span>
</motion.button>

    </div>
  </div>

  

</div>

      <div className="flex gap-3 flex-wrap justify-center">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`px-5 py-2 rounded-full shadow transition transform hover:scale-105 ${
              activeSlide === idx
                ? "bg-purple-600 text-white"
                : "bg-green-100 hover:bg-green-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {renderSlideContent()}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
export default function CompetitorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [location, setLocation] = useLocation(); // 🔹 wouter navigation

  const goToCompetitorDetails = () => {
    setLocation("/competitor-details");
  };

  const parseScore = (score) => {
    if (!score) return null;
    if (score.overallScore) return score;

    if (score.raw) {
      try {
        const cleaned = score.raw
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        return JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse score:", err);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bestKeyword = localStorage.getItem("bestKeyword");
        const competitors = JSON.parse(
          localStorage.getItem("competitorsData") || "[]"
        );

        const response = await fetch(
          "http://localhost:5000/api/extract-features",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bestKeyword, competitorsData: competitors }),
          }
        );

        const json = await response.json();
        const result = json?.data;

        localStorage.setItem("competitorAnalysis", JSON.stringify(result));
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const cached = localStorage.getItem("competitorAnalysis");

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-t-4 border-green-400 rounded-full mx-auto mb-4"></div>
          <p>Analyzing Competitor...</p>
        </div>
      </div>
    );

  const top = data?.insights?.topCompetitor;
  const score = parseScore(top?.score);

  const radarData = [
    { metric: "Positioning", value: score?.breakdown?.positioning || 0 },
    { metric: "Features", value: score?.breakdown?.features || 0 },
    { metric: "SEO", value: score?.breakdown?.seo || 0 },
    { metric: "Content", value: score?.breakdown?.content || 0 },
    { metric: "Relevance", value: score?.breakdown?.relevance || 0 },
  ];

  const tabs = [
    "overview",
    "performance",
    "strengths",
    "weaknesses",
    "opportunities",
    "strategy",
  ];

  const generateStrategy = () => {
    if (!score) return [];

    const strategies = [];

    if (score.weaknesses?.length)
      strategies.push(`Exploit weakness: ${score.weaknesses[0]}`);

    if (score.opportunities?.length)
      strategies.push(`Capitalize opportunity: ${score.opportunities[0]}`);

    if (score.breakdown?.seo < 70)
      strategies.push("Focus heavily on SEO to outperform competitor");

    if (score.breakdown?.features < 70)
      strategies.push("Build better features and UX differentiation");

    return strategies;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      
      <div className="max-w-5xl mx-auto space-y-6">
         {/* 🔝 TOP RIGHT BUTTONS */}
      <div className="absolute top-6 right-6 flex gap-4 items-center z-40">
        {/* BACK BUTTON */}
        <motion.button
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full 
                     bg-gradient-to-r from-gray-700 to-gray-900 
                     border border-white/20 shadow-lg text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* SEO & REVIEW CHECK BUTTON */}
        <motion.button
          onClick={goToCompetitorDetails}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full 
                     bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 
                     shadow-xl text-white font-bold"
        >
          <BarChart3 className="w-4 h-4" />
          SEO & Review Check
        </motion.button>
      </div>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Competitor Intelligence</h1>
          <p className="text-gray-400 text-sm">AI-powered breakdown</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 justify-center flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full capitalize text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#6b8e23] text-white shadow-lg scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
         {/* OVERVIEW */}
{activeTab === "overview" && (
  <div className="space-y-6">
    {/* Competitor Name */}
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 text-center">
      <p className="text-sm text-gray-400 uppercase tracking-wide">TOP Competitor</p>
      <h2 className="text-3xl font-bold text-white">{top?.competitor}</h2>

      {/* Website Button */}
      {top?.url && (
        <a
          href={top.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-full transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 3h7m0 0v7m0-7L10 14"
            />
          </svg>
          Visit Website
        </a>
      )}
    </div>

    {/* Score */}
    <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl space-y-2 text-center">
      <p className="text-sm text-green-200 uppercase tracking-wide">Score of Matching</p>
      <h2 className="text-5xl font-extrabold text-green-400">
        {score?.overallScore}% <span className="text-lg text-green-200 font-medium">matched</span>
      </h2>
    </div>

    {/* Summary */}
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <p className="text-gray-100 text-base md:text-lg leading-relaxed">
        {score?.summary}
      </p>
    </div>
  </div>
)}

          {/* PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl text-center mb-4">Performance Overview</h2>
                <div className="h-[320px]">
                  <ResponsiveContainer>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis />
                      <Radar
                        dataKey="value"
                        stroke="#84cc16"
                        fill="#84cc16"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                {radarData.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.metric}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRENGTHS */}
          {activeTab === "strengths" && (
            <div className="space-y-3">
              {score?.strengths?.map((s, i) => (
                <div
                  key={i}
                  className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl text-base"
                >
                   {s}
                </div>
              ))}
            </div>
          )}

          {/* WEAKNESSES */}
          {activeTab === "weaknesses" && (
            <div className="space-y-3">
              {score?.weaknesses?.map((w, i) => (
                <div
                  key={i}
                  className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-base"
                >
                   {w}
                </div>
              ))}
            </div>
          )}

          {/* OPPORTUNITIES */}
          {activeTab === "opportunities" && (
            <div className="space-y-3">
              {score?.opportunities?.map((o, i) => (
                <div
                  key={i}
                  className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl text-base"
                >
                   {o}
                </div>
              ))}
            </div>
          )}

          {/* STRATEGY */}
          {activeTab === "strategy" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Your Winning Strategy
              </h2>

              {generateStrategy().map((item, i) => (
                <div
                  key={i}
                  className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl text-base"
                >
                   {item}
                </div>
              ))}

              <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl">
                <p className="text-sm text-gray-300">
                  Focus on building a differentiated product by targeting
                  competitor weaknesses and leveraging uncovered opportunities.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
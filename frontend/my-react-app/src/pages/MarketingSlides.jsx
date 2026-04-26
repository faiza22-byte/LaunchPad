
import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
const marketingData = {
  startup_name: "EduNova",
  overview: {
    goal: "Scale user acquisition through digital-first education marketing."
  },
  budget_allocation: [
    { channel: "Social Media", percentage: 35 },
    { channel: "SEO", percentage: 20 },
    { channel: "Paid Ads", percentage: 25 },
    { channel: "Email", percentage: 10 },
    { channel: "Partnerships", percentage: 10 }
  ],
  funnel: [
    { stage: "Awareness", channels: ["Social Media", "SEO"] },
    { stage: "Interest", channels: ["Landing Pages", "Content"] },
    { stage: "Conversion", channels: ["Ads", "Email"] }
  ],
  campaigns: [
    {
      name: "Back to School Campaign",
      description: "Target students with seasonal offers and discounts."
    },
    {
      name: "Referral Program",
      description: "Encourage users to invite friends with incentives."
    }
  ]
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

export default function MarketingSlides() {
  
  const [currentTab, setCurrentTab] = useState("overview");

  const [data, setData] = useState(marketingData);
  const [,setLocation] = useLocation();
const handleBack = () => setLocation("/result");
useEffect(() => {
  const stored = localStorage.getItem("marketingData");

  if (stored) {
    setData(JSON.parse(stored));
  } else {
    localStorage.setItem("marketingData", JSON.stringify(marketingData));
    setData(marketingData);
  }
}, []);

  const tabs = ["overview", "budget", "funnel", "campaigns"];

  const budgetPie = data.budget_allocation.map((item) => ({
    name: item.channel,
    value: item.percentage
  }));

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center p-6">
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
      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-8">
          {data.startup_name} Marketing Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                currentTab === tab
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {currentTab === "overview" && (
          <div className="text-center space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {data.overview.goal}
            </p>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              className="rounded-2xl mx-auto max-h-72 object-cover shadow-lg mt-6"
              alt="overview"
            />
          </div>
        )}

        {/* BUDGET */}
        {currentTab === "budget" && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Budget Allocation
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={budgetPie} dataKey="value" label outerRadius={140}>
                  {budgetPie.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* FUNNEL */}
{currentTab === "funnel" && (
  <div className="animate-fadeIn space-y-8">
    <h2 className="text-2xl font-semibold text-center">
      Customer Funnel
    </h2>

    <div className="flex flex-col items-center">
      {data.funnel.map((stage, i) => {
        // Dynamic width shrinking (funnel effect)
        const baseWidth = 100;
        const shrinkFactor = 20; // controls narrowing
        const width = baseWidth - i * shrinkFactor;

        return (
          <div
            key={i}
            className="flex flex-col items-center mb-4"
            style={{ width: `${width}%`, maxWidth: "600px" }}
          >
            <div className="w-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center shadow-lg transition-all duration-300 hover:scale-105">
              
              {/* Stage Title */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{stage.stage}</h3>
                <span className="text-xs bg-black/30 px-2 py-1 rounded-full">
                  {i + 1}
                </span>
              </div>

              {/* Channels */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {stage.channels.map((ch, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/10 px-3 py-1 rounded-full"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector Triangle */}
            {i !== data.funnel.length - 1 && (
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "15px solid transparent",
                  borderRight: "15px solid transparent",
                  borderTop: "15px solid rgba(255,255,255,0.15)"
                }}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

        {/* CAMPAIGNS */}
        {currentTab === "campaigns" && (
          <div className="animate-fadeIn space-y-5">
            <h2 className="text-2xl font-semibold text-center">
              Campaigns
            </h2>

            {data.campaigns.map((c, i) => (
              <div
                key={i}
                className="bg-white/10 hover:bg-white/15 transition p-5 rounded-2xl shadow"
              >
                <h3 className="text-lg font-bold">{c.name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
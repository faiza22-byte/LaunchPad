import React, { useState, useEffect } from "react";
import costData from "../json/cost.json";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import BackButton from "../components/ui/BackButton";
import { useLocation } from "wouter";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8dd1e1", "#a4de6c"];

export default function CostStructureSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState(null);
  const [, setLocation] = useLocation();
  const slides = ["overview", "bar", "pie", "projection"];
  const handleBack = () => setLocation("/result");
  // ✅ Load + Save LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("costData");

    if (stored) {
      console.log("✅ Loaded cost data from localStorage");
      setData(JSON.parse(stored));
    } else {
      console.log("💾 Saving cost data to localStorage");
      localStorage.setItem("costData", JSON.stringify(costData));
      setData(costData);
    }
  }, []);

  // ✅ Loading state
  if (!data) {
    return (
      <p className="text-center mt-20 text-white animate-pulse">
        📊 Loading Cost Structure...
      </p>
    );
  }

  // ✅ Extract data safely
  const categories = data.cost_structure?.monthly_costs?.categories || [];
  const summary = data.cost_structure?.summary || {};

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const pieData = Object.entries(
    summary.cost_distribution_percentage || {}
  ).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      
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

      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-xl p-6">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Cost Structure - {data.cost_structure?.startup_name || "Startup"}
        </h1>

        {/* Navigation */}
        <div className="flex justify-between mb-6">
          <button
            onClick={prevSlide}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Prev
          </button>

          <button
            onClick={nextSlide}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Next
          </button>
        </div>

        {/* Slides */}
        <div>

          {/* Overview Slide */}
          {slides[currentSlide] === "overview" && (
            <div className="space-y-4 text-center animate-fadeIn">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p>Total Monthly Cost: ${summary.total_monthly_cost || 0}</p>
              <p>Fixed Costs: ${summary.fixed_vs_variable?.fixed_costs || 0}</p>
              <p>Variable Costs: ${summary.fixed_vs_variable?.variable_costs || 0}</p>
            </div>
          )}

          {/* Bar Chart Slide */}
          {slides[currentSlide] === "bar" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Monthly Cost per Category
              </h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categories}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="monthly_cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart Slide */}
          {slides[currentSlide] === "pie" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Cost Distribution
              </h2>

              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={150}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Projection Slide */}
          {slides[currentSlide] === "projection" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Monthly Cost Projection
              </h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={summary.monthly_projection || []}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
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
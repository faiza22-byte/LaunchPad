import React, { useState, useEffect } from "react";
import techData from "../json/eduadaptTechStack.json";
import { motion } from "framer-motion";
import {useLocation} from "wouter";
export default function TechStacks() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [particles, setParticles] = useState([]);
  const [data, setData] = useState(null);

  // ✅ Load + Save LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("techStackData");

    if (stored) {
      console.log("✅ Loaded tech stack from localStorage");
      setData(JSON.parse(stored));
    } else {
      console.log("💾 Saving tech stack to localStorage");
      localStorage.setItem("techStackData", JSON.stringify(techData));
      setData(techData);
    }
  }, []);
  const [, setLocation] = useLocation();
  const handleBack = () => setLocation("/result");
  // ✅ Particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev,
        { id: Date.now() }
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // ✅ Loading state
  if (!data) {
    return (
      <p className="text-center mt-20 text-white animate-pulse">
        ⚙️ Loading Tech Stack...
      </p>
    );
  }

  const layers = data.layers || [];

  return (
    <div className="w-full max-w-6xl mx-auto text-white p-6 rounded-3xl bg-black border border-white/10 shadow-2xl">
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
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">
        {data.project} System Design
      </h2>

      <p className="text-center text-gray-500 mb-10">
        {data.domain}
      </p>

      {/* DIAGRAM */}
      <div className="flex flex-col items-center relative">

        {/* User */}
        <Node label="👤 User / Student" color="from-green-600 to-emerald-500" />

        <ArrowWithParticles particles={particles} />

        {layers.map((layer, i) => {
          const isActive = activeLayer === i;

          const gradients = [
            "from-blue-600 to-cyan-500",
            "from-purple-600 to-pink-500",
            "from-indigo-600 to-violet-500",
            "from-orange-500 to-yellow-500",
            "from-emerald-600 to-green-500",
            "from-red-600 to-rose-500"
          ];

          return (
            <div key={i} className="flex flex-col items-center w-full">

              <div
                onClick={() => setActiveLayer(i)}
                className={`w-full max-w-xl cursor-pointer p-6 rounded-2xl border border-white/10 transition-all duration-300 shadow-xl
                bg-gradient-to-r ${gradients[i % gradients.length]}
                ${isActive ? "scale-105 ring-2 ring-cyan-400" : "hover:scale-105 opacity-90"}
                `}
              >
                <h3 className="text-lg font-bold">{layer.name}</h3>
                <p className="text-sm opacity-90 mt-1">
                  {layer.description}
                </p>

                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {layer.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-black/40 px-3 py-1 rounded-full border border-white/20"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {i !== layers.length - 1 && (
                <ArrowWithParticles particles={particles} />
              )}
            </div>
          );
        })}

        <ArrowWithParticles particles={particles} />

        <Node label="⚡ Personalized Output" color="from-pink-600 to-red-500" />
      </div>

      {/* DETAILS */}
      {activeLayer !== null && (
        <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <h3 className="text-xl font-bold text-cyan-300 mb-2">
            {layers[activeLayer].name}
          </h3>

          <p className="text-gray-300 mb-4">
            {layers[activeLayer].description}
          </p>

          <div className="flex flex-wrap gap-2">
            {layers[activeLayer].tools.map((tool, i) => (
              <span
                key={i}
                className="text-xs bg-indigo-600/40 px-3 py-1 rounded-full border border-white/10"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= NODE ================= */
function Node({ label, color }) {
  return (
    <div className={`px-6 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r ${color}`}>
      {label}
    </div>
  );
}

/* ================= ARROW WITH PARTICLES ================= */
function ArrowWithParticles({ particles }) {
  return (
    <div className="relative flex flex-col items-center my-3 w-1">

      {/* Arrow Line */}
      <div className="w-1 h-10 bg-gradient-to-b from-cyan-400/60 to-transparent rounded"></div>

      {/* Moving Particles */}
      {particles.slice(-5).map((p, i) => (
        <span
          key={p.id + "-" + i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-80"
          style={{
            top: `${i * 6}px`,
            animationDuration: "1.5s"
          }}
        />
      ))}

      <div className="text-xs text-gray-500">↓</div>
    </div>
  );
}
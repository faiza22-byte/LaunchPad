// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export function IdeaScore({ score }) {
  let color = "text-red-500";
  let bg = "bg-red-50";
  let border = "border-red-100";
  let label = "High Risk";

  if (score >= 80) {
    color = "text-green-500";
    bg = "bg-green-50";
    border = "border-green-100";
    label = "Strong Potential";
  } else if (score >= 50) {
    color = "text-yellow-500";
    bg = "bg-yellow-50";
    border = "border-yellow-100";
    label = "Moderate Potential";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-6 rounded-3xl border ${border} ${bg} flex items-center gap-6 shadow-sm`}>
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-black/5"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <motion.circle
            className={color}
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-display font-bold ${color}`}>{score}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Viability Score
        </h3>
        <p className={`text-lg font-bold ${color}`}>{label}</p>
        <p className="text-sm text-foreground/70 mt-1 max-w-[200px]">
          Based on market demand, competition, and problem-solution fit.
        </p>
      </div>
    </div>
  );
}
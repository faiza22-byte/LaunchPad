import { motion } from "framer-motion";

export default function ProgressBar({ step }) {
  const steps = ["Idea", "Details", "Budget", "Generate"];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {steps.map((label, index) => {
          const active = index <= step;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {/* Line */}
              {index !== steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-1 bg-gray-200 z-0">
                  <motion.div
                    className="h-1 bg-gradient-to-r from-primary to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: active ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              {/* Circle */}
              <motion.div
                className={`z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                  active
                    ? "bg-gradient-to-r from-primary to-purple-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: active ? 1 : 0.8 }}
              >
                {index + 1}
              </motion.div>

              {/* Label */}
              <span className="text-xs mt-2 text-gray-500">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
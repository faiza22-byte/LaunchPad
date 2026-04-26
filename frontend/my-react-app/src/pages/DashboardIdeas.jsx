import { motion } from "framer-motion";

export default function DashboardIdeas({ ideas, onSelect }) {
  if (!ideas || ideas.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 mt-6">
        No ideas generated yet. Start by entering a prompt above!
      </p>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {ideas.map((idea) => (
        <motion.div
          key={idea._id}
          whileHover={{ y: -5, scale: 1.02 }}
          className="cursor-pointer p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition-all"
          onClick={() => onSelect(idea)}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{idea.generatedData.startup_name || "Untitled Startup"}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[idea.industry, idea.technology, idea.budget, idea.region].map((tag, idx) =>
              tag ? (
                <span
                  key={idx}
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ) : null
            )}
          </div>

          {/* Snippet */}
          <p className="text-gray-700 dark:text-gray-300 text-sm">{idea.snippet}</p>
        </motion.div>
      ))}
    </div>
  );
}
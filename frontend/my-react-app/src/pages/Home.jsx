import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Rocket, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ProgressBar from "../components/ui/ProgressBar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import IdeasSidebar from "../components/IdeasSidebar";

// GPT-Style Modal
function IdeaModal({ idea, onClose }) {
  if (!idea) return null;

  const { generatedData, startup_name, industry, technology, budget, region } = idea;

  const sections = [
    { title: "Problem", value: generatedData.problem },
    { title: "Solution", value: generatedData.solution },
    { title: "Target Market", value: generatedData.target_market },
    { title: "Unique Value Proposition", value: generatedData.unique_value_proposition },
    { title: "Revenue Streams", value: generatedData.revenue_streams },
    { title: "Key Metrics", value: generatedData.key_metrics },
    { title: "Cost Structure", value: generatedData.cost_structure },
    { title: "Marketing Strategy", value: generatedData.marketing_strategy },
    { title: "Technology Stack", value: generatedData.technology_stack },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh] shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-xl"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{startup_name}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {[industry, technology, budget, region].map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            section.value && (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">{section.title}</h3>
                <p className="text-gray-800 dark:text-gray-200 text-sm">{section.value}</p>
              </div>
            )
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/ideas/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setIdeas(data.ideas);
        console.log("Fetched ideas:", data.ideas);
      })
      .catch(console.error);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    localStorage.setItem("ideaPrompt", prompt);
    setLocation("/details-1");
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-start pt-0 p-4 sm:p-8 bg-gradient-to-b from-purple-50 to-white relative">
      
      {/* Progress */}
      <div className="w-full max-w-4xl mb-8">
        <ProgressBar step={0} />
      </div>

      {/* Auth */}
      {!user && (
        <div className="absolute top-6 right-6 flex gap-3 z-50">
         <Button
  className="rounded-xl px-5 py-2 font-medium bg-white !text-black border border-gray-300 hover:bg-gray-100 hover:shadow"
  onClick={() => setLocation("/login")}
>
  Log in
</Button>
          <Button
            className="rounded-xl px-5 py-2 bg-gradient-to-r from-primary to-purple-500 text-white font-semibold hover:shadow-lg"
            onClick={() => setLocation("/signup")}
          >
            Sign up
          </Button>
        </div>
      )}
 
      {/* Main */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI Startup Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground tracking-tight text-balance">
            Turn your spark into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Startup
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Start with a simple idea. We’ll refine it step-by-step using AI.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Tell us your idea — we’ll shape it into something powerful 🚀
        </p>

        {/* Input Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative max-w-2xl w-full group"
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative glass rounded-[2rem] p-2 flex flex-col sm:flex-row gap-2 shadow-2xl">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A startup for smart food delivery using AI..."
              className="min-h-[80px] sm:min-h-[60px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base sm:text-lg px-4 py-4 w-full shadow-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!prompt.trim()}
              className="h-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg hover:shadow-primary/25 transition-all text-white font-semibold sm:w-auto w-full"
            >
              <span className="flex items-center gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </motion.form>

       

       
      </motion.div>

      {/* Idea Modal */}
      {selectedIdea && <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />}

      {/* Decorations */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse pointer-events-none" />
    </div>
  );
}
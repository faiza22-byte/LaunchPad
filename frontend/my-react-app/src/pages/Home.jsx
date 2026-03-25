import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Rocket, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ProgressBar from "../components/ui/ProgressBar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    localStorage.setItem("ideaPrompt", prompt);
    setLocation("/details-1");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 bg-gradient-to-b from-purple-50 to-white relative">

      {/* PROGRESS BAR */}
      <div className="w-full max-w-4xl mb-8">
        <ProgressBar step={0} />
      </div>

      {/* AUTH BUTTONS (scroll with content) */}
      {!user && (
        <div className="absolute top-6 right-6 flex gap-3 z-50">
          <Button
            className="rounded-xl px-5 py-2 font-medium bg-white text-black border border-gray-300 hover:bg-gray-100 hover:shadow"
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

      {/* MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl space-y-8"
      >
        {/* HEADER */}
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

        {/* INPUT FORM */}
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

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 max-w-3xl mx-auto text-left">
          <motion.div whileHover={{ y: -5 }} className="space-y-2 p-6 rounded-2xl bg-white/50 border border-slate-100">
            <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Guided AI Flow</h3>
            <p className="text-sm text-muted-foreground">
              Step-by-step refinement for better startup ideas.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="space-y-2 p-6 rounded-2xl bg-white/50 border border-slate-100">
            <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Smart Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              AI refines your idea with industry insights.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="space-y-2 p-6 rounded-2xl bg-white/50 border border-slate-100">
            <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center text-orange-600 mb-4">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Ready-to-Build Ideas</h3>
            <p className="text-sm text-muted-foreground">
              Get actionable startup ideas instantly.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse pointer-events-none" />
    </div>
  );
}
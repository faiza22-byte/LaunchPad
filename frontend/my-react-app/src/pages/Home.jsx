import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateIdea } from "../hooks/use-ideas";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lightbulb, Rocket, Target } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [, setLocation] = useLocation();
  const createIdea = useCreateIdea();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    createIdea.mutate(
      { prompt },
      {
        onSuccess: (data) => {
          setLocation(`/idea/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full space-y-8"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Idea Validation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground tracking-tight text-balance">
            Turn your spark into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Startup
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Describe your startup idea in a few sentences. Our AI will analyze
            market demand, evaluate competitors, build a pitch deck, and score
            its viability instantly.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto w-full group"
          whileTap={{ scale: 0.995 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative glass rounded-[2rem] p-2 flex flex-col sm:flex-row gap-2 shadow-2xl">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A marketplace for local home-cooked meals..."
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
              disabled={!prompt.trim() || createIdea.isPending}
              className="h-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 transition-all text-white font-semibold sm:w-auto w-full"
            >
              {createIdea.isPending ? (
                "Starting..."
              ) : (
                <span className="flex items-center gap-2">
                  Validate <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </motion.form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto text-left">
          <div className="space-y-2 p-6 rounded-2xl bg-white/50 border border-slate-100">
            <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Market Research</h3>
            <p className="text-sm text-muted-foreground">
              Deep analysis of your target audience and current market demand.
            </p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-white/50 border border-slate-100">
            <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Feasibility Score</h3>
            <p className="text-sm text-muted-foreground">
              Objective scoring based on competition and execution complexity.
            </p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-white/50 border border-slate-100">
            <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center text-orange-600 mb-4">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Go-to-Market</h3>
            <p className="text-sm text-muted-foreground">
              Generated pitch deck content and landing page copy ready to use.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
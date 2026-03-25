import { CheckCircle, FileText, Lightbulb, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DetailsCard from "../components/ui/DetailsCard";
import { Button } from "../components/ui/button";

// Section configuration: plain icons, neutral color
const sectionStyles = {
  solution_overview: { Icon: Lightbulb },
  benefits: { Icon: CheckCircle },
  steps: { Icon: Zap },
  narrative: { Icon: FileText },
};

export default function SolutionDetails() {
  const [, setLocation] = useLocation();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState({
    solution_overview: true,
    benefits: true,
    steps: true,
    narrative: true,
  });

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));
    if (!idea || !idea.solution) {
      setError("No solution found. Generate a solution first.");
      setLoading(false);
      return;
    }

    if (idea.solution_details) {
      setSolution(idea.solution_details);
      setLoading(false);
    } else {
      fetchSolutionDetails(idea.solution, idea);
    }
  }, []);

  const fetchSolutionDetails = async (solutionText, idea) => {
    setLoading(true);
    setError("");
    setSolution(null);
    try {
      const res = await fetch("http://localhost:5000/api/solution-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution: solutionText, generatedIdea: idea }),
      });
      const data = await res.json();
      const detailsData = data.details || {
        solution_overview: "",
        benefits: [],
        steps: [],
        narrative: "",
      };
      setSolution(detailsData);
      setLoading(false);
      localStorage.setItem(
        "generatedIdea",
        JSON.stringify({ ...idea, solution_details: detailsData })
      );
    } catch (err) {
      setError(err.message || "Something went wrong while fetching solution.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-8">
        <Button
          onClick={handleBack}
          className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 flex items-center gap-2 shadow-sm"
        >
          ← Back
        </Button>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-10">
        Solution Details
      </h1>

      {/* Loading / Error */}
      {loading && <p className="text-center text-lg text-gray-600">Loading solution details...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Solution Details */}
      {solution && (
        <div className="w-full max-w-3xl">
          {Object.keys(sectionStyles).map((key) => (
            <DetailsCard
              key={key}
              title={key.replace("_", " ").toUpperCase()}
              sectionKey={key}
              Icon={sectionStyles[key].Icon}
              openSections={openSections}
              toggleSection={toggleSection}
              gradientClass="" // neutral headings
              iconColorClass="text-gray-700"
            >
              {key === "benefits" ? (
                <div className="flex flex-wrap gap-2">
                  {solution.benefits?.map((b, idx) => (
                    <span
                      key={idx}
                      className="bg-green-50 text-green-900 px-3 py-1 rounded-full text-base md:text-lg font-medium shadow-sm"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : key === "steps" ? (
                <div className="flex flex-col gap-2">
                  {solution.steps?.map((s, idx) => (
                    <p
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-900 rounded text-base md:text-lg"
                    >
                      {idx + 1}. {s}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base md:text-lg">{solution[key]}</p>
              )}
            </DetailsCard>
          ))}
        </div>
      )}
    </div>
  );
}
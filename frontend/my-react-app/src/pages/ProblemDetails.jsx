import { AlertCircle, BookOpen, FileText, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DetailsCard from "../components/ui/DetailsCard";
import { Button } from "../components/ui/button";

// Section configuration: plain icons, no gradient
const sectionStyles = {
  background: { Icon: BookOpen },
  pain_points: { Icon: AlertCircle },
  implications: { Icon: Zap },
  narrative: { Icon: FileText },
};

export default function ProblemDetails() {
  const [, setLocation] = useLocation();
  const [problem, setProblem] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState({
    background: true,
    pain_points: true,
    implications: true,
    narrative: true,
  });

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  const handleBack = () => setLocation("/result");

  useEffect(() => {
    const idea = JSON.parse(localStorage.getItem("generatedIdea"));
    if (!idea || !idea.problem) {
      setError("No problem statement found. Go back and generate an idea first.");
      setLoading(false);
      return;
    }

    setProblem(idea.problem);

    if (idea.problem_details) {
      setDetails(idea.problem_details);
      setLoading(false);
    } else {
      fetchProblemDetails(idea.problem, idea);
    }
  }, []);

  const fetchProblemDetails = async (problemStatement, idea) => {
    setLoading(true);
    setError("");
    setDetails(null);
    try {
      const res = await fetch("http://localhost:5000/api/problem-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problemStatement, generatedIdea: idea }),
      });
      const data = await res.json();
      const detailsData = data.details || { background: "", pain_points: [], implications: "", narrative: "" };
      setDetails(detailsData);
      setLoading(false);
      localStorage.setItem(
        "generatedIdea",
        JSON.stringify({ ...idea, problem_details: detailsData })
      );
    } catch (err) {
      setError(err.message || "Something went wrong while fetching details.");
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
        Problem Details
      </h1>

      {/* Loading / Error */}
      {loading && <p className="text-center text-lg text-gray-600">Loading problem details...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Problem Details */}
      {details && (
        <div className="w-full max-w-3xl">
          {Object.keys(sectionStyles).map((key) => (
            <DetailsCard
              key={key}
              title={key.replace("_", " ").toUpperCase()}
              sectionKey={key}
              Icon={sectionStyles[key].Icon}
              openSections={openSections}
              toggleSection={toggleSection}
              // Neutral plain heading
              gradientClass=""
              iconColorClass="text-gray-700"
            >
              {key === "pain_points" ? (
                <div className="flex flex-wrap gap-2">
                  {details.pain_points?.map((p, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-base md:text-lg font-medium shadow-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-base md:text-lg">{details[key]}</p>
              )}
            </DetailsCard>
          ))}
        </div>
      )}
    </div>
  );
}
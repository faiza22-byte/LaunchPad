import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function CompetitorDetails() {
  const [competitor, setCompetitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const firstCompetitor = JSON.parse(localStorage.getItem("competitorsData") || "[]")[0];

  const fetchCompetitorDetails = async () => {
    if (!firstCompetitor) return;

    // Check if data is already in localStorage
    const storedData = JSON.parse(localStorage.getItem("competitorDetails") || "{}");
    if (storedData[firstCompetitor.link]) {
      setCompetitor(storedData[firstCompetitor.link]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/competitor?url=${encodeURIComponent(firstCompetitor.link)}`
      );
      const data = await res.json();

      setCompetitor(data);

      // Save to localStorage to avoid refetching
      localStorage.setItem(
        "competitorDetails",
        JSON.stringify({ ...storedData, [firstCompetitor.link]: data })
      );
    } catch (error) {
      console.error("Error fetching competitor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitorDetails();
  }, []);

  if (!firstCompetitor) {
    return <p className="text-center mt-10 text-red-500">No competitor found in localStorage</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6 relative">
      
      {/* BACK BUTTON */}
      <motion.button
        onClick={() => setLocation("/trends")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg mb-6 hover:bg-white/20 transition"
      >
        <ArrowLeft className="w-4 h-4 text-white" />
        <span className="text-sm font-semibold">Back</span>
      </motion.button>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-sm font-medium">Fetching competitor details...</p>
          </div>
        </div>
      )}

      {competitor && (
        <div className="space-y-8 max-w-5xl mx-auto">
          
          {/* HEADER */}
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-lime-400">
            SEO Ranking & Reviews of Your TOP Competitor
          </h1>

          {/* Website Card */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center border border-white/20 shadow-lg">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm uppercase tracking-wide">Website</p>
              <h2 className="text-lg md:text-xl font-semibold text-white mt-1">
                {competitor.competitor}
              </h2>
            </div>
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 md:mt-0 inline-block px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-full transition-all shadow-md"
            >
              Visit Website
            </a>
          </div>

          {/* SEO Metrics with Progress Bars */}
          {competitor.seoData && (
            <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-green-400">SEO Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Domain Authority", value: competitor.seoData.domainAuthority },
                  { label: "Page Authority", value: competitor.seoData.pageAuthority },
                  { label: "Spam Score", value: competitor.seoData.spamScore },
                  { label: "Backlinks", value: competitor.seoData.backlinksCount },
                  { label: "Moz Rank", value: competitor.seoData.mozRank },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-black/70 p-4 rounded-2xl text-center border border-white/10 shadow-md"
                  >
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <p className="text-lg md:text-xl font-bold text-white mt-1">
                      {metric.value ?? "N/A"}
                    </p>

                    {/* Mini progress bar */}
                    {typeof metric.value === "number" && (
                      <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                        <div
                          className="h-2 bg-green-400 rounded-full transition-all"
                          style={{ width: `${Math.min(metric.value, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {competitor.reviews && competitor.reviews.length > 0 && (
            <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-yellow-400">Top Reviews</h2>
              <ul className="space-y-4">
                {competitor.reviews.map((review, idx) => (
                  <li
                    key={idx}
                    className="bg-black/70 p-4 rounded-2xl border border-white/10 shadow-md"
                  >
                    "{review}"
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
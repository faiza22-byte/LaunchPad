import { Search, Star } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function IdeasSidebar({ ideas }) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Filter ideas based on search
  const filtered = ideas.filter((idea) =>
    idea.startup_name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle favorite status
  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col z-40 shadow-lg">

      <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Your Ideas</h2>

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mb-3">
        <Search size={16} className="text-gray-500 dark:text-gray-400" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Ideas list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No ideas found.
          </p>
        )}

        {filtered.map((idea) => {
          const isFav = favorites.includes(idea.id);

          return (
            <div
              key={idea.id}
              className="p-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group relative transition-all"
            onClick={async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/idea/${idea.id}`);
    const data = await res.json();

    if (data?.idea) {
      // ✅ Store fetched idea in localStorage (structured like Result expects)
      localStorage.setItem("generatedIdea", JSON.stringify(data.idea));
      localStorage.setItem("selectedIdeaId", idea.id);
      console.log(data.idea);
      setLocation("/result");
    } else {
      throw new Error("No idea returned");
    }
  } catch (err) {
    // fallback: still store local idea
    const fallbackIdea = idea;

    localStorage.setItem("generatedIdea", JSON.stringify(fallbackIdea));
    localStorage.setItem("selectedIdeaId", idea.id);
    setLocation("/result");
  }
}}
            >
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{idea.startup_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {idea.snippet}
              </p>

              {/* ⭐ Favorite */}
              <Star
                size={16}
                className={`absolute top-2 right-2 transition-colors ${
                  isFav ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(idea.id);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
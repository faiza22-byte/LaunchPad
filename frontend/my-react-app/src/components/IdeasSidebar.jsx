import { useState } from "react";

export default function IdeasSidebar({ ideas, onSelect }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (idea) => {
    setSelectedId(idea.id);
    onSelect(idea); // send idea to parent
  };

  return (
    <div className="w-64 bg-white/50 p-4 rounded-xl shadow-lg flex-shrink-0">
      <h3 className="text-lg font-bold mb-4">Your Ideas</h3>
      {ideas.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ideas yet</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => handleClick(idea)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedId === idea.id
                  ? "bg-primary/20 border-primary"
                  : "hover:bg-gray-100 border-gray-200"
              }`}
            >
              <p className="font-semibold">{idea.startup_name}</p>
              <p className="text-xs text-muted">{idea.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
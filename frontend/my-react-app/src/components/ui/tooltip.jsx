// src/components/ui/tooltip.jsx
import React, { createContext, useContext, useState } from "react";

const TooltipContext = createContext();

export function TooltipProvider({ children }) {
  const [tooltip, setTooltip] = useState("");

  const showTooltip = (text) => setTooltip(text);
  const hideTooltip = () => setTooltip("");

  return (
    <TooltipContext.Provider value={{ tooltip, showTooltip, hideTooltip }}>
      {children}
      {tooltip && (
        <div className="fixed bg-black text-white p-1 rounded">
          {tooltip}
        </div>
      )}
    </TooltipContext.Provider>
  );
}

// Optional hook for using tooltips
export function useTooltip() {
  return useContext(TooltipContext);
}
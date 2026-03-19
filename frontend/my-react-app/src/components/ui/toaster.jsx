// src/components/ui/toaster.jsx

import React from "react";

export function Toaster({ message }) {
  return (
    <div className="bg-gray-800 text-white p-2 rounded">
      {message}
    </div>
  );
}
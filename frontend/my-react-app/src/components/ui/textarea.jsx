// src/components/ui/textarea.jsx
import React from "react";

export function Textarea({ value, onChange, placeholder, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
    />
  );
}
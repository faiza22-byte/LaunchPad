// src/components/ui/input.jsx

export const Input = ({ type = "text", placeholder = "", value, onChange, className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full 
        border border-gray-300 
        rounded px-4 py-3 
        focus:outline-none 
        focus:ring-2 focus:ring-blue-500 
        transition-all duration-300 ease-in-out
        ${className}
      `}
    />
  );
};
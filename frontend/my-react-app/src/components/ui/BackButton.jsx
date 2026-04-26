// frontend/components/ui/BackButton.jsx
import { ArrowLeft } from "lucide-react";
import { Button } from "./button"; // your existing button component
import { useLocation } from "wouter";

export default function BackButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => setLocation("/result");

  return (
    <div className="absolute top-6 left-6">
      <Button
        onClick={handleClick}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-800 
                   hover:bg-white shadow-lg border border-gray-200 rounded-xl px-4 py-2 
                   transition-all duration-300 ease-in-out"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </Button>
    </div>
  );
}
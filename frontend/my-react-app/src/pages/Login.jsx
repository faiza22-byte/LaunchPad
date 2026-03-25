import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // ✅ FIXED STORAGE
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.user?.id || data.user?._id,
        email: data.user?.email || email,
      })
    );

    localStorage.setItem("token", data.token);

    // Redirect
    setLocation("/");
  } catch (err) {
    console.error("Login error:", err);
    setError("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card with border transition on hover */}
        <div className="relative rounded-3xl p-8 shadow-2xl space-y-6 border-2 border-transparent hover:border-gradient-to-r from-primary to-purple-500 transition-all duration-500">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </h2>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:border-gradient-to-r focus:from-primary focus:to-purple-500 transition-all duration-500"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:border-gradient-to-r focus:from-primary focus:to-purple-500 transition-all duration-500"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setLocation("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
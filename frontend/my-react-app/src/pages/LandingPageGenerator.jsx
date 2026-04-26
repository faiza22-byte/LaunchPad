import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPageGenerator() {
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    const loadLandingPage = async () => {
      try {
        setError("");

        // ✅ 1. Check cache first
        const cachedHTML = localStorage.getItem("landingPageHTML");

        if (cachedHTML) {
          const blob = new Blob([cachedHTML], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          return;
        }

        // ✅ 2. If not cached → call API
        const storedIdea = localStorage.getItem("generatedIdea");

        if (!storedIdea) {
          throw new Error("No generatedIdea found in localStorage");
        }

        const res = await fetch("http://localhost:5000/api/landing-page/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            generatedIdea: storedIdea,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate page");
        }

        let htmlCode = data.html;

        // clean markdown
        htmlCode = htmlCode
          .replace(/```html/g, "")
          .replace(/```/g, "")
          .trim();

        // ✅ Save in cache
        localStorage.setItem("landingPageHTML", htmlCode);

        const blob = new Blob([htmlCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        setPreviewUrl(url);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadLandingPage();
  }, []);

  // 🚀 DEPLOY FUNCTION
  const handleDeploy = async () => {
    try {
      setDeploying(true);

      const html = localStorage.getItem("landingPageHTML");

      const res = await fetch("http://localhost:5000/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // open deployed site
      window.open(data.url, "_blank");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="h-screen w-full relative">

      {/* 🔥 LIVE PREVIEW BUTTON */}
      {previewUrl && (
        <button
          onClick={() => window.open(previewUrl, "_blank")}
          className="fixed top-5 right-5 z-50 p-3 rounded-full 
                     bg-black text-white shadow-lg hover:scale-110 
                     transition-all duration-300"
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      )}


      {/* IFRAME */}
      {previewUrl && (
        <iframe
          title="Landing Page"
          src={previewUrl}
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
        />
      )}

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-white/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4 bg-white/70 backdrop-blur-2xl px-10 py-8 rounded-2xl shadow-2xl border border-white/30"
          >
            <div className="w-12 h-12 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin" />

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg font-semibold text-gray-700 text-center"
            >
              Your homepage is getting ready...
            </motion.p>

            <p className="text-sm text-gray-500 text-center">
              Crafting a modern AI-powered landing page
            </p>
          </motion.div>
        </div>
      )}

      {/* 📞 SMALL BLACK CIRCULAR CONTACT WIDGET */}
{previewUrl && !loading && (
  <div className="absolute bottom-6 right-6 z-50">

    <div className="w-80 h-80 bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full p-8 text-white flex flex-col justify-center">

      {/* Heading */}
      <h2 className="text-base font-semibold text-center">
        Startup Contact
      </h2>

      <p className="text-[11px] text-gray-400 mt-1 mb-4 text-center">
        Get your full application built 
      </p>

      {/* CONTACT ITEMS */}
      <div className="flex flex-col gap-3">

        {/* EMAIL */}
        <a
          href="mailto:gull.faiza22@gmail.com"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Mail className="w-5 h-5 text-red-400" />
          <div className="text-left">
            <p className="text-sm font-medium">Email</p>
            <p className="text-[11px] text-gray-400 truncate">
              gull.faiza22@gmail.com
            </p>
          </div>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/923091068200"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Phone className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <p className="text-sm font-medium">WhatsApp</p>
            <p className="text-[11px] text-gray-400">
              0309 1068200
            </p>
          </div>
        </a>

        {/* LINKEDIN */}
        <a
          href="https://www.linkedin.com/in/faiza-gull-9b1016275/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Linkedin className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <p className="text-sm font-medium">LinkedIn</p>
            <p className="text-[11px] text-gray-400">
              View Profile
            </p>
          </div>
        </a>

      </div>

      {/* Footer */}
      <p className="text-[10px] text-gray-500 mt-4 text-center">
        Build your idea into reality 
      </p>

    </div>
  </div>
)}

      {/* ERROR */}
      {error && (
        <div className="fixed bottom-5 left-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children, user }) {
  const [ideasData, setIdeasData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIdeas = (userId) => {
    if (!userId) {
      setIdeasData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/api/ideas/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setIdeasData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ideas:", err);
        setLoading(false);
      });
  };

  // Initial + user change fetch
  useEffect(() => {
    fetchIdeas(user?.id);
  }, [user]);

  // 🔴 Listen for login event (localStorage update)
  useEffect(() => {
    const handleUserChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      fetchIdeas(updatedUser?.id);
    };

    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const sidebarWidth = 288;

  return (
    <SidebarProvider>
      <div>
        {/* Sidebar fixed */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: sidebarWidth,
            zIndex: 50,
          }}
        >
          <AppSidebar ideas={ideasData} />
        </div>

        {/* Main content */}
        <main
          style={{
            marginLeft: sidebarWidth,
            minHeight: "100vh",
            padding: "1rem",
          }}
        >
          <>
  {children}

  {loading && user?.id && (
    <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-md bg-black/20">
      
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-white font-semibold text-lg tracking-wide">
          Loading your ideas...
        </p>
      </div>
      
    </div>
  )}
</>
        </main>
      </div>
    </SidebarProvider>
  );
}
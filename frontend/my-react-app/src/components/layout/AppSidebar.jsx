import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AppSidebar({ ideas, onIdeaClick }) {
  const [collapsed, setCollapsed] = useState(false);
  const [, setLocation] = useLocation();
  const sidebarItems = ideas?.ideas || [];

  return (
    <Sidebar
      className={`flex flex-col h-screen shadow-xl border-r border-gray-200 transition-all ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Header */}
      <SidebarHeader className="px-4 py-4 font-bold text-lg bg-white/80 backdrop-blur-md rounded-b-2xl flex justify-between items-center">
        {!collapsed && (
          <div className="inline-flex items-center gap-2  text-lg text-green-700 font-bold">
            <Sparkles className="w-5 h-5" />
            Launchpad
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Actions */}
        <SidebarGroup>
    
          <SidebarMenu>
            <SidebarMenuItem>
              <button
                className={`w-full text-left px-3 py-2 rounded-2xl ${
                  collapsed ? "text-center" : "bg-lime-600 hover:bg-lime-700"
                } text-white font-semibold shadow-sm transition-colors`}
                onClick={() => setLocation("/")}
              >
                {collapsed ? "+" : "+ New Startup Chat"}
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Your Ideas */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-green-700 font-medium">
              Your Ideas
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="space-y-2">
            {sidebarItems.length > 0 ? (
              sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-2xl shadow-sm transition-colors ${
                      collapsed
                        ? "text-center bg-transparent"
                        : "bg-gradient-to-r from-lime-100 to-purple-200 hover:from-lime-200 hover:to-purple-300"
                    }`}
                  onClick={() => {
  // ✅ Save selected idea
  localStorage.setItem("generatedIdea", JSON.stringify(item));

  // ✅ Notify app about change
  window.dispatchEvent(new Event("ideaChanged"));

  // ✅ Navigate
  setLocation(`/ideas/${item.id}`);
}}
                  >
                    {!collapsed ? (
                      <>
                        <div className="font-semibold text-gray-800">{item.startup_name}</div>
                        {item.snippet && (
                          <div className="text-sm text-gray-700">{item.snippet}</div>
                        )}
                      </>
                    ) : (
                      <div className="font-semibold text-gray-800">{item.startup_name[0]}</div>
                    )}
                  </button>
                </SidebarMenuItem>
              ))
            ) : (
              !collapsed && <p className="p-4 text-gray-400">No startups available</p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-gray-200 p-3 text-xs text-gray-500 text-center bg-white/50 backdrop-blur-md rounded-t-2xl">
          Powered by AI
        </div>
      )}
    </Sidebar>
  );
}
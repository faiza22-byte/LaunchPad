import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";

export function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-full min-w-0">
          <header className="md:hidden flex items-center p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <SidebarTrigger>
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <span className="ml-4 font-display font-bold text-lg">Launchpad</span>
          </header>
          <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-background to-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
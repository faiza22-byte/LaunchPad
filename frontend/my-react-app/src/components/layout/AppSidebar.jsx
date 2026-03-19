import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { useIdeas } from "@/hooks/use-ideas";
import { Clock, Lightbulb, Loader2, PlusCircle, Zap } from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();
  const { data: ideas, isLoading } = useIdeas();

  return (
    <Sidebar className="border-r bg-slate-50">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-2 px-2 pb-4">
          <div className="bg-green-100 p-2 rounded-xl text-green-600">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Launchpad</h2>
        </div>

        <Link href="/">
                <Button className="w-full flex gap-2 bg-olive hover:bg-olive/90 text-white">
        <PlusCircle className="h-4 w-4" />
        New Startup Idea
      </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Your Ideas</SidebarGroupLabel>

          <SidebarMenu>
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : ideas?.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-20" />
                No ideas yet. Create your first one!
              </div>
            ) : (
              ideas?.map((idea) => {
                const isActive = location === `/idea/${idea.id}`;

                return (
                  <SidebarMenuItem key={idea.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={`/idea/${idea.id}`}>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {idea.title ||
                              idea.prompt.substring(0, 30) + "..."}
                          </span>

                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {idea.createdAt &&
                              new Date(
                                idea.createdAt
                              ).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 text-xs text-center text-gray-500">
        Powered by AI Models
      </SidebarFooter>
    </Sidebar>
  );
}
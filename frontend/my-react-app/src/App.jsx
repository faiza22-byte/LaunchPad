import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import AppLayout from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import CostStructureSlides from "./pages/CostStructureSlides";
import IdeaDashboard from "./pages/DashboardIdeas";
import DetailsStep1 from "./pages/DetailsStep1";
import DetailsStep2 from "./pages/DetailsStep2";
import CompetitorDetails from "./pages/ExtractFeatures";
import Home from "./pages/Home";
import IdeaDetails from "./pages/IdeaDetails";
import KeyMetricsSlides from "./pages/KeyMetricsSlides";
import LandingPage from "./pages/LandingPageGenerator";
import Login from "./pages/Login";
import MarketingSlides from "./pages/MarketingSlides";
import NotFound from "./pages/not-found";
import ProblemDetails from "./pages/ProblemDetails";
import MarketAnalysisSlides from "./pages/redditDetails";
import Result from "./pages/Result";
import RevenueStreamsDetails from "./pages/RevenueStreamsDetails";
import Signup from "./pages/Signup";
import SolutionDetails from "./pages/SolutionDetails";
import TargetMarketDetails from "./pages/TargetMarketDetails";
import TechStacks from "./pages/TechStacks";
import TrendDashboard from "./pages/TrendDashboard";
import UniqueValueDetails from "./pages/UniqueValueDetails";
import FeaturesExtracted from "./pages/ExtractFeatures";
import CompetitorSeo from "./pages/CompetitorDetails";
import pitch from "./pages/PitchDeck";
function Router() {
  // read user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AppLayout user={user} className="flex h-screen overflow-hidden">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/idea/:id" component={IdeaDashboard} />
        <Route path="/details-1" component={DetailsStep1} />
        <Route path="/details-2" component={DetailsStep2} />
        <Route path="/result" component={Result} />
        <Route path="details/Problem" component={ProblemDetails} />
        <Route path="details/Solution" component={SolutionDetails} />
        <Route path="details/target_market" component={TargetMarketDetails} />
        <Route path="details/unique_value_proposition" component={UniqueValueDetails} />
        <Route path="details/revenue_streams" component={RevenueStreamsDetails} />
        <Route path="/ideas/:id" component={IdeaDetails} />
        <Route path="details/key_metrics" component={KeyMetricsSlides} />
        <Route path="details/cost_structure" component={CostStructureSlides} />
        <Route path="details/marketing_strategy" component={MarketingSlides} />
        <Route path="details/technology_stack" component={TechStacks} />
        <Route path="/trends" component={TrendDashboard} />
        <Route path="/reddit" component={MarketAnalysisSlides} />
        <Route path="/page" component={LandingPage} />
        <Route path="/competitors" component={CompetitorAnalysis} />
        <Route path="/features" component={FeaturesExtracted} />
        <Route path="/competitor-details" component={CompetitorSeo} />
        <Route path="/pitch-deck" component={pitch} />

        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Router />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

import { AppLayout } from "./components/layout/AppLayout";
import DetailsStep1 from "./pages/DetailsStep1";
import DetailsStep2 from "./pages/DetailsStep2";
import Home from "./pages/Home";
import IdeaDashboard from "./pages/IdeaDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";
import ProblemDetails from "./pages/ProblemDetails";
import Result from "./pages/Result";
import Signup from "./pages/Signup";
import SolutionDetails from "./pages/SolutionDetails";

function Router() {
  return (
    <AppLayout>
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
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
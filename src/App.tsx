
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Workflows from "./pages/Workflows";
import Exceptions from "./pages/Exceptions";
import Billing from "./pages/Billing";
import Auth from "./pages/Auth";
import Subscriptions from "./pages/Subscriptions";
import Reporting from "./pages/Reporting";
import Users from "./pages/Users";
import Messaging from "./pages/Messaging";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="min-h-screen bg-white">
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/users" element={<Users />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/exceptions" element={<Exceptions />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/messaging" element={<Messaging />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

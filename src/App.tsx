
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientCredentials from "./pages/ClientCredentials";
import Workflows from "./pages/Workflows";
import Exceptions from "./pages/Exceptions";
import Billing from "./pages/Billing";
import Auth from "./pages/Auth";
import Subscriptions from "./pages/Subscriptions";
import Reporting from "./pages/Reporting";
import Users from "./pages/Users";
import Messaging from "./pages/Messaging";
import ClientDashboard from "./pages/client/ClientDashboard";

// Route protection component for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user && userRole === 'admin') {
    return <>{children}</>;
  }
  
  return <Navigate to="/client/dashboard" replace />;
};

// Route protection component for client-only routes
const ClientRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user && userRole === 'client') {
    return <>{children}</>;
  }
  
  return <Navigate to="/" replace />;
};

// Route protection component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  // Directly show the admin dashboard for root path
  const handleRootRedirect = () => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (userRole === 'admin') {
      // Show admin dashboard
      return <Index />;
    } else {
      // Redirect to client dashboard
      return <Navigate to="/client/dashboard" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute>{handleRootRedirect()}</ProtectedRoute>} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Admin routes */}
      <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/clients" element={<AdminRoute><Clients /></AdminRoute>} />
      <Route path="/clients/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />
      <Route path="/workflows" element={<AdminRoute><Workflows /></AdminRoute>} />
      <Route path="/exceptions" element={<AdminRoute><Exceptions /></AdminRoute>} />
      <Route path="/billing" element={<AdminRoute><Billing /></AdminRoute>} />
      <Route path="/subscriptions" element={<AdminRoute><Subscriptions /></AdminRoute>} />
      <Route path="/reporting" element={<AdminRoute><Reporting /></AdminRoute>} />
      <Route path="/messaging" element={<AdminRoute><Messaging /></AdminRoute>} />
      <Route path="/client/credentials" element={<AdminRoute><ClientCredentials /></AdminRoute>} />
      
      {/* Client routes */}
      <Route path="/client/dashboard" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  // Create a client inside the component function with explicit React useState
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-[#f5f5f7]">
              <Toaster />
              <Sonner />
              <AppRoutes />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

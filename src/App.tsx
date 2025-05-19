import React from "react";
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
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ClientROI from "./pages/client/ClientROI";
import ClientReporting from "./pages/client/ClientReporting";
import ClientSupport from "./pages/client/ClientSupport";
import ClientBilling from "./pages/client/ClientBilling";
import ClientExceptions from "./pages/client/ClientExceptions";
import ClientMessaging from "./pages/client/ClientMessaging";
import ClientUsers from "./pages/client/ClientUsers";

// Create the queryClient outside of the component
const queryClient = new QueryClient();

// Route protection component for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  console.log("AdminRoute check - Current user role:", userRole, "for path:", location.pathname);
  
  if (user && userRole === 'admin') {
    console.log("✅ Admin access granted to:", location.pathname);
    return <>{children}</>;
  }
  
  console.log("❌ Access denied to admin route: User role is", userRole);
  return <Navigate to="/client/dashboard" replace />;
};

// Route protection component for client-only routes
const ClientRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  console.log("ClientRoute check - Current user role:", userRole, "for path:", location.pathname);
  
  if (user && userRole === 'client') {
    console.log("✅ Client access granted to:", location.pathname);
    return <>{children}</>;
  }
  
  console.log("❌ Access denied to client route: User role is", userRole);
  return <Navigate to="/" replace />;
};

// Route protection component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  console.log("ProtectedRoute check - User authenticated:", !!user, "for path:", location.pathname);
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  
  // Redirect the root path based on user role
  const handleRootRedirect = () => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    console.log("Root path redirect - Current user role:", userRole, "Current path:", location.pathname);
    
    if (userRole === 'admin') {
      console.log("✅ Admin detected at root path, showing admin dashboard");
      return <Index />;
    } else {
      console.log("✅ Client detected, redirecting to /client/dashboard");
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
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Client routes */}
      <Route path="/client/dashboard" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
      <Route path="/client/roi" element={<ClientRoute><ClientROI /></ClientRoute>} />
      <Route path="/client/reporting" element={<ClientRoute><ClientReporting /></ClientRoute>} />
      <Route path="/client/credentials" element={<ClientRoute><ClientCredentials /></ClientRoute>} />
      <Route path="/client/exceptions" element={<ClientRoute><ClientExceptions /></ClientRoute>} />
      <Route path="/client/users" element={<ClientRoute><ClientUsers /></ClientRoute>} />
      <Route path="/client/billing" element={<ClientRoute><ClientBilling /></ClientRoute>} />
      <Route path="/client/messaging" element={<ClientRoute><ClientSupport /></ClientRoute>} />
      <Route path="/client/support" element={<ClientRoute><ClientSupport /></ClientRoute>} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
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

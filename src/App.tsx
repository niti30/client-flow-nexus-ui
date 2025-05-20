
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";

// Pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import ClientDetail from './pages/ClientDetail';
import Clients from './pages/Clients';
import Exceptions from './pages/Exceptions';
import Messaging from './pages/Messaging';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Reporting from './pages/Reporting';
import Settings from './pages/Settings';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';
import Workflows from './pages/Workflows';

// Client Pages
import ClientBilling from './pages/client/ClientBilling';
import ClientCredentials from './pages/client/ClientCredentials';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientExceptions from './pages/client/ClientExceptions';
import ClientMessaging from './pages/client/ClientMessaging';
import ClientROI from './pages/client/ClientROI';
import ClientReporting from './pages/client/ClientReporting';
import ClientSupport from './pages/client/ClientSupport';
import ClientUsers from './pages/client/ClientUsers';

// Auth Context Provider
import { AuthProvider } from './contexts/AuthContext';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Admin routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/client-detail/:id" element={<ClientDetail />} />
          <Route path="/exceptions" element={<Exceptions />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workflows" element={<Workflows />} />

          {/* Client routes */}
          <Route path="/client/billing" element={<ClientBilling />} />
          <Route path="/client/credentials" element={<ClientCredentials />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/exceptions" element={<ClientExceptions />} />
          <Route path="/client/messaging" element={<ClientMessaging />} />
          <Route path="/client/roi" element={<ClientROI />} />
          <Route path="/client/reporting" element={<ClientReporting />} />
          <Route path="/client/support" element={<ClientSupport />} />
          <Route path="/client/users" element={<ClientUsers />} />

          {/* Redirect to Dashboard for the admin path */}
          <Route path="/admin" element={<Navigate to="/dashboard" />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

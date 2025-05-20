
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
import { ThemeProvider } from './contexts/ThemeContext';
import AuthRoute from './components/auth/AuthRoute';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected admin routes */}
            <Route path="/dashboard" element={<AuthRoute allowedRoles={['admin', 'se']}><Dashboard /></AuthRoute>} />
            <Route path="/billing" element={<AuthRoute allowedRoles={['admin', 'se']}><Billing /></AuthRoute>} />
            <Route path="/clients" element={<AuthRoute allowedRoles={['admin', 'se']}><Clients /></AuthRoute>} />
            <Route path="/client-detail/:id" element={<AuthRoute allowedRoles={['admin', 'se']}><ClientDetail /></AuthRoute>} />
            <Route path="/exceptions" element={<AuthRoute allowedRoles={['admin', 'se']}><Exceptions /></AuthRoute>} />
            <Route path="/messaging" element={<AuthRoute allowedRoles={['admin', 'se']}><Messaging /></AuthRoute>} />
            <Route path="/profile" element={<AuthRoute allowedRoles={['admin', 'se', 'client']}><Profile /></AuthRoute>} />
            <Route path="/reporting" element={<AuthRoute allowedRoles={['admin', 'se']}><Reporting /></AuthRoute>} />
            <Route path="/settings" element={<AuthRoute allowedRoles={['admin', 'se', 'client']}><Settings /></AuthRoute>} />
            <Route path="/subscriptions" element={<AuthRoute allowedRoles={['admin', 'se']}><Subscriptions /></AuthRoute>} />
            <Route path="/users" element={<AuthRoute allowedRoles={['admin', 'se']}><Users /></AuthRoute>} />
            <Route path="/workflows" element={<AuthRoute allowedRoles={['admin', 'se']}><Workflows /></AuthRoute>} />

            {/* Protected client routes */}
            <Route path="/client/billing" element={<AuthRoute allowedRoles={['client']}><ClientBilling /></AuthRoute>} />
            <Route path="/client/credentials" element={<AuthRoute allowedRoles={['client']}><ClientCredentials /></AuthRoute>} />
            <Route path="/client/dashboard" element={<AuthRoute allowedRoles={['client']}><ClientDashboard /></AuthRoute>} />
            <Route path="/client/exceptions" element={<AuthRoute allowedRoles={['client']}><ClientExceptions /></AuthRoute>} />
            <Route path="/client/messaging" element={<AuthRoute allowedRoles={['client']}><ClientMessaging /></AuthRoute>} />
            <Route path="/client/roi" element={<AuthRoute allowedRoles={['client']}><ClientROI /></AuthRoute>} />
            <Route path="/client/reporting" element={<AuthRoute allowedRoles={['client']}><ClientReporting /></AuthRoute>} />
            <Route path="/client/support" element={<AuthRoute allowedRoles={['client']}><ClientSupport /></AuthRoute>} />
            <Route path="/client/users" element={<AuthRoute allowedRoles={['client']}><ClientUsers /></AuthRoute>} />

            {/* Redirect to Dashboard for the admin path */}
            <Route path="/admin" element={<Navigate to="/dashboard" />} />
            <Route path="/admin/dashboard" element={<Navigate to="/dashboard" />} />

            {/* For backward compatibility, redirect /client/messaging to /client/support */}
            <Route path="/client/messaging" element={<Navigate to="/client/support" />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

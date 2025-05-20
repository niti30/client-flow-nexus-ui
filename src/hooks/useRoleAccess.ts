
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Define allowed paths for each role
const ADMIN_PATHS = [
  '/dashboard',
  '/billing',
  '/clients',
  '/exceptions',
  '/messaging',
  '/reporting',
  '/settings',
  '/subscriptions',
  '/users',
  '/workflows',
];

const SE_PATHS = [
  ...ADMIN_PATHS,
];

const CLIENT_PATHS = [
  '/client/dashboard',
  '/client/billing',
  '/client/credentials',
  '/client/exceptions',
  '/client/messaging',
  '/client/roi',
  '/client/reporting',
  '/client/support',
  '/client/users',
];

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/auth',
];

export function useRoleAccess() {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current path is allowed for the user's role
  const isPathAllowed = (path: string, role: string): boolean => {
    // Public paths are always allowed
    if (PUBLIC_PATHS.some(publicPath => path === publicPath)) {
      return true;
    }
    
    // Profile page is allowed for all authenticated users
    if (path === '/profile') {
      return !!user;
    }
    
    // Check client detail pages which follow a pattern
    if (path.startsWith('/client-detail/') && (role === 'admin' || role === 'se')) {
      return true;
    }
    
    // Role-specific path checks
    if (role === 'admin') {
      return ADMIN_PATHS.some(adminPath => path.startsWith(adminPath));
    } else if (role === 'se') {
      // SE may have additional restrictions based on assigned clients
      return SE_PATHS.some(sePath => path.startsWith(sePath));
    } else if (role === 'client') {
      return CLIENT_PATHS.some(clientPath => path.startsWith(clientPath));
    }
    
    return false;
  };

  // Effect to redirect users if they try to access unauthorized paths
  useEffect(() => {
    if (loading) return;

    // User is not authenticated and tries to access protected route
    if (!user && !PUBLIC_PATHS.some(path => location.pathname === path)) {
      navigate('/auth');
      return;
    }

    // User is authenticated but tries to access unauthorized route
    if (user && !isPathAllowed(location.pathname, userRole)) {
      console.log(`Access denied to ${location.pathname} for role ${userRole}`);
      
      // Redirect based on role
      if (userRole === 'admin' || userRole === 'se') {
        navigate('/dashboard');
      } else if (userRole === 'client') {
        navigate('/client/dashboard');
      } else {
        // Default fallback
        navigate('/auth');
      }
    }
  }, [user, userRole, location.pathname, loading, navigate]);

  return {
    isPathAllowed,
    userRole,
    isAdmin: userRole === 'admin',
    isSE: userRole === 'se',
    isClient: userRole === 'client',
  };
}

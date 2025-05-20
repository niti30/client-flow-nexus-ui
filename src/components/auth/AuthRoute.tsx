
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface AuthRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const AuthRoute = ({ children, allowedRoles }: AuthRouteProps) => {
  const { user, userRole, loading } = useAuth();
  
  // If still loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If no user or not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user has the required role
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on user role
    if (userRole === 'client') {
      return <Navigate to="/client/dashboard" replace />;
    } else if (userRole === 'admin' || userRole === 'se') {
      return <Navigate to="/dashboard" replace />;
    } else {
      // Default fallback
      return <Navigate to="/auth" replace />;
    }
  }
  
  // If role is allowed, render the children
  return <>{children}</>;
};

export default AuthRoute;

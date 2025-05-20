
import { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useClientAccess } from "@/hooks/useClientAccess";
import { useAuth } from "@/contexts/AuthContext";

interface ClientAccessGuardProps {
  children: ReactNode;
}

const ClientAccessGuard = ({ children }: ClientAccessGuardProps) => {
  const { id } = useParams<{ id: string }>();
  const { hasAccess, loading } = useClientAccess(id);
  const { userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    // Redirect based on role
    if (userRole === 'admin' || userRole === 'se') {
      return <Navigate to="/clients" replace />;
    } else {
      return <Navigate to="/client/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ClientAccessGuard;

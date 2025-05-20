
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useClientAccess(clientId?: string) {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !clientId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Admin always has access to all clients
        if (userRole === 'admin') {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // For SE, check if they are assigned to this client
        if (userRole === 'se') {
          const { data, error } = await supabase
            .from('user_client_assignments')
            .select()
            .eq('user_id', user.id)
            .eq('client_id', clientId)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
            console.error("Error checking client access:", error);
            toast({
              title: "Error",
              description: "Failed to verify access to this client.",
              variant: "destructive",
            });
          }

          setHasAccess(!!data);
        }

        // For client users, check if this is their client
        if (userRole === 'client') {
          // This would require a way to map client users to client records
          // Simplified implementation:
          const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', user.id)
            .eq('client_id', clientId)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error("Error checking client access:", error);
          }

          setHasAccess(!!data);
        }
      } catch (error) {
        console.error("Unexpected error checking client access:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, userRole, clientId, toast]);

  return { hasAccess, loading };
}

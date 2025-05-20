
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  role: "admin" | "se";
  cost_rate: number | null;
  bill_rate: number | null;
  avatar_url: string | null;
  created_at: string | null;
  assigned_clients?: { client_id: string; name: string }[];
}

export function useUsers(role: "admin" | "se" | null = null) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  const refreshUsers = () => {
    console.log("Refreshing users with role:", role);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching users with role filter:", role);
        
        // Basic query for users with optional role filter
        let query = supabase
          .from("users")
          .select(`
            *,
            user_client_assignments!user_client_assignments_user_id_fkey (
              client_id,
              clients!user_client_assignments_client_id_fkey (
                name
              )
            )
          `)
          .order("created_at", { ascending: false });

        // Apply role filter if specified
        if (role) {
          query = query.eq("role", role);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (!data) {
          setUsers([]);
          return;
        }

        console.log("Fetched users data:", data);

        // Transform data into expected format
        const formattedUsers = data.map((user): User => {
          // Extract assigned clients into a simpler format
          const assignedClients = user.user_client_assignments
            ? user.user_client_assignments.map((assignment: any) => ({
                client_id: assignment.client_id,
                name: assignment.clients?.name || "Unknown Client",
              }))
            : [];

          return {
            ...user,
            // Ensure role is explicitly cast as "admin" | "se"
            role: user.role as "admin" | "se",
            assigned_clients: assignedClients,
          };
        });

        setUsers(formattedUsers);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role, refreshTrigger, toast]);

  return { users, loading, error, refreshUsers };
}

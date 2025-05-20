
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  id: string;
  name: string;
  status: string;
  industry: string | null;
  created_at: string;
  contract_start: string;
  workflows_count: number;
  time_saved: number;
  money_saved: number;
}

export function useClientData() {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      if (!user) {
        setClientData(null);
        setLoading(false);
        return;
      }

      try {
        if (userRole === 'client') {
          // For client users, fetch their associated client
          // This is a simplified implementation assuming client users have client_id in their user record
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('client_id')
            .eq('id', user.id)
            .single();

          if (userError) {
            throw userError;
          }

          if (!userData?.client_id) {
            // No client assigned to this user
            setClientData(null);
            setLoading(false);
            return;
          }

          // Fetch client data
          const { data, error } = await supabase
            .from('clients')
            .select(`
              *,
              workflows:workflows(count)
            `)
            .eq('id', userData.client_id)
            .single();

          if (error) {
            throw error;
          }

          // Calculate metrics based on workflows
          // This would typically come from more detailed queries
          const { data: workflowsData, error: workflowsError } = await supabase
            .from('workflows')
            .select('time_saved, cost_saved')
            .eq('client_id', userData.client_id);

          if (workflowsError) {
            throw workflowsError;
          }

          // Sum up time saved and money saved
          const timeSaved = workflowsData?.reduce((sum, wf) => sum + (wf.time_saved || 0), 0) || 0;
          const moneySaved = workflowsData?.reduce((sum, wf) => sum + (wf.cost_saved || 0), 0) || 0;

          setClientData({
            ...data,
            contract_start: data.created_at,
            workflows_count: workflowsData?.length || 0,
            time_saved: timeSaved,
            money_saved: moneySaved
          });
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Error",
          description: "Failed to load client data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [user, userRole, toast]);

  return { clientData, loading };
}

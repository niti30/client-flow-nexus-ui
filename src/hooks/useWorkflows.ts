
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Workflow {
  id: string;
  name: string;
  status: string;
  progress: number;
  created_at: string;
  completed_at: string | null;
  clients?: {
    name: string;
  };
}

interface ClientWorkflowStats {
  clientId: string;
  totalWorkflows: number;
  exceptions: number;
  timeSaved: string;
  revenue: string;
  moneySaved: string;
}

interface UseWorkflowsOptions {
  pageSize?: number;
  clientId?: string;
}

export const useWorkflows = (options?: UseWorkflowsOptions) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  
  const pageSize = options?.pageSize || 50; // Default to 50 if not specified
  const clientId = options?.clientId;

  const fetchWorkflows = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build the query
      let query = supabase
        .from('workflows')
        .select(`
          *,
          clients(name)
        `, { count: 'exact' });
      
      // Add client filter if provided
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      // Add pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching workflows:', error);
        setError(error);
        toast({
          title: "Error fetching workflows",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setWorkflows(data || []);
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      toast({
        title: "Unexpected error",
        description: "Failed to fetch workflows. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, pageSize, toast]);

  // New function to fetch workflow stats by client
  const fetchClientWorkflowStats = async (): Promise<ClientWorkflowStats[]> => {
    try {
      setLoading(true);
      
      // Step 1: Get all clients
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id, name');
        
      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        toast({
          title: "Error fetching client stats",
          description: clientsError.message,
          variant: "destructive"
        });
        return [];
      }
      
      // Step 2: For each client, get workflow count and other metrics
      const clientStats = await Promise.all(clients.map(async (client) => {
        // Get workflow count
        const { count: workflowCount, error: workflowError } = await supabase
          .from('workflows')
          .select('*', { count: 'exact' })
          .eq('client_id', client.id);
          
        if (workflowError) {
          console.error(`Error fetching workflows for client ${client.id}:`, workflowError);
        }
        
        // Get exception count
        const { count: exceptionCount, error: exceptionError } = await supabase
          .from('exceptions')
          .select('*', { count: 'exact' })
          .eq('client_id', client.id);
          
        if (exceptionError) {
          console.error(`Error fetching exceptions for client ${client.id}:`, exceptionError);
        }
        
        // Return client stats
        return {
          clientId: client.id,
          totalWorkflows: workflowCount || 0,
          exceptions: exceptionCount || 0,
          // Calculate these values based on workflow count/exceptions for now
          timeSaved: `${Math.round((workflowCount || 0) * 0.45)}h`,
          revenue: `$${Math.round((workflowCount || 0) * 297)}`,
          moneySaved: `$${Math.round((workflowCount || 0) * 142)}`
        };
      }));
      
      return clientStats;
    } catch (error) {
      console.error('Error in fetchClientWorkflowStats:', error);
      toast({
        title: "Error fetching client statistics",
        description: "Failed to fetch client workflow statistics",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { 
    workflows, 
    loading, 
    error, 
    totalCount,
    fetchWorkflows,
    fetchClientWorkflowStats,
    pageSize
  };
};

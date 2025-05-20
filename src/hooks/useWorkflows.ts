
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

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { 
    workflows, 
    loading, 
    error, 
    totalCount,
    fetchWorkflows,
    pageSize
  };
};

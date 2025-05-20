
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          *,
          clients(name)
        `);
      
      if (error) {
        console.error('Error fetching workflows:', error);
      } else {
        setWorkflows(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return { workflows, loading, fetchWorkflows };
};

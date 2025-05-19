
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface Exception {
  id: string;
  description: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  clients?: {
    name: string;
  };
  workflows?: {
    name: string;
  };
}

export const useExceptions = () => {
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExceptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exceptions')
        .select(`
          *,
          clients(name),
          workflows(name)
        `);
      
      if (error) {
        console.error('Error fetching exceptions:', error);
      } else {
        setExceptions(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExceptions();
  }, []);

  return { exceptions, loading, fetchExceptions };
};

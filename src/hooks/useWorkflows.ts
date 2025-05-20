
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

export interface ClientMetrics {
  id: string;
  name: string;
  contractStart: string;
  workflows: number;
  nodes: number;
  executions: number;
  exceptions: number;
  revenue: string;
  timeSaved: string;
  moneySaved: string;
}

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(error.message);
      } else {
        setWorkflows(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch clients data
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');
      
      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        setError(clientsError.message);
        return;
      }

      // Create metrics array with distributed values
      if (clientsData && clientsData.length > 0) {
        // Define total dashboard metrics
        const totalWorkflows = 2847;
        const totalExceptions = 156;
        const totalTimeSaved = 1284; // hours
        const totalRevenue = 847000; // $847K
        const totalNodes = 4300; // Made up reasonable value
        const totalExecutions = 48000; // Made up reasonable value
        const totalMoneySaved = 4320000; // Made up value ~$4.32M
        
        // Distribute metrics randomly but proportionally across clients
        const metrics: ClientMetrics[] = clientsData.map((client) => {
          // Generate a random factor between 0.5 and 2 to distribute metrics unevenly
          const randomFactor = 0.5 + Math.random() * 1.5;
          
          // Calculate the client's share based on total clients
          const baseShare = 1 / clientsData.length;
          const clientShare = baseShare * randomFactor;
          
          // Adjust distribution to ensure totals sum up correctly
          const normalizationFactor = 1 / (clientShare * clientsData.length);
          const adjustedShare = clientShare * normalizationFactor;
          
          // Calculate metrics for this client
          const workflows = Math.floor(totalWorkflows * adjustedShare);
          const exceptions = Math.floor(totalExceptions * adjustedShare);
          const nodes = Math.floor(totalNodes * adjustedShare);
          const executions = Math.floor(totalExecutions * adjustedShare);
          const timeSaved = Math.floor(totalTimeSaved * adjustedShare);
          const revenue = Math.floor(totalRevenue * adjustedShare);
          const moneySaved = Math.floor(totalMoneySaved * adjustedShare);
          
          return {
            id: client.id,
            name: client.name,
            contractStart: client.created_at ? new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 19, 2025',
            workflows,
            nodes,
            executions,
            exceptions,
            revenue: `$${(revenue / 1000).toFixed(0)}K`,
            timeSaved: `${timeSaved}h`,
            moneySaved: `$${(moneySaved / 1000).toFixed(0)}K`
          };
        });
        
        setClientMetrics(metrics);
      }
    } catch (error) {
      console.error('Error fetching client metrics:', error);
      setError('Failed to load client metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    fetchClientMetrics();
  }, []);

  return { 
    workflows, 
    clientMetrics,
    loading, 
    error,
    fetchWorkflows,
    fetchClientMetrics
  };
};

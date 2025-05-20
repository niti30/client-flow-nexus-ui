
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

export const useWorkflows = (timeframe: string = 'itd') => {
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

      // Define base metrics based on timeframe
      let totalWorkflows, totalExceptions, totalTimeSaved, totalRevenue, totalNodes, totalExecutions, totalMoneySaved;

      // Adjust values based on the selected timeframe
      switch (timeframe) {
        case '7d':
          totalWorkflows = 734;
          totalExceptions = 42;
          totalTimeSaved = 312;
          totalRevenue = 218000;
          totalNodes = 1100;
          totalExecutions = 12500;
          totalMoneySaved = 1100000;
          break;
        case '30d':
          totalWorkflows = 1536;
          totalExceptions = 78;
          totalTimeSaved = 621;
          totalRevenue = 458000;
          totalNodes = 2300;
          totalExecutions = 24800;
          totalMoneySaved = 2310000;
          break;
        case 'mtd':
          totalWorkflows = 952;
          totalExceptions = 52;
          totalTimeSaved = 428;
          totalRevenue = 283000;
          totalNodes = 1450;
          totalExecutions = 16000;
          totalMoneySaved = 1440000;
          break;
        case 'qtd':
          totalWorkflows = 1734;
          totalExceptions = 94;
          totalTimeSaved = 781;
          totalRevenue = 517000;
          totalNodes = 2620;
          totalExecutions = 29200;
          totalMoneySaved = 2640000;
          break;
        case 'ytd':
          totalWorkflows = 2328;
          totalExceptions = 127;
          totalTimeSaved = 1049;
          totalRevenue = 693000;
          totalNodes = 3520;
          totalExecutions = 39300;
          totalMoneySaved = 3540000;
          break;
        case 'itd':
        default:
          totalWorkflows = 2847;
          totalExceptions = 156;
          totalTimeSaved = 1284;
          totalRevenue = 847000;
          totalNodes = 4300;
          totalExecutions = 48000;
          totalMoneySaved = 4320000;
          break;
      }

      // Create metrics array with distributed values
      if (clientsData && clientsData.length > 0) {
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
  }, [timeframe]); // Re-fetch when timeframe changes

  return { 
    workflows, 
    clientMetrics,
    loading, 
    error,
    fetchWorkflows,
    fetchClientMetrics
  };
};

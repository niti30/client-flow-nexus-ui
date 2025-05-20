
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkflowROI } from "@/types/workflow";

export const useClientWorkflows = (clientId: string | null | undefined) => {
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Use react-query to fetch and cache the workflow data
  const { 
    data: workflows = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['workflow-roi', clientId, sortColumn, sortOrder],
    queryFn: async () => {
      if (!clientId) {
        console.error("No client ID provided");
        return [];
      }
      
      try {
        console.log(`Fetching workflows for client ${clientId} ordered by ${sortColumn} ${sortOrder}`);
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('client_id', clientId)
          .order(sortColumn, { ascending: sortOrder === 'asc' });
          
        if (error) {
          console.error("Error fetching workflows:", error);
          throw error;
        }
        
        console.log("Fetched workflows:", data);
        
        // Map the database data to our WorkflowROI format
        return data.map(workflow => ({
          id: workflow.id,
          created_at: workflow.created_at || '',
          department: workflow.department || '',
          workflow_name: workflow.name,
          description: workflow.description || '',
          nodes: workflow.nodes || 0,
          executions: workflow.executions || 0,
          exceptions: workflow.exceptions || 0,
          time_saved: workflow.time_saved || 0,
          cost_saved: workflow.cost_saved || 0,
          status: workflow.status === 'active'
        }));
      } catch (error) {
        console.error("Error fetching workflow data:", error);
        toast.error("Failed to fetch workflows");
        return [];
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!clientId, // Only run the query if clientId exists
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return {
    workflows,
    isLoading,
    refetch,
    sortColumn,
    sortOrder,
    handleSort
  };
};

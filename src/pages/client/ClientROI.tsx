import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Button } from "@/components/ui/button";
import { AddWorkflowDialog } from "@/components/dialogs/AddWorkflowDialog";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Workflow } from "@/types/workflow";
import WorkflowStatusToggle from "@/components/workflows/WorkflowStatusToggle";

interface WorkflowROI {
  id: string;
  created_at: string;
  department: string;
  workflow_name: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  time_saved: number;
  cost_saved: number;
  status: boolean;
}

const ClientROI = () => {
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [workflows, setWorkflows] = useState<WorkflowROI[]>([]);
  const { clientId } = useParams<{ clientId: string }>();
  
  // Fetch workflow ROI data
  const { data: workflowsData, isLoading, refetch } = useQuery({
    queryKey: ['workflow-roi', clientId, sortColumn, sortOrder],
    queryFn: async () => {
      // Try to fetch real data from Supabase if possible
      if (clientId) {
        try {
          const { data, error } = await supabase
            .from('workflows')
            .select('*')
            .eq('client_id', clientId)
            .order(sortColumn, { ascending: sortOrder === 'asc' });
            
          if (error) {
            console.error("Error fetching workflows:", error);
            throw error;
          }
          
          if (data && data.length > 0) {
            // Format the data to match the WorkflowROI interface
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
          }
          
          return []; // Return empty array if no workflows found
        } catch (error) {
          console.error("Error fetching workflow data:", error);
          toast.error("Failed to fetch workflows");
          return [];
        }
      }
      
      // Mock data based on the UI in the image if no data from Supabase
      return [
        {
          id: "1",
          created_at: "2025-05-14 09:30",
          department: "Finance",
          workflow_name: "Invoice Processing",
          description: "Automated invoice processing workflow",
          nodes: 12,
          executions: 1234,
          exceptions: 23,
          time_saved: 156.5,
          cost_saved: 15650,
          status: true
        },
        {
          id: "2",
          created_at: "2025-05-13 14:15",
          department: "HR",
          workflow_name: "Employee Onboarding",
          description: "New employee onboarding automation",
          nodes: 8,
          executions: 456,
          exceptions: 5,
          time_saved: 89.2,
          cost_saved: 8920,
          status: true
        }
      ] as WorkflowROI[];
    }
  });
  
  // Update workflows state when data changes
  useEffect(() => {
    if (workflowsData) {
      setWorkflows(workflowsData);
    }
  }, [workflowsData]);
  
  const handleAddWorkflow = (newWorkflow?: Workflow) => {
    if (!newWorkflow) return;
    
    // Convert the Workflow format to WorkflowROI format
    const newWorkflowROI: WorkflowROI = {
      id: newWorkflow.id,
      created_at: newWorkflow.created_at,
      department: newWorkflow.department || '',
      workflow_name: newWorkflow.name,
      description: newWorkflow.description || '',
      nodes: newWorkflow.nodes,
      executions: newWorkflow.executions,
      exceptions: newWorkflow.exceptions,
      time_saved: parseFloat(newWorkflow.timeSaved || '0'),
      cost_saved: parseFloat(newWorkflow.moneySaved || '0'),
      status: newWorkflow.status === 'active'
    };
    
    // Add the new workflow to the state
    setWorkflows(prev => [newWorkflowROI, ...prev]);
    toast.success("Workflow added successfully");
    
    // Refetch the data to ensure we have the latest
    refetch();
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
  
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Workflow ROI</h1>
              {clientId && (
                <AddWorkflowDialog
                  onWorkflowAdded={handleAddWorkflow}
                  clientId={clientId}
                >
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Workflow
                  </Button>
                </AddWorkflowDialog>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("created_at")}
                        >
                          <div className="flex items-center">
                            Create Date/Time {renderSortIndicator("created_at")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("department")}
                        >
                          <div className="flex items-center">
                            Department {renderSortIndicator("department")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("workflow_name")}
                        >
                          <div className="flex items-center">
                            Workflow Name {renderSortIndicator("workflow_name")}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Description
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("nodes")}
                        >
                          <div className="flex items-center">
                            Nodes {renderSortIndicator("nodes")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("executions")}
                        >
                          <div className="flex items-center">
                            Executions {renderSortIndicator("executions")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("exceptions")}
                        >
                          <div className="flex items-center">
                            Exceptions {renderSortIndicator("exceptions")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("time_saved")}
                        >
                          <div className="flex items-center">
                            Time Saved {renderSortIndicator("time_saved")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                          onClick={() => handleSort("cost_saved")}
                        >
                          <div className="flex items-center">
                            Cost Saved {renderSortIndicator("cost_saved")}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflows.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="h-24 text-center text-gray-500">
                            No workflows found. Click "New Workflow" to create one.
                          </td>
                        </tr>
                      ) : (
                        workflows.map((workflow) => {
                          // Format date for display
                          const formattedDate = new Date(workflow.created_at).toLocaleString();
                          
                          return (
                            <tr key={workflow.id} className="border-b border-border hover:bg-muted/50">
                              <td className="px-4 py-3 text-sm">{formattedDate}</td>
                              <td className="px-4 py-3 text-sm">{workflow.department}</td>
                              <td className="px-4 py-3 text-sm text-blue-500 hover:underline cursor-pointer">
                                {workflow.workflow_name}
                              </td>
                              <td className="px-4 py-3 text-sm">{workflow.description}</td>
                              <td className="px-4 py-3 text-sm">{workflow.nodes}</td>
                              <td className="px-4 py-3 text-sm">{workflow.executions}</td>
                              <td className="px-4 py-3 text-sm">{workflow.exceptions}</td>
                              <td className="px-4 py-3 text-sm">{workflow.time_saved} hrs</td>
                              <td className="px-4 py-3 text-sm">${workflow.cost_saved.toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm">
                                <WorkflowStatusToggle 
                                  workflowId={workflow.id} 
                                  initialStatus={workflow.status ? 'active' : 'inactive'} 
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientROI;

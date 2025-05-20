
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Workflow } from "@/components/dialogs/AddWorkflowDialog";
import MissingClientIdAlert from "@/components/client-roi/MissingClientIdAlert";
import WorkflowROIHeader from "@/components/client-roi/WorkflowROIHeader";
import WorkflowROITable from "@/components/client-roi/WorkflowROITable";
import { useClientWorkflows } from "@/hooks/useClientWorkflows";

const ClientROI = () => {
  const params = useParams<{ clientId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Try to get clientId from different sources
  const clientIdFromParams = params.clientId;
  const clientIdFromQuery = searchParams.get('clientId');
  const clientId = clientIdFromParams || clientIdFromQuery || localStorage.getItem('selectedClientId');
  
  // Save clientId to localStorage if available
  useEffect(() => {
    if (clientId) {
      localStorage.setItem('selectedClientId', clientId);
    }
  }, [clientId]);

  // Use our custom hook to manage workflows
  const { 
    workflows, 
    isLoading, 
    refetch, 
    sortColumn, 
    sortOrder, 
    handleSort 
  } = useClientWorkflows(clientId);
  
  const handleAddWorkflow = (newWorkflow: Workflow) => {
    console.log("New workflow added:", newWorkflow);
    // Trigger a refetch to get the latest data from the database
    refetch();
    toast.success("Workflow added successfully");
  };

  // If clientId is missing, show an alert and a button to return to clients page
  if (!clientId) {
    return (
      <div className="flex h-screen bg-background">
        <ClientSidebar />
        
        <div className="flex-1 flex flex-col">
          <ClientHeader />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Workflow ROI</h1>
              </div>
              
              <MissingClientIdAlert />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <WorkflowROIHeader 
              clientId={clientId} 
              onWorkflowAdded={handleAddWorkflow} 
            />
            
            <WorkflowROITable
              workflows={workflows}
              isLoading={isLoading}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientROI;

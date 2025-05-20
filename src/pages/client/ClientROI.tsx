
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Workflow } from "@/components/dialogs/AddWorkflowDialog";
import MissingClientIdAlert from "@/components/client-roi/MissingClientIdAlert";
import WorkflowROIHeader from "@/components/client-roi/WorkflowROIHeader";
import WorkflowROITable from "@/components/client-roi/WorkflowROITable";
import { useClientWorkflows } from "@/hooks/useClientWorkflows";
import { useEffect, useState } from "react";

const ClientROI = () => {
  const navigate = useNavigate();
  const params = useParams<{ clientId: string }>();
  const [searchParams] = useSearchParams();
  const [clientId, setClientId] = useState<string | null>(null);
  
  // Try to get clientId from different sources and save it
  useEffect(() => {
    // Check all possible sources for clientId
    const clientIdFromParams = params.clientId;
    const clientIdFromQuery = searchParams.get('clientId');
    const clientIdFromStorage = localStorage.getItem('selectedClientId');
    
    console.log("ClientROI - Attempting to get client ID from:", {
      fromParams: clientIdFromParams,
      fromQuery: clientIdFromQuery,
      fromStorage: clientIdFromStorage
    });

    // Use the first available source in order of precedence
    const resolvedClientId = clientIdFromParams || clientIdFromQuery || clientIdFromStorage;
    
    if (resolvedClientId) {
      console.log("ClientROI - Setting client ID to:", resolvedClientId);
      setClientId(resolvedClientId);
      localStorage.setItem('selectedClientId', resolvedClientId);
    } else {
      console.log("ClientROI - No client ID found");
      toast.error("Client ID is missing. Please select a client first.");
    }
  }, [params.clientId, searchParams]);

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

  const handleReturnToClients = () => {
    navigate('/clients');
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
              
              <MissingClientIdAlert onReturnToClients={handleReturnToClients} />
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

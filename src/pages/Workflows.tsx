
import { useState, useEffect } from 'react';
import { useWorkflows } from '@/hooks/useWorkflows';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import WorkflowsTable from '@/components/workflows/WorkflowsTable';
import WorkflowSearchBar from '@/components/workflows/WorkflowSearchBar';
import { AddWorkflowDialog } from '@/components/dialogs/AddWorkflowDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Workflows = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { workflows, loading } = useWorkflows();
  // This is a placeholder - in a real app, you'd get the client ID from context or state
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);

  const handleSearch = (query: string) => {
    // Placeholder for search functionality
    console.log('Searching for:', query);
  };

  const handleWorkflowAdded = () => {
    // Trigger a refresh of the workflows data
    setRefreshTrigger(prev => prev + 1);
    toast("Workflow added successfully");
  };

  // Handle ROI Report click
  const handleRoiReportClick = () => {
    // In a real app, this would generate and download a report
    // For now we'll simulate a file download
    const dummyLink = document.createElement('a');
    dummyLink.href = 'data:text/plain;charset=utf-8,ROI Report Data';
    dummyLink.download = 'ROI_Report.csv';
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  };

  // For demonstration, let's fetch clients to get a default client ID
  useEffect(() => {
    const fetchDefaultClient = async () => {
      const { data } = await supabase
        .from('clients')
        .select('id')
        .limit(1);
      
      if (data && data.length > 0) {
        setSelectedClientId(data[0].id);
      }
    };

    fetchDefaultClient();
  }, []);

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-white mb-2 md:mb-0">Workflows</h1>
              <div className="flex items-center gap-4">
                <WorkflowSearchBar 
                  onSearch={handleSearch} 
                />
                <AddWorkflowDialog 
                  buttonClassName="bg-[#2a2a2d] hover:bg-[#3a3a3d] text-white" 
                  onWorkflowAdded={handleWorkflowAdded}
                  clientId={selectedClientId}
                />
              </div>
            </div>
            
            <WorkflowsTable 
              refreshTrigger={refreshTrigger}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Workflows;

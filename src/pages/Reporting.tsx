
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import WorkflowLogs from "@/components/reporting/WorkflowLogs";
import { useWorkflowLogs } from "@/hooks/useWorkflowLogs";

const Reporting = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("Invoice Processing Workflow");
  const { logs, loading } = useWorkflowLogs();

  const handleWorkflowChange = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-full mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reporting Dashboard</h1>
              <p className="text-gray-500 mt-1">View workflow execution logs and performance metrics</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <WorkflowLogs 
                logs={logs}
                selectedWorkflow={selectedWorkflow}
                onWorkflowChange={handleWorkflowChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reporting;

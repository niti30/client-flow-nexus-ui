import { useState, useEffect } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import WorkflowLogs from "@/components/reporting/WorkflowLogs";
import { useWorkflowLogs } from "@/hooks/useWorkflowLogs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
const Reporting = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("All Workflows");
  const {
    logs,
    loading
  } = useWorkflowLogs();
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const {
    toast
  } = useToast();
  const [workflowOptions, setWorkflowOptions] = useState<string[]>([]);
  useEffect(() => {
    // Create the list of unique workflow names for filtering
    if (logs.length) {
      const uniqueWorkflows = Array.from(new Set(logs.map(log => log.workflow)));
      setWorkflowOptions(["All Workflows", ...uniqueWorkflows]);
    }

    // Filter logs based on selected workflow
    if (selectedWorkflow === "All Workflows") {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.workflow === selectedWorkflow));
    }
  }, [selectedWorkflow, logs]);
  const handleWorkflowChange = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };
  const handleExportLogs = () => {
    // Create CSV content
    const headers = ["Timestamp", "Workflow", "Status", "Execution Details"];

    // Convert logs to CSV rows
    const csvRows = [headers.join(','), ...filteredLogs.map(log => [log.timestamp, log.workflow, log.status, `"${log.executionDetails.replace(/"/g, '""')}"`].join(','))];

    // Combine rows into a single CSV string
    const csvContent = csvRows.join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `workflow-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Logs Exported",
      description: "Workflow logs have been exported to CSV",
      variant: "default"
    });
  };
  return <div className="flex h-screen overflow-hidden bg-[#faf9f8]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="mb-6">
              
              
            </div>
            
            
            
            {loading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
              </div> : <WorkflowLogs logs={filteredLogs} selectedWorkflow={selectedWorkflow} onWorkflowChange={handleWorkflowChange} onExportLogs={handleExportLogs} />}
          </div>
        </main>
      </div>
    </div>;
};
export default Reporting;
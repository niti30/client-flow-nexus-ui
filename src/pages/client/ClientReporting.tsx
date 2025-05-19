
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Button } from "@/components/ui/button";

interface ExecutionLog {
  timestamp: string;
  workflow: string;
  executionDetails: string;
  status: string;
}

const ClientReporting = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("Invoice Processing Workflow");
  
  // Fetch execution logs for the selected workflow
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['execution-logs', selectedWorkflow],
    queryFn: async () => {
      // This would normally fetch from the database
      // Mock data based on the UI in the image
      return [
        { 
          timestamp: "2025-05-14 02:15:47", 
          workflow: "Invoice Processing", 
          executionDetails: "Successfully processed invoice #INV-2025-001",
          status: "completed"
        },
        { 
          timestamp: "2025-05-14 02:14:32", 
          workflow: "Invoice Processing", 
          executionDetails: "Data extraction completed for invoice #INV-2025-002",
          status: "completed"
        },
        { 
          timestamp: "2025-05-14 02:13:15", 
          workflow: "Invoice Processing", 
          executionDetails: "Started processing invoice batch #BATCH-051",
          status: "in_progress"
        },
        { 
          timestamp: "2025-05-14 02:12:03", 
          workflow: "Invoice Processing", 
          executionDetails: "Validation checks passed for invoice #INV-2025-003",
          status: "completed"
        },
        { 
          timestamp: "2025-05-14 02:10:47", 
          workflow: "Invoice Processing", 
          executionDetails: "New invoice detected in input folder",
          status: "completed"
        }
      ] as ExecutionLog[];
    },
    enabled: !!selectedWorkflow
  });
  
  const handleWorkflowChange = (workflow: string) => {
    setSelectedWorkflow(workflow);
  };

  const handleExportLogs = () => {
    // Create CSV content
    const headers = ["Timestamp", "Workflow", "Execution Details"];
    
    // Convert logs to CSV rows
    const csvRows = [
      headers.join(','),
      ...(logsData || []).map(log => [
        log.timestamp,
        log.workflow,
        `"${log.executionDetails.replace(/"/g, '""')}"`
      ].join(','))
    ];
    
    // Combine rows into a single CSV string
    const csvContent = csvRows.join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col space-y-4">
                  <h2 className="text-2xl font-bold">Workflow Execution Logs</h2>
                  
                  <div className="flex items-center justify-between">
                    <div className="relative w-[280px]">
                      <select 
                        className="w-full p-2 pr-8 border border-gray-200 rounded bg-white appearance-none cursor-pointer"
                        value={selectedWorkflow}
                        onChange={(e) => handleWorkflowChange(e.target.value)}
                      >
                        <option value="Invoice Processing Workflow">Invoice Processing Workflow</option>
                        <option value="Employee Onboarding">Employee Onboarding</option>
                        <option value="Contract Review">Contract Review</option>
                        <option value="Expense Approval">Expense Approval</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <Button 
                      variant="default" 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleExportLogs}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Export Logs
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-t border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-gray-700 font-medium text-base">Timestamp</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium text-base">Workflow</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-medium text-base">Execution Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logsData && logsData.map((log, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{log.timestamp}</td>
                          <td className="px-6 py-4 text-gray-800">{log.workflow}</td>
                          <td className="px-6 py-4 text-gray-800">{log.executionDetails}</td>
                        </tr>
                      ))}
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

export default ClientReporting;

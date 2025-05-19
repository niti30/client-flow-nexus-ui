
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/hooks/use-toast';

interface Log {
  timestamp: string;
  workflow: string;
  executionDetails: string;
}

const ClientReporting = () => {
  const { user } = useAuth();
  const location = useLocation();
  const clientId = location.state?.clientId || 'demo';
  const { toast } = useToast();
  
  const [selectedWorkflow, setSelectedWorkflow] = useState("Invoice Processing Workflow");
  const [workflowOptions, setWorkflowOptions] = useState(["Invoice Processing Workflow"]);
  const [logs, setLogs] = useState<Log[]>([
    {
      timestamp: "2025-05-14 02:15:47",
      workflow: "Invoice Processing",
      executionDetails: "Successfully processed invoice #INV-2025-001"
    },
    {
      timestamp: "2025-05-14 02:14:32",
      workflow: "Invoice Processing",
      executionDetails: "Data extraction completed for invoice #INV-2025-002"
    },
    {
      timestamp: "2025-05-14 02:13:15",
      workflow: "Invoice Processing",
      executionDetails: "Started processing invoice batch #BATCH-051"
    },
    {
      timestamp: "2025-05-14 02:12:03",
      workflow: "Invoice Processing",
      executionDetails: "Validation checks passed for invoice #INV-2025-003"
    },
    {
      timestamp: "2025-05-14 02:10:47",
      workflow: "Invoice Processing",
      executionDetails: "New invoice detected in input folder"
    }
  ]);

  const handleWorkflowChange = (value: string) => {
    setSelectedWorkflow(value);
  };

  const handleExportLogs = () => {
    // Create CSV content
    const headers = ["Timestamp", "Workflow", "Execution Details"];
    
    // Convert logs to CSV rows
    const csvRows = [
      headers.join(','),
      ...logs.map(log => [
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
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Acme Corporation</h1>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Workflow Execution Logs</h1>
          
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <Select 
              value={selectedWorkflow}
              onValueChange={handleWorkflowChange}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select Workflow" />
              </SelectTrigger>
              <SelectContent>
                {workflowOptions.map(workflow => (
                  <SelectItem key={workflow} value={workflow}>
                    {workflow}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleExportLogs}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Execution Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.workflow}</TableCell>
                    <TableCell>{log.executionDetails}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientReporting;

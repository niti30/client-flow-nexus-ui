
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface ExecutionLog {
  id: string;
  timestamp: string;
  workflow: string;
  details: string;
}

const ClientReporting = () => {
  const { user } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("Invoice Processing");
  
  // Fetch execution logs for the selected workflow
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['execution-logs', user?.id, selectedWorkflow],
    queryFn: async () => {
      // This would normally fetch from the database
      // Mock data for now
      return [
        { 
          id: "1", 
          timestamp: "2025-05-14 02:15:47", 
          workflow: "Invoice Processing", 
          details: "Successfully processed invoice #INV-2025-001" 
        },
        { 
          id: "2", 
          timestamp: "2025-05-14 02:14:32", 
          workflow: "Invoice Processing", 
          details: "Data extraction completed for invoice #INV-2025-002" 
        },
        { 
          id: "3", 
          timestamp: "2025-05-14 02:13:15", 
          workflow: "Invoice Processing", 
          details: "Started processing invoice batch #BATCH-051" 
        },
        { 
          id: "4", 
          timestamp: "2025-05-14 02:12:03", 
          workflow: "Invoice Processing", 
          details: "Validation checks passed for invoice #INV-2025-003" 
        },
        { 
          id: "5", 
          timestamp: "2025-05-14 02:10:47", 
          workflow: "Invoice Processing", 
          details: "New invoice detected in input folder" 
        }
      ];
    },
    enabled: !!user && !!selectedWorkflow
  });
  
  const workflows = [
    "Invoice Processing",
    "Employee Onboarding",
    "Contract Review",
    "Expense Approval"
  ];

  const handleExportLogs = () => {
    // Create CSV content
    const headers = ["Timestamp", "Workflow", "Execution Details"];
    
    // Convert logs to CSV rows
    const csvRows = [
      headers.join(','),
      ...(logsData || []).map(log => [
        log.timestamp,
        log.workflow,
        `"${log.details.replace(/"/g, '""')}"`
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
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Workflow Execution Logs</h1>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="w-64">
              <Select 
                value={selectedWorkflow} 
                onValueChange={setSelectedWorkflow}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select Workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow} value={workflow}>
                      {workflow} Workflow
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleExportLogs}
              disabled={isLoading || !(logsData && logsData.length > 0)}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">Timestamp</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">Workflow</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">Execution Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : logsData && logsData.length > 0 ? (
                  logsData.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{log.timestamp}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.workflow}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No execution logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientReporting;

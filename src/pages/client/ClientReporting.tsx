
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

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

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Workflow Execution Logs</h1>
          <div className="flex items-center space-x-4">
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
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedWorkflow}
                onChange={(e) => setSelectedWorkflow(e.target.value)}
              >
                {workflows.map((workflow) => (
                  <option key={workflow} value={workflow}>
                    {workflow} Workflow
                  </option>
                ))}
              </select>
            </div>
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

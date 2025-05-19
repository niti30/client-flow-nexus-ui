
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface WorkflowROI {
  id: string;
  name: string;
  created_at: string;
  workflow_name: string;
  department: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  time_saved: number;
  cost_saved: number;
}

const ClientROI = () => {
  const { user } = useAuth();
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Fetch workflow ROI data
  const { data: workflowsData, isLoading, error } = useQuery({
    queryKey: ['workflow-roi', user?.id, sortColumn, sortOrder],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the user information including client_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('client_id')
        .eq('id', user.id)
        .single();
        
      if (userError || !userData?.client_id) {
        console.error('Error fetching user client_id:', userError);
        return [];
      }
      
      // Mock data since we don't have actual ROI table yet
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
        }
      ];
    },
    enabled: !!user
  });
  
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
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Workflow ROI</h1>
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
          <div className="flex justify-end mb-4">
            <Button variant="outline">New</Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("created_at")}>
                      <div className="flex items-center">
                        Create Date/Time {renderSortIndicator("created_at")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("department")}>
                      <div className="flex items-center">
                        Department {renderSortIndicator("department")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("workflow_name")}>
                      <div className="flex items-center">
                        Workflow Name {renderSortIndicator("workflow_name")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("nodes")}>
                      <div className="flex items-center">
                        Nodes {renderSortIndicator("nodes")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("executions")}>
                      <div className="flex items-center">
                        Executions {renderSortIndicator("executions")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("exceptions")}>
                      <div className="flex items-center">
                        Exceptions {renderSortIndicator("exceptions")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("time_saved")}>
                      <div className="flex items-center">
                        Time Saved {renderSortIndicator("time_saved")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600" onClick={() => handleSort("cost_saved")}>
                      <div className="flex items-center">
                        Cost Saved {renderSortIndicator("cost_saved")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-3 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : workflowsData && workflowsData.length > 0 ? (
                    workflowsData.map((workflow) => (
                      <tr key={workflow.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{workflow.created_at}</td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-3 text-center text-gray-500">No workflow data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientROI;

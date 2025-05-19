
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Button } from "@/components/ui/button";

interface WorkflowROI {
  id: string;
  created_at: string;
  department: string;
  workflow_name: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  time_saved: number;
  cost_saved: number;
  status: boolean;
}

const ClientROI = () => {
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Fetch workflow ROI data
  const { data: workflowsData, isLoading } = useQuery({
    queryKey: ['workflow-roi', sortColumn, sortOrder],
    queryFn: async () => {
      // Mock data based on the UI in the image
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
          status: true
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
          status: true
        }
      ] as WorkflowROI[];
    }
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
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader title="Acme Corporation" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Workflow ROI</h1>
              <Button className="bg-black text-white hover:bg-gray-800 rounded-md">
                <Plus className="mr-2 h-4 w-4" />
                New Workflow
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("created_at")}
                        >
                          <div className="flex items-center">
                            Create Date/Time {renderSortIndicator("created_at")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("department")}
                        >
                          <div className="flex items-center">
                            Department {renderSortIndicator("department")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("workflow_name")}
                        >
                          <div className="flex items-center">
                            Workflow Name {renderSortIndicator("workflow_name")}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Description
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("nodes")}
                        >
                          <div className="flex items-center">
                            Nodes {renderSortIndicator("nodes")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("executions")}
                        >
                          <div className="flex items-center">
                            Executions {renderSortIndicator("executions")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("exceptions")}
                        >
                          <div className="flex items-center">
                            Exceptions {renderSortIndicator("exceptions")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("time_saved")}
                        >
                          <div className="flex items-center">
                            Time Saved {renderSortIndicator("time_saved")}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left cursor-pointer text-sm font-medium text-gray-600"
                          onClick={() => handleSort("cost_saved")}
                        >
                          <div className="flex items-center">
                            Cost Saved {renderSortIndicator("cost_saved")}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflowsData && workflowsData.map((workflow) => (
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
                          <td className="px-4 py-3 text-sm">
                            <div className="w-10 h-6 rounded-full bg-gray-200 flex items-center">
                              <div className={`w-5 h-5 rounded-full transform transition-transform duration-200 ${workflow.status ? "translate-x-4 bg-green-500" : "translate-x-1 bg-gray-400"}`}></div>
                            </div>
                          </td>
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

export default ClientROI;

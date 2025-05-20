
import { useState } from "react";
import { WorkflowROI } from "@/types/workflow";

interface WorkflowROITableProps {
  workflows: WorkflowROI[];
  isLoading: boolean;
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: "asc" | "desc";
}

const WorkflowROITable = ({ 
  workflows, 
  isLoading, 
  onSort, 
  sortColumn, 
  sortOrder 
}: WorkflowROITableProps) => {
  
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("created_at")}
              >
                <div className="flex items-center">
                  Create Date/Time {renderSortIndicator("created_at")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("department")}
              >
                <div className="flex items-center">
                  Department {renderSortIndicator("department")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Workflow Name {renderSortIndicator("name")}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Description
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("nodes")}
              >
                <div className="flex items-center">
                  Nodes {renderSortIndicator("nodes")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("executions")}
              >
                <div className="flex items-center">
                  Executions {renderSortIndicator("executions")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("exceptions")}
              >
                <div className="flex items-center">
                  Exceptions {renderSortIndicator("exceptions")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("time_saved")}
              >
                <div className="flex items-center">
                  Time Saved {renderSortIndicator("time_saved")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer text-sm font-medium"
                onClick={() => onSort("cost_saved")}
              >
                <div className="flex items-center">
                  Cost Saved {renderSortIndicator("cost_saved")}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {workflows.length === 0 ? (
              <tr>
                <td colSpan={10} className="h-24 text-center text-gray-500">
                  No workflows found. Click "New Workflow" to create one.
                </td>
              </tr>
            ) : (
              workflows.map((workflow) => {
                // Format date for display
                const formattedDate = new Date(workflow.created_at).toLocaleString();
                
                return (
                  <tr key={workflow.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{formattedDate}</td>
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
                      <div className="w-10 h-6 rounded-full bg-muted flex items-center">
                        <div className={`w-5 h-5 rounded-full transform transition-transform duration-200 ${workflow.status ? "translate-x-4 bg-green-500" : "translate-x-1 bg-gray-400"}`}></div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkflowROITable;


import { useState } from "react";
import { WorkflowROI } from "@/types/workflow";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("created_at")}
            >
              Create Date/Time {renderSortIndicator("created_at")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("department")}
            >
              Department {renderSortIndicator("department")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("workflow_name")}
            >
              Workflow Name {renderSortIndicator("workflow_name")}
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("nodes")}
            >
              Nodes {renderSortIndicator("nodes")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("executions")}
            >
              Executions {renderSortIndicator("executions")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("exceptions")}
            >
              Exceptions {renderSortIndicator("exceptions")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("time_saved")}
            >
              Time Saved {renderSortIndicator("time_saved")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("cost_saved")}
            >
              Cost Saved {renderSortIndicator("cost_saved")}
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                No workflows found. Click "New Workflow" to create one.
              </TableCell>
            </TableRow>
          ) : (
            workflows.map((workflow) => {
              // Format date for display
              const formattedDate = new Date(workflow.created_at).toLocaleString();
              
              return (
                <TableRow key={workflow.id}>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{workflow.department}</TableCell>
                  <TableCell className="text-blue-500 hover:underline cursor-pointer">
                    {workflow.workflow_name}
                  </TableCell>
                  <TableCell>{workflow.description}</TableCell>
                  <TableCell>{workflow.nodes}</TableCell>
                  <TableCell>{workflow.executions}</TableCell>
                  <TableCell>{workflow.exceptions}</TableCell>
                  <TableCell>{workflow.time_saved} hrs</TableCell>
                  <TableCell>${workflow.cost_saved.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className={`w-5 h-5 rounded-full ${workflow.status ? "bg-green-500" : "bg-gray-400"}`}></div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkflowROITable;

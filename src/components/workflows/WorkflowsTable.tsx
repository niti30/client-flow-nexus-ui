
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useToast } from "@/components/ui/use-toast";

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'info';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};

interface Workflow {
  id: string;
  name: string;
  status: string;
  progress: number;
  created_at: string;
  completed_at: string | null;
  clients?: {
    name: string;
  };
}

interface WorkflowsTableProps {
  workflows?: Workflow[];
  loading?: boolean;
  refreshTrigger?: number;
}

const WorkflowsTable = ({ workflows: propWorkflows, loading: propLoading, refreshTrigger }: WorkflowsTableProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  
  // Use the hook if workflows aren't passed as props
  const { workflows: hookWorkflows, loading: hookLoading, fetchWorkflows } = useWorkflows();
  
  // Use props if provided, otherwise use hook data
  const workflows = propWorkflows || hookWorkflows;
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  
  // Re-fetch when refresh trigger changes
  useEffect(() => {
    if (refreshTrigger && !propWorkflows) {
      fetchWorkflows();
    }
  }, [refreshTrigger, propWorkflows, fetchWorkflows]);
  
  // Calculate total pages
  useEffect(() => {
    if (workflows?.length) {
      setTotalPages(Math.ceil(workflows.length / pageSize));
    }
  }, [workflows]);
  
  // Get current page of workflows
  const getCurrentPageWorkflows = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return workflows?.slice(startIndex, endIndex) || [];
  };
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Workflow</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading workflows...
                </TableCell>
              </TableRow>
            ) : workflows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No workflows found.
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageWorkflows().map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>{workflow.clients?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(workflow.status)}>
                      {workflow.status?.replace('_', ' ') || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${workflow.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{workflow.progress || 0}%</span>
                  </TableCell>
                  <TableCell>
                    {workflow.created_at ? new Date(workflow.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    {workflow.completed_at ? new Date(workflow.completed_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-t py-2 px-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show up to 5 pages around current page
              let pageNumber = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNumber = i + currentPage - 2;
                if (pageNumber > totalPages) {
                  pageNumber = totalPages - 4 + i;
                }
              }
              
              return (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default WorkflowsTable;

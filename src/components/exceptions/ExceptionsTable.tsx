
import { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Exception } from "@/hooks/useExceptions";

interface ExceptionsTableProps {
  exceptions: Exception[];
  loading: boolean;
  onViewCredentials?: (clientId: string) => void;
}

type SortField = 'created_at' | 'client' | 'department' | 'workflow' | 'exception_type' | 'severity' | 'remedy' | 'status';
type SortDirection = 'asc' | 'desc';

const ExceptionsTable = ({ exceptions, loading, onViewCredentials }: ExceptionsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-amber-500 text-white';
      case 'medium':
        return 'bg-amber-400 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.toISOString().split('T')[0]} ${date.toTimeString().slice(0, 5)}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="inline ml-1" size={14} /> 
      : <ArrowDown className="inline ml-1" size={14} />;
  };

  const handleStatusChange = (exceptionId: string, newStatus: string) => {
    console.log(`Exception ${exceptionId} status changed to ${newStatus}`);
    // In a real implementation, we would update the exception status in the database
  };

  const sortedExceptions = [...exceptions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'client':
        comparison = (a.clients?.name || '').localeCompare(b.clients?.name || '');
        break;
      case 'department':
        comparison = (a.department || '').localeCompare(b.department || '');
        break;
      case 'workflow':
        comparison = (a.workflows?.name || '').localeCompare(b.workflows?.name || '');
        break;
      case 'exception_type':
        comparison = (a.exception_type || '').localeCompare(b.exception_type || '');
        break;
      case 'severity':
        const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        const aValue = severityOrder[a.severity as keyof typeof severityOrder] ?? 999;
        const bValue = severityOrder[b.severity as keyof typeof severityOrder] ?? 999;
        comparison = aValue - bValue;
        break;
      case 'remedy':
        comparison = (a.remedy || '').localeCompare(b.remedy || '');
        break;
      case 'status':
        comparison = (a.status || '').localeCompare(b.status || '');
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedExceptions.length / itemsPerPage);
  const paginatedExceptions = sortedExceptions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            // Show pages around current page
            let pageToShow = page;
            if (page <= 3) {
              pageToShow = i + 1;
            } else if (page >= totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            } else {
              pageToShow = page - 2 + i;
            }
            
            if (pageToShow <= totalPages) {
              return (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={pageToShow === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageToShow);
                    }}
                  >
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
              className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('created_at')}
              >
                Datetime reported {getSortIcon('created_at')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('client')}
              >
                Client name {getSortIcon('client')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('department')}
              >
                Department {getSortIcon('department')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('workflow')}
              >
                Workflow name {getSortIcon('workflow')}
              </TableHead>
              <TableHead className="whitespace-nowrap text-gray-700 font-medium text-xs uppercase">Notifications</TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('exception_type')}
              >
                Exception type {getSortIcon('exception_type')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('severity')}
              >
                Severity {getSortIcon('severity')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('remedy')}
              >
                Remedy {getSortIcon('remedy')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer text-gray-700 font-medium text-xs uppercase"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                  Loading exceptions...
                </TableCell>
              </TableRow>
            ) : paginatedExceptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                  No exceptions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExceptions.map((exception) => (
                <TableRow key={exception.id} className="border-b border-gray-200">
                  <TableCell className="text-gray-700 whitespace-nowrap">{exception.created_at ? formatDateTime(exception.created_at) : "—"}</TableCell>
                  <TableCell className="text-gray-700">
                    <button
                      onClick={() => onViewCredentials && exception.clients && onViewCredentials(exception.id)}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {exception.clients?.name || "—"}
                    </button>
                  </TableCell>
                  <TableCell className="text-gray-700">{exception.department || "—"}</TableCell>
                  <TableCell className="text-gray-700">{exception.workflows?.name || "—"}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        U
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs -ml-2">
                        A
                      </div>
                      <span className="text-xs ml-1 text-gray-700">{exception.notifications || "+2 more"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{exception.exception_type || "—"}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityBadgeColor(exception.severity || "Critical")}>
                      {exception.severity || "Critical"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{exception.remedy || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">{exception.status || "open"}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exception.id, "open")}
                            className="text-gray-700 cursor-pointer"
                          >
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exception.id, "new")}
                            className="text-gray-700 cursor-pointer"
                          >
                            New
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exception.id, "resolved")}
                            className="text-gray-700 cursor-pointer"
                          >
                            Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exception.id, "closed")}
                            className="text-gray-700 cursor-pointer"
                          >
                            Closed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-gray-200 py-2 px-4">
        {renderPagination()}
      </div>
    </div>
  );
};

export default ExceptionsTable;

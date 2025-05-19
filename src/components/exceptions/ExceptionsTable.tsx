
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
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Exception } from "@/hooks/useExceptions";

interface ExceptionsTableProps {
  exceptions: Exception[];
  loading: boolean;
}

type SortField = 'created_at' | 'client' | 'department' | 'workflow' | 'exception_type' | 'severity' | 'remedy' | 'status';
type SortDirection = 'asc' | 'desc';

const ExceptionsTable = ({ exceptions, loading }: ExceptionsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                Datetime reported {getSortIcon('created_at')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('client')}
              >
                Client name {getSortIcon('client')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('department')}
              >
                Department {getSortIcon('department')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('workflow')}
              >
                Workflow name {getSortIcon('workflow')}
              </TableHead>
              <TableHead className="whitespace-nowrap">Notifications</TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('exception_type')}
              >
                Exception type {getSortIcon('exception_type')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('severity')}
              >
                Severity {getSortIcon('severity')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('remedy')}
              >
                Remedy {getSortIcon('remedy')}
              </TableHead>
              <TableHead 
                className="whitespace-nowrap cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading exceptions...
                </TableCell>
              </TableRow>
            ) : paginatedExceptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No exceptions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExceptions.map((exception) => (
                <TableRow key={exception.id}>
                  <TableCell>{exception.created_at ? formatDateTime(exception.created_at) : "—"}</TableCell>
                  <TableCell>{exception.clients?.name || "—"}</TableCell>
                  <TableCell>{exception.department || "—"}</TableCell>
                  <TableCell>{exception.workflows?.name || "—"}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        U
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs -ml-2">
                        A
                      </div>
                      <span className="text-xs ml-1 text-gray-500">{exception.notifications || "+2 more"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{exception.exception_type || "—"}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityBadgeColor(exception.severity || "Critical")}>
                      {exception.severity || "Critical"}
                    </Badge>
                  </TableCell>
                  <TableCell>{exception.remedy || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{exception.status || "New"}</span>
                      <select className="ml-2 p-1 rounded text-sm border border-gray-200">
                        <option value="">⋮</option>
                        <option value="inprogress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-t py-2 px-4">
        {renderPagination()}
      </div>
    </div>
  );
};

export default ExceptionsTable;


import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
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
import { Exception } from "@/hooks/useExceptions";

interface ExceptionsTableProps {
  exceptions: Exception[];
  loading: boolean;
}

const ExceptionsTable = ({ exceptions, loading }: ExceptionsTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'open':
        return 'warning';
      default:
        return 'secondary';
    }
  };

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

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Datetime reported</TableHead>
              <TableHead className="whitespace-nowrap">Client name</TableHead>
              <TableHead className="whitespace-nowrap">Department</TableHead>
              <TableHead className="whitespace-nowrap">Workflow name</TableHead>
              <TableHead className="whitespace-nowrap">Notifications</TableHead>
              <TableHead className="whitespace-nowrap">Exception type</TableHead>
              <TableHead className="whitespace-nowrap">Severity</TableHead>
              <TableHead className="whitespace-nowrap">Remedy</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading exceptions...
                </TableCell>
              </TableRow>
            ) : exceptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No exceptions found.
                </TableCell>
              </TableRow>
            ) : (
              exceptions.map((exception) => (
                <TableRow key={exception.id}>
                  <TableCell>{exception.created_at ? new Date(exception.created_at).toLocaleDateString() + " " + new Date(exception.created_at).toLocaleTimeString().slice(0, 5) : "—"}</TableCell>
                  <TableCell>{exception.clients?.name || "—"}</TableCell>
                  <TableCell>{exception.department || "Finance"}</TableCell>
                  <TableCell>{exception.workflows?.name || "—"}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        U
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs -ml-2">
                        A
                      </div>
                      <span className="text-xs ml-1 text-gray-500">+2 more</span>
                    </div>
                  </TableCell>
                  <TableCell>{exception.exception_type || "Integration"}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityBadgeColor(exception.severity || "Critical")}>
                      {exception.severity || "Critical"}
                    </Badge>
                  </TableCell>
                  <TableCell>{exception.remedy || "API timeout"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{exception.status?.replace('_', ' ') || "New"}</span>
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ExceptionsTable;

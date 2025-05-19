
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useExceptions } from "@/hooks/useExceptions";
import ExceptionSearchBar from "@/components/exceptions/ExceptionSearchBar";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Exceptions = () => {
  const { exceptions, loading } = useExceptions();
  const [clientFilter, setClientFilter] = useState("All clients");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [severityFilter, setSeverityFilter] = useState("All severities");

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

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Exceptions</h1>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client name</label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All clients">All clients</SelectItem>
                    <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                    <SelectItem value="Globex">Globex</SelectItem>
                    <SelectItem value="Initech">Initech</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exception type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All types">All types</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Workflow">Workflow</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All severities">All severities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
            
          <div className="bg-white rounded-md overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap w-36">Datetime reported</TableHead>
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
                      <TableCell>{exception.exception_type || "Integration"}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadgeColor(exception.severity || "Critical")}>
                          {exception.severity || "Critical"}
                        </Badge>
                      </TableCell>
                      <TableCell>{exception.remedy || "API timeout"}</TableCell>
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
        </main>
      </div>
    </div>
  );
};

export default Exceptions;

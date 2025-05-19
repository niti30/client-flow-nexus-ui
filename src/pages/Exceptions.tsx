
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useExceptions } from "@/hooks/useExceptions";
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

  // Sample exception data matching the 3rd image
  const sampleExceptions = [
    {
      id: "1",
      created_at: "2025-05-14T12:30:00",
      clients: { name: "Acme Corp" },
      department: "Finance",
      workflows: { name: "Invoice Processing" },
      notifications: "+2 more",
      exception_type: "Integration",
      severity: "Critical",
      remedy: "API timeout",
      status: "New",
    }
  ];

  const displayExceptions = loading ? [] : (exceptions.length > 0 ? exceptions : sampleExceptions);

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
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
          <div className="max-w-full mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Exceptions</h1>
            
            <div className="bg-white p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            
            <div className="bg-white rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datetime reported</TableHead>
                    <TableHead>Client name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Workflow name</TableHead>
                    <TableHead>Notifications</TableHead>
                    <TableHead>Exception type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Remedy</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayExceptions.map((exception) => (
                    <TableRow key={exception.id}>
                      <TableCell>{formatDateTime(exception.created_at)}</TableCell>
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
                          <span className="text-xs ml-1 text-gray-500">{exception.notifications || ""}</span>
                        </div>
                      </TableCell>
                      <TableCell>{exception.exception_type || "—"}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadgeColor(exception.severity || "")}>
                          {exception.severity || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>{exception.remedy || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{exception.status || "—"}</span>
                          <select className="ml-2 p-1 rounded text-sm border border-gray-200">
                            <option value="">⋮</option>
                            <option value="inprogress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exceptions;


import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Workflow {
  createDate: string;
  department: string;
  name: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved: string;
  costSaved: string;
}

const ClientROI = () => {
  const { user } = useAuth();
  const location = useLocation();
  const clientId = location.state?.clientId || 'demo';
  
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      createDate: "2025-05-14 09:30",
      department: "Finance",
      name: "Invoice Processing",
      description: "Automated invoice processing workflow",
      nodes: 12,
      executions: 1234,
      exceptions: 23,
      timeSaved: "156.5 hrs",
      costSaved: "$15,650"
    },
    {
      createDate: "2025-05-13 14:15",
      department: "HR",
      name: "Employee Onboarding",
      description: "New employee onboarding automation",
      nodes: 8,
      executions: 456,
      exceptions: 5,
      timeSaved: "89.2 hrs",
      costSaved: "$8,920"
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5)
    };
  };

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Acme Corporation</h1>
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
          <h1 className="text-2xl font-semibold mb-6">Workflow ROI</h1>
          
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Create Date/Time</TableHead>
                  <TableHead className="whitespace-nowrap">Department</TableHead>
                  <TableHead className="whitespace-nowrap">Workflow Name</TableHead>
                  <TableHead className="whitespace-nowrap">Description</TableHead>
                  <TableHead className="whitespace-nowrap">Nodes</TableHead>
                  <TableHead className="whitespace-nowrap">Executions</TableHead>
                  <TableHead className="whitespace-nowrap">Exceptions</TableHead>
                  <TableHead className="whitespace-nowrap">Time Saved</TableHead>
                  <TableHead className="whitespace-nowrap">Cost Saved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow, idx) => {
                  const formattedDate = formatDate(workflow.createDate);
                  return (
                    <TableRow key={idx}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{formattedDate.date}</span>
                          <span>{formattedDate.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{workflow.department}</TableCell>
                      <TableCell className="text-blue-600 font-medium">{workflow.name}</TableCell>
                      <TableCell>{workflow.description}</TableCell>
                      <TableCell>{workflow.nodes}</TableCell>
                      <TableCell className="text-blue-600">{workflow.executions}</TableCell>
                      <TableCell className="text-blue-600">{workflow.exceptions}</TableCell>
                      <TableCell>{workflow.timeSaved}</TableCell>
                      <TableCell>{workflow.costSaved}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientROI;

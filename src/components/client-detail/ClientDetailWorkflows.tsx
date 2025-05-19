
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AddWorkflowDialog } from "@/components/dialogs/AddWorkflowDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface Workflow {
  id: string;
  name: string;
  department: string;
  created_at: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved: string;
  moneySaved: string;
  status: string;
}

interface ClientDetailWorkflowsProps {
  clientId: string;
}

export function ClientDetailWorkflows({ clientId }: ClientDetailWorkflowsProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch this data from the database
    // For now, let's use mock data matching the image
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Lead Processing',
        department: 'Sales',
        created_at: '2025-01-15T12:00:00Z',
        nodes: 12,
        executions: 234,
        exceptions: 2,
        timeSaved: '30',
        moneySaved: '75',
        status: 'active'
      },
      {
        id: '2',
        name: 'Onboarding',
        department: 'HR',
        created_at: '2025-01-10T12:00:00Z',
        nodes: 8,
        executions: 45,
        exceptions: 0,
        timeSaved: '120',
        moneySaved: '180',
        status: 'active'
      }
    ];
    
    setWorkflows(mockWorkflows);
    setLoading(false);
  }, [clientId]);

  // Function to handle workflow added
  const handleWorkflowAdded = (workflow: any) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: workflow.name,
      department: workflow.department,
      created_at: new Date().toISOString(),
      nodes: 0,
      executions: 0,
      exceptions: 0,
      timeSaved: '0',
      moneySaved: '0',
      status: 'active'
    };
    
    setWorkflows([...workflows, newWorkflow]);
    toast({
      title: "Workflow Added",
      description: `${workflow.name} workflow has been added.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.toLocaleDateString('en-US', { day: 'numeric' })}, ${date.getFullYear()}`;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Workflows</h2>
        <AddWorkflowDialog buttonClassName="bg-black text-white" />
      </div>
      
      <div className="bg-white rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Create Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Workflow Name</TableHead>
              <TableHead># of Nodes</TableHead>
              <TableHead># of Executions</TableHead>
              <TableHead># of Exceptions</TableHead>
              <TableHead>Time Saved</TableHead>
              <TableHead>$ Saved</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => {
              const createDate = new Date(workflow.created_at);
              return (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{createDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="font-medium">{createDate.getDate()},</span>
                      <span className="font-medium">{createDate.getFullYear()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{workflow.department}</TableCell>
                  <TableCell className="font-medium text-blue-600">{workflow.name}</TableCell>
                  <TableCell>{workflow.nodes}</TableCell>
                  <TableCell className="text-blue-600">{workflow.executions}</TableCell>
                  <TableCell className="text-blue-600">{workflow.exceptions}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{workflow.timeSaved}</span>
                      <span className="text-xs text-gray-500 ml-1">min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{workflow.moneySaved}</span>
                      <span className="text-xs text-gray-500 ml-1">USD</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-black"></div>
                      <Button variant="link" className="p-0 h-auto text-blue-500">
                        ROI Report
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

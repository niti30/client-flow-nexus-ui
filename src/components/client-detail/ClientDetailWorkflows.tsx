
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AddWorkflowDialog } from "@/components/dialogs/AddWorkflowDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Workflow } from "@/types/workflow";
import WorkflowStatusToggle from '@/components/workflows/WorkflowStatusToggle';

interface ClientDetailWorkflowsProps {
  clientId: string;
}

export function ClientDetailWorkflows({ clientId }: ClientDetailWorkflowsProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
  const handleWorkflowAdded = (workflow?: Workflow) => {
    if (workflow) {
      // Add the new workflow to the beginning of the array
      setWorkflows(prevWorkflows => [workflow, ...prevWorkflows]);
      
      toast({
        title: "Workflow Added",
        description: `${workflow.name} workflow has been added.`,
      });
    }
  };

  // Handle ROI Report download
  const handleRoiReportClick = () => {
    // In a real app, this would generate and download a report
    // For now we'll simulate a file download
    const dummyLink = document.createElement('a');
    dummyLink.href = 'data:text/plain;charset=utf-8,ROI Report Data';
    dummyLink.download = 'ROI_Report.csv';
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        day: date.getDate(),
        year: date.getFullYear()
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { month: 'Jan', day: 1, year: 2025 };
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Workflows</h2>
        <AddWorkflowDialog 
          className="bg-black text-white" 
          onWorkflowAdded={handleWorkflowAdded}
          clientId={clientId}
        />
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">Loading workflows...</TableCell>
              </TableRow>
            ) : workflows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">No workflows found. Click "Add Workflow" to create one.</TableCell>
              </TableRow>
            ) : (
              workflows.map((workflow) => {
                const createDate = formatDate(workflow.created_at);
                return (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{createDate.month}</span>
                        <span className="font-medium">{createDate.day},</span>
                        <span className="font-medium">{createDate.year}</span>
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
                        <WorkflowStatusToggle 
                          workflowId={workflow.id} 
                          initialStatus={workflow.status} 
                        />
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-blue-500"
                          onClick={handleRoiReportClick}
                        >
                          ROI Report
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

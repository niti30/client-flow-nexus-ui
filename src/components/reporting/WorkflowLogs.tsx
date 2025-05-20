
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";

interface WorkflowLog {
  timestamp: string;
  workflow: string;
  executionDetails: string;
  status: string;
}

interface WorkflowLogsProps {
  logs: WorkflowLog[];
  selectedWorkflow: string;
  onWorkflowChange: (workflow: string) => void;
  onExportLogs: () => void;
}

const WorkflowLogs = ({ logs, selectedWorkflow, onWorkflowChange, onExportLogs }: WorkflowLogsProps) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSingleLogDownload = (log: WorkflowLog) => {
    // Create text content
    const content = `
Timestamp: ${log.timestamp}
Workflow: ${log.workflow}
Status: ${log.status}
Execution Details: ${log.executionDetails}
    `.trim();
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `log-${log.workflow.replace(/\s+/g, '-').toLowerCase()}-${new Date(log.timestamp).toISOString().slice(0, 10)}.txt`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Workflow Execution Logs</h2>
        
        <div className="flex items-center justify-between">
          <Select
            value={selectedWorkflow}
            onValueChange={onWorkflowChange}
          >
            <SelectTrigger className="w-[280px] bg-white border border-gray-200">
              <SelectValue placeholder="Select Workflow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Invoice Processing Workflow">Invoice Processing Workflow</SelectItem>
              <SelectItem value="Employee Onboarding">Employee Onboarding</SelectItem>
              <SelectItem value="Contract Review">Contract Review</SelectItem>
              <SelectItem value="Expense Approval">Expense Approval</SelectItem>
              <SelectItem value="All Workflows">All Workflows</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="default" 
            className="bg-black text-white hover:bg-gray-800"
            onClick={onExportLogs}
          >
            <Download className="mr-2 h-5 w-5" />
            Export Logs
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-700 font-medium text-base">Timestamp</TableHead>
              <TableHead className="text-gray-700 font-medium text-base">Workflow</TableHead>
              <TableHead className="text-gray-700 font-medium text-base">Execution Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={index} className="border-b border-gray-200">
                  <TableCell className="whitespace-nowrap text-gray-800 font-medium">{log.timestamp}</TableCell>
                  <TableCell className="text-gray-800">{log.workflow}</TableCell>
                  <TableCell className="text-gray-800">{log.executionDetails}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkflowLogs;

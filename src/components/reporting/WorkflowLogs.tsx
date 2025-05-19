
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
        return 'bg-green-800 text-white';
      case 'failed':
        return 'bg-red-800 text-white';
      case 'in_progress':
        return 'bg-yellow-800 text-white';
      default:
        return 'bg-gray-700 text-white';
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

  // Get unique workflow names for the filter dropdown
  const workflowNames = ['All Workflows', ...Array.from(new Set(logs.map(log => log.workflow)))];

  return (
    <div className="bg-[#1A1F2C] rounded-md border border-gray-700 overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Workflow Execution Logs</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              value={selectedWorkflow}
              onValueChange={onWorkflowChange}
            >
              <SelectTrigger className="w-full bg-[#1A1F2C] border-gray-700 text-white">
                <SelectValue placeholder="Select Workflow" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2C] border-gray-700 text-white">
                {workflowNames.map(workflow => (
                  <SelectItem key={workflow} value={workflow}>{workflow}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full sm:w-auto border-gray-700 text-white hover:bg-gray-700" onClick={onExportLogs}>
            <Download size={16} className="mr-2" />
            Export Logs
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              <TableHead className="text-gray-300 font-medium text-xs uppercase">Timestamp</TableHead>
              <TableHead className="text-gray-300 font-medium text-xs uppercase">Workflow</TableHead>
              <TableHead className="text-gray-300 font-medium text-xs uppercase">Status</TableHead>
              <TableHead className="text-gray-300 font-medium text-xs uppercase">Execution Details</TableHead>
              <TableHead className="text-gray-300 font-medium text-xs uppercase text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-300">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={index} className="border-b border-gray-700">
                  <TableCell className="whitespace-nowrap text-gray-300">{log.timestamp}</TableCell>
                  <TableCell className="text-gray-300">{log.workflow}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(log.status)}`}>
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md text-gray-300">{log.executionDetails}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => handleSingleLogDownload(log)}
                    >
                      <FileDown size={16} />
                    </Button>
                  </TableCell>
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

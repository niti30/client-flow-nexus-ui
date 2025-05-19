
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
}

const WorkflowLogs = ({ logs, selectedWorkflow, onWorkflowChange }: WorkflowLogsProps) => {
  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b">
        <h2 className="text-lg font-semibold">Workflow Execution Logs</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              value={selectedWorkflow}
              onValueChange={onWorkflowChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Invoice Processing Workflow">Invoice Processing Workflow</SelectItem>
                <SelectItem value="Data Import">Data Import</SelectItem>
                <SelectItem value="Client Onboarding">Client Onboarding</SelectItem>
                <SelectItem value="API Integration">API Integration</SelectItem>
                <SelectItem value="Payment Processing">Payment Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download size={16} className="mr-2" />
            Export Logs
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Execution Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell>{log.workflow}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${log.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        log.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md">{log.executionDetails}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
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

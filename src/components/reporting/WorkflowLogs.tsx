
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkflowLog {
  timestamp: string;
  workflow: string;
  executionDetails: string;
}

interface WorkflowLogsProps {
  logs: WorkflowLog[];
  selectedWorkflow: string;
  onWorkflowChange: (workflow: string) => void;
}

const WorkflowLogs = ({ logs, selectedWorkflow, onWorkflowChange }: WorkflowLogsProps) => {
  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold">Workflow Execution Logs</h2>
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
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Execution Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.workflow}</TableCell>
                  <TableCell>{log.executionDetails}</TableCell>
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


export interface WorkflowROI {
  id: string;
  created_at: string;
  department: string;
  workflow_name: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  time_saved: number;
  cost_saved: number;
  status: boolean;
}


export interface Workflow {
  id: string;
  name: string;
  department?: string;
  description?: string;
  created_at: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved?: string;
  moneySaved?: string;
  status: string;
  progress?: number;
  client_id?: string;
  time_saved?: number;
  cost_saved?: number;
  completed_at?: string;
}

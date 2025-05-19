
import { useState, useEffect } from 'react';

export interface WorkflowLog {
  timestamp: string;
  workflow: string;
  executionDetails: string;
}

export const useWorkflowLogs = (workflowFilter: string = '') => {
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [loading, setLoading] = useState(true);

  const mockLogs: WorkflowLog[] = [
    {
      timestamp: '2025-05-14 02:15:47',
      workflow: 'Invoice Processing',
      executionDetails: 'Successfully processed invoice #INV-2025-001'
    },
    {
      timestamp: '2025-05-14 02:14:32',
      workflow: 'Invoice Processing',
      executionDetails: 'Data extraction completed for invoice #INV-2025-002'
    },
    {
      timestamp: '2025-05-14 02:13:15',
      workflow: 'Invoice Processing',
      executionDetails: 'Started processing invoice batch #BATCH-051'
    },
    {
      timestamp: '2025-05-14 02:12:03',
      workflow: 'Invoice Processing',
      executionDetails: 'Validation checks passed for invoice #INV-2025-003'
    },
    {
      timestamp: '2025-05-14 02:10:47',
      workflow: 'Invoice Processing',
      executionDetails: 'New invoice detected in input folder'
    }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter logs if workflowFilter is provided
        const filteredLogs = workflowFilter
          ? mockLogs.filter(log => log.workflow.includes(workflowFilter))
          : mockLogs;
        
        setLogs(filteredLogs);
      } catch (error) {
        console.error('Error fetching workflow logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [workflowFilter]);

  return { logs, loading };
};

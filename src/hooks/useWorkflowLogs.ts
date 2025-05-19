
import { useState, useEffect } from 'react';

interface WorkflowLog {
  id: string;
  timestamp: string;
  workflow: string;
  executionDetails: string;
  status: string; // 'completed', 'failed', 'in_progress'
}

export const useWorkflowLogs = () => {
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock logs data
  const mockLogs = [
    {
      id: "1",
      timestamp: "2025-05-19 09:23:45",
      workflow: "Invoice Processing Workflow",
      executionDetails: "Successfully processed invoice #INV-2025-0542, total amount: $4,523.75",
      status: "completed"
    },
    {
      id: "2",
      timestamp: "2025-05-19 08:15:30",
      workflow: "Invoice Processing Workflow",
      executionDetails: "Failed to extract data from invoice #INV-2025-0541, error: unrecognized format",
      status: "failed"
    },
    {
      id: "3",
      timestamp: "2025-05-18 16:45:12",
      workflow: "Data Import",
      executionDetails: "Imported 128 records from CRM system, 3 duplicates detected and skipped",
      status: "completed"
    },
    {
      id: "4",
      timestamp: "2025-05-18 14:30:22",
      workflow: "Client Onboarding",
      executionDetails: "New client Stark Industries onboarded successfully, account ID: ACC-2025-0089",
      status: "completed"
    },
    {
      id: "5",
      timestamp: "2025-05-18 11:05:18",
      workflow: "API Integration",
      executionDetails: "Connection timeout when calling external payment API, retry scheduled",
      status: "failed"
    },
    {
      id: "6",
      timestamp: "2025-05-17 15:22:09",
      workflow: "Invoice Processing Workflow",
      executionDetails: "Processed invoice batch #BATCH-2025-053, 42 invoices processed successfully",
      status: "completed"
    },
    {
      id: "7",
      timestamp: "2025-05-17 09:48:33",
      workflow: "Payment Processing",
      executionDetails: "Processing payment for invoice #INV-2025-0535, amount: $12,450.00",
      status: "in_progress"
    }
  ];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, we would fetch from an API or database
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching workflow logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, fetchLogs };
};


import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface WorkflowLog {
  id: string;
  timestamp: string;
  workflow: string;
  status: string;
  executionDetails: string;
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
      status: "completed",
      executionDetails: "Successfully processed invoice #INV-2025-0542, total amount: $4,523.75"
    },
    {
      id: "2",
      timestamp: "2025-05-19 08:15:30",
      workflow: "Invoice Processing Workflow",
      status: "failed",
      executionDetails: "Failed to extract data from invoice #INV-2025-0541, error: unrecognized format"
    },
    {
      id: "3",
      timestamp: "2025-05-18 16:45:12",
      workflow: "Data Import",
      status: "completed",
      executionDetails: "Imported 128 records from CRM system, 3 duplicates detected and skipped"
    },
    {
      id: "4",
      timestamp: "2025-05-18 14:30:22",
      workflow: "Client Onboarding",
      status: "completed",
      executionDetails: "New client Stark Industries onboarded successfully, account ID: ACC-2025-0089"
    },
    {
      id: "5",
      timestamp: "2025-05-18 11:05:18",
      workflow: "API Integration",
      status: "failed",
      executionDetails: "Connection timeout when calling external payment API, retry scheduled"
    },
    {
      id: "6",
      timestamp: "2025-05-17 15:22:56",
      workflow: "Document Processing",
      status: "completed",
      executionDetails: "Processed 5 documents, extracted 128 data points with 99.2% confidence"
    },
    {
      id: "7",
      timestamp: "2025-05-17 09:15:04",
      workflow: "Payment Processing",
      status: "completed",
      executionDetails: "Processed batch payment #BATCH-2025-032, 15 transactions, total: $12,450.00"
    },
    {
      id: "8",
      timestamp: "2025-05-16 17:40:33",
      workflow: "Email Notification",
      status: "completed",
      executionDetails: "Sent 124 notification emails, delivery rate: 99.2%"
    },
    {
      id: "9",
      timestamp: "2025-05-16 14:05:29",
      workflow: "Data Sync",
      status: "warning",
      executionDetails: "Synchronized 1,452 records, 8 records had validation warnings"
    },
    {
      id: "10",
      timestamp: "2025-05-16 10:20:17",
      workflow: "Report Generation",
      status: "completed",
      executionDetails: "Generated monthly activity report, 25 pages, sent to 8 recipients"
    }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('workflow_logs')
        //   .select('*')
        //   .order('timestamp', { ascending: false });
        
        // if (error) {
        //   console.error('Error fetching workflow logs:', error);
        // } else {
        //   setLogs(data || []);
        // }
        
        // Using mock data for now
        setLogs(mockLogs);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, loading };
};

export default useWorkflowLogs;

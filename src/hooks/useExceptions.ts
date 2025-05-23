
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface Exception {
  id: string;
  description: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  clients?: {
    name: string;
  };
  workflows?: {
    name: string;
  };
  // Adding the missing properties
  department?: string;
  exception_type?: string;
  severity?: string;
  remedy?: string;
  notifications?: string;
}

export const useExceptions = () => {
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock exceptions data
  const mockExceptions = [
    {
      id: "1",
      description: "Invoice validation failed: Missing document number",
      status: "open",
      created_at: "2025-05-10T12:00:00Z",
      resolved_at: null,
      clients: { name: "Acme Corp" },
      workflows: { name: "Invoice Processing" },
      department: "Finance",
      exception_type: "Data process",
      severity: "Critical",
      remedy: "API timeout",
      notifications: "+2 more"
    },
    {
      id: "2",
      description: "Data extraction error: Unrecognized document format",
      status: "new",
      created_at: "2025-05-11T09:30:00Z",
      resolved_at: null,
      clients: { name: "Globex Inc" },
      workflows: { name: "Data Import" },
      department: "Operations",
      exception_type: "Integration",
      severity: "High",
      remedy: "Format conversion",
      notifications: "+3 more"
    },
    {
      id: "3",
      description: "API connection timeout: Third-party service unavailable",
      status: "resolved",
      created_at: "2025-05-09T15:45:00Z",
      resolved_at: "2025-05-10T10:15:00Z",
      clients: { name: "Initech" },
      workflows: { name: "API Integration" },
      department: "IT",
      exception_type: "Integration",
      severity: "Medium",
      remedy: "Retry connection",
      notifications: "+1 more"
    },
    {
      id: "4",
      description: "Missing customer information: Contact details incomplete",
      status: "open",
      created_at: "2025-05-12T14:20:00Z",
      resolved_at: null,
      clients: { name: "Stark Industries" },
      workflows: { name: "Client Onboarding" },
      department: "Customer Success",
      exception_type: "Data process",
      severity: "Low",
      remedy: "Manual data entry",
      notifications: "+2 more"
    },
    {
      id: "5",
      description: "Payment processing failed: Invalid card information",
      status: "new",
      created_at: "2025-05-11T11:10:00Z",
      resolved_at: null,
      clients: { name: "Wayne Enterprises" },
      workflows: { name: "Payment Processing" },
      department: "Finance",
      exception_type: "Workflow logic",
      severity: "High",
      remedy: "Contact customer",
      notifications: "+4 more"
    },
    {
      id: "6",
      description: "Document approval rejected: Missing signatures",
      status: "open",
      created_at: "2025-05-13T08:45:00Z",
      resolved_at: null,
      clients: { name: "LexCorp" },
      workflows: { name: "Document Approval" },
      department: "Legal",
      exception_type: "Workflow logic",
      severity: "Medium",
      remedy: "Request signatures",
      notifications: "+2 more"
    },
    {
      id: "7",
      description: "Workflow execution halted: Logic error in step #4",
      status: "new",
      created_at: "2025-05-12T16:30:00Z",
      resolved_at: null,
      clients: { name: "Oscorp" },
      workflows: { name: "Custom Process" },
      department: "Engineering",
      exception_type: "Workflow logic",
      severity: "Critical",
      remedy: "Debug logic",
      notifications: "+3 more"
    }
  ];

  // Added more mock data to match the design
  const additionalMockExceptions = [
    {
      id: "8", 
      description: "Document approval rejected: Missing signatures",
      status: "open",
      created_at: "2025-05-13T14:15:00Z",
      resolved_at: null,
      clients: { name: "LexCorp" },
      workflows: { name: "Document Approval" },
      department: "Legal",
      exception_type: "Workflow logic",
      severity: "Medium",
      remedy: "Request signatures",
      notifications: "+2 more"
    },
    {
      id: "9",
      description: "Workflow execution halted: Logic error in step #4",
      status: "new",
      created_at: "2025-05-12T22:00:00Z",
      resolved_at: null,
      clients: { name: "Oscorp" },
      workflows: { name: "Custom Process" },
      department: "Engineering",
      exception_type: "Workflow logic",
      severity: "Critical",
      remedy: "Debug logic",
      notifications: "+3 more"
    },
    {
      id: "10",
      description: "Missing customer information: Contact details incomplete",
      status: "open",
      created_at: "2025-05-12T19:50:00Z",
      resolved_at: null,
      clients: { name: "Stark Industries" },
      workflows: { name: "Client Onboarding" },
      department: "Customer Success",
      exception_type: "Data process",
      severity: "Low",
      remedy: "Manual data entry",
      notifications: "+2 more"
    },
    {
      id: "11",
      description: "Payment processing failed: Invalid card information",
      status: "new",
      created_at: "2025-05-11T16:40:00Z",
      resolved_at: null,
      clients: { name: "Wayne Enterprises" },
      workflows: { name: "Payment Processing" },
      department: "Finance",
      exception_type: "Workflow logic",
      severity: "High",
      remedy: "Contact customer",
      notifications: "+4 more"
    },
    {
      id: "12",
      description: "Data extraction error: Unrecognized document format",
      status: "new",
      created_at: "2025-05-11T15:00:00Z",
      resolved_at: null,
      clients: { name: "Globex Inc" },
      workflows: { name: "Data Import" },
      department: "Operations",
      exception_type: "Integration",
      severity: "High",
      remedy: "Format conversion",
      notifications: "+3 more"
    }
  ];

  const allMockExceptions = [...mockExceptions, ...additionalMockExceptions];

  const fetchExceptions = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('exceptions')
      //   .select(`
      //     *,
      //     clients(name),
      //     workflows(name)
      //   `);
      
      // if (error) {
      //   console.error('Error fetching exceptions:', error);
      // } else {
      //   setExceptions(data || []);
      // }
      
      // Filter exceptions if there's a search query
      const filteredExceptions = searchQuery
        ? allMockExceptions.filter(exception => 
            exception.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.clients?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.workflows?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.exception_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.severity?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allMockExceptions;
      
      setExceptions(filteredExceptions);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExceptions();
  }, [searchQuery]);

  const updateExceptionStatus = async (exceptionId: string, newStatus: string) => {
    try {
      // In a real implementation, we would update the exception status in Supabase
      // const { error } = await supabase
      //   .from('exceptions')
      //   .update({ status: newStatus })
      //   .eq('id', exceptionId);
      
      // if (error) {
      //   console.error('Error updating exception status:', error);
      //   return false;
      // }
      
      // Update the local state to reflect the change
      setExceptions(prev => 
        prev.map(exception => 
          exception.id === exceptionId 
            ? { ...exception, status: newStatus } 
            : exception
        )
      );
      
      return true;
    } catch (error) {
      console.error('Unexpected error updating exception status:', error);
      return false;
    }
  };

  return { 
    exceptions, 
    loading, 
    fetchExceptions, 
    setSearchQuery,
    updateExceptionStatus
  };
};

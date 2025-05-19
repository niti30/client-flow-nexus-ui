
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
      workflows: { name: "Invoice Processing" }
    },
    {
      id: "2",
      description: "Data extraction error: Unrecognized document format",
      status: "in_progress",
      created_at: "2025-05-11T09:30:00Z",
      resolved_at: null,
      clients: { name: "Globex Inc" },
      workflows: { name: "Data Import" }
    },
    {
      id: "3",
      description: "API connection timeout: Third-party service unavailable",
      status: "resolved",
      created_at: "2025-05-09T15:45:00Z",
      resolved_at: "2025-05-10T10:15:00Z",
      clients: { name: "Initech" },
      workflows: { name: "API Integration" }
    },
    {
      id: "4",
      description: "Missing customer information: Contact details incomplete",
      status: "open",
      created_at: "2025-05-12T14:20:00Z",
      resolved_at: null,
      clients: { name: "Stark Industries" },
      workflows: { name: "Client Onboarding" }
    },
    {
      id: "5",
      description: "Payment processing failed: Invalid card information",
      status: "in_progress",
      created_at: "2025-05-11T11:10:00Z",
      resolved_at: null,
      clients: { name: "Wayne Enterprises" },
      workflows: { name: "Payment Processing" }
    },
    {
      id: "6",
      description: "Document approval rejected: Missing signatures",
      status: "open",
      created_at: "2025-05-13T08:45:00Z",
      resolved_at: null,
      clients: { name: "LexCorp" },
      workflows: { name: "Document Approval" }
    },
    {
      id: "7",
      description: "Workflow execution halted: Logic error in step #4",
      status: "in_progress",
      created_at: "2025-05-12T16:30:00Z",
      resolved_at: null,
      clients: { name: "Oscorp" },
      workflows: { name: "Custom Process" }
    }
  ];

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
        ? mockExceptions.filter(exception => 
            exception.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.clients?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exception.workflows?.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : mockExceptions;
      
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

  return { 
    exceptions, 
    loading, 
    fetchExceptions, 
    setSearchQuery 
  };
};

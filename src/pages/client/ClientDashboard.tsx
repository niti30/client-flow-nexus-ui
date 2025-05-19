
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink, ChevronRight, Check, Circle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useQuery } from "@tanstack/react-query";

interface PipelineStep {
  name: string;
  status: "completed" | "in_progress" | "pending";
  date: string;
}

interface SupportEngineer {
  name: string;
  role: string;
  avatar: string;
}

interface ClientMetrics {
  timeSaved: { recent: string; total: string; period: string };
  moneySaved: { recent: string; total: string; period: string };
  activeWorkflows: number;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Fetch client data based on logged-in user
  const { data: clientData, isLoading: clientLoading } = useQuery({
    queryKey: ['client-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // First get the user information including client_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('client_id')
        .eq('id', user.id)
        .single();
        
      if (userError || !userData?.client_id) {
        console.error('Error fetching user client_id:', userError);
        return null;
      }
      
      // Then get the client information
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userData.client_id)
        .single();
        
      if (clientError) {
        console.error('Error fetching client info:', clientError);
        return null;
      }
      
      return clientData;
    },
    enabled: !!user
  });
  
  // Fetch workflows for the client
  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['client-workflows', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: userData } = await supabase
        .from('users')
        .select('client_id')
        .eq('id', user.id)
        .single();
        
      if (!userData?.client_id) return [];
      
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('client_id', userData.client_id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching workflows:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user
  });
  
  // Pipeline steps based on workflow data
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    { name: "Discovery: Initial Survey", status: "completed", date: "Jan 15, 2025" },
    { name: "Discovery: Process deep dive", status: "completed", date: "Jan 20, 2025" },
    { name: "ADA Proposal Sent", status: "completed", date: "Jan 25, 2025" },
    { name: "ADA Proposal Review", status: "in_progress", date: "" },
    { name: "ADA Contract Sent", status: "pending", date: "" },
    { name: "ADA Contract Signed", status: "pending", date: "" },
    { name: "Credentials collected", status: "pending", date: "" },
    { name: "Factory build initiated", status: "pending", date: "" },
  ]);
  
  // Support engineers for the client
  const [supportEngineers, setSupportEngineers] = useState<SupportEngineer[]>([
    { 
      name: "John Smith", 
      role: "Solutions Engineer", 
      avatar: "https://i.pravatar.cc/150?img=1" 
    },
    { 
      name: "Sarah Johnson", 
      role: "Support SE", 
      avatar: "https://i.pravatar.cc/150?img=5" 
    }
  ]);
  
  // Metrics
  const [metrics, setMetrics] = useState<ClientMetrics>({
    timeSaved: { recent: "24.5 hrs", total: "168.2 hrs", period: "Last 7 days" },
    moneySaved: { recent: "$2,450", total: "$16,820", period: "Last 7 days" },
    activeWorkflows: 0
  });

  useEffect(() => {
    // Update metrics when workflows data is available
    if (workflows) {
      const activeCount = workflows.filter(w => w.status !== 'completed').length;
      setMetrics(prev => ({
        ...prev,
        activeWorkflows: activeCount
      }));
    }
  }, [workflows]);

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{clientData?.name || "Client Dashboard"}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Pipeline Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Pipeline Progress</h2>
              <ul className="space-y-6">
                {pipelineSteps.slice(0, 8).map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="mr-4 mt-1">
                      {step.status === "completed" && (
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {step.status === "in_progress" && (
                        <div className="h-6 w-6 rounded-full border-2 border-blue-500 bg-blue-100"></div>
                      )}
                      {step.status === "pending" && (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className={`font-medium ${step.status === "completed" ? "text-gray-700" : step.status === "in_progress" ? "text-black" : "text-gray-500"}`}>
                          {step.name}
                        </h4>
                        {step.date && <span className="text-sm text-gray-500">{step.date}</span>}
                      </div>
                      {step.status === "in_progress" && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">In Progress</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Time and Money Metrics */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between mb-1">
                  <h3 className="text-gray-500">Time Saved</h3>
                  <span className="text-gray-500 text-sm">{metrics.timeSaved.period}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-bold">{metrics.timeSaved.recent}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{metrics.timeSaved.total}</span>
                    <div className="text-sm text-gray-500">All time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between mb-1">
                  <h3 className="text-gray-500">Money Saved</h3>
                  <span className="text-gray-500 text-sm">{metrics.moneySaved.period}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-bold">{metrics.moneySaved.recent}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{metrics.moneySaved.total}</span>
                    <div className="text-sm text-gray-500">All time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-2">
                  <h3 className="text-gray-500">Active Workflows</h3>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-bold">{metrics.activeWorkflows}</span>
                  <Link to="/client/roi" className="text-blue-500 hover:underline text-sm flex items-center">
                    View workflows <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Support Engineer */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img src={supportEngineers[0].avatar} alt={supportEngineers[0].name} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{supportEngineers[0].name}</h3>
                  <p className="text-gray-500">{supportEngineers[0].role}</p>
                </div>
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-md py-2 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message SE
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;

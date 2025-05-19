
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink, ChevronRight } from "lucide-react";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [clientData, setClientData] = useState<any>(null);
  const [supportEngineers, setSupportEngineers] = useState([
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
  const [clientUsers, setClientUsers] = useState([
    { 
      name: "Robert Wilson", 
      email: "robert@company.com", 
      phone: "+1 555-0123", 
      hasBilling: true, 
      isAdmin: true, 
      notes: "Primary contact" 
    },
    { 
      name: "Emily Brown", 
      email: "emily@company.com", 
      phone: "+1 555-0124", 
      hasBilling: false, 
      isAdmin: false, 
      notes: "Technical lead" 
    }
  ]);
  const [documents, setDocuments] = useState([
    { title: "Survey Questions", url: "https://docs.example.com/survey" },
    { title: "Survey Results", url: "https://docs.example.com/results" },
    { title: "Process Documentation", url: "https://docs.example.com/process" },
    { title: "ADA Proposal", url: "https://docs.example.com/proposal" },
    { title: "Contract", url: "https://docs.example.com/contract" },
    { title: "Factory Markdown", url: "https://docs.example.com/factory-markdown" },
    { title: "Test Plan", url: "https://docs.example.com/test-plan" }
  ]);
  const [pipelineSteps, setPipelineSteps] = useState([
    { name: "Discovery: Initial Survey", status: "completed", date: "Jan 15, 2025" },
    { name: "Discovery: Process Deep Dive", status: "completed", date: "Jan 20, 2025" },
    { name: "ADA Proposal Sent", status: "completed", date: "Jan 25, 2025" },
    { name: "ADA Proposal Review", status: "current", date: "" },
    { name: "ADA Contract Sent", status: "pending", date: "" },
    { name: "ADA Contract Signed", status: "pending", date: "" },
    { name: "Credentials Collected", status: "pending", date: "" },
    { name: "Factory Build Initiated", status: "pending", date: "" },
    { name: "Test Plan Generated", status: "pending", date: "" },
    { name: "Testing Started", status: "pending", date: "" },
    { name: "Production Deploy", status: "pending", date: "" }
  ]);
  const [metrics, setMetrics] = useState({
    timeSaved: { recent: "24.5 hrs", total: "168.2 hrs", period: "Last 7 days" },
    moneySaved: { recent: "$2,450", total: "$16,820", period: "Last 7 days" },
    activeWorkflows: 12
  });

  useEffect(() => {
    // In a real application, you would fetch the client information
    // based on the authenticated user's client_id
    const fetchClientInfo = async () => {
      if (user) {
        try {
          // First get the user information including client_id
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('client_id')
            .eq('id', user.id)
            .single();

          if (userError || !userData?.client_id) {
            console.error('Error fetching user client_id:', userError);
            return;
          }

          // Then get the client information
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', userData.client_id)
            .single();

          if (clientError) {
            console.error('Error fetching client info:', clientError);
            return;
          }

          setClientData(clientData);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchClientInfo();
  }, [user]);

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Acme Corporation</h1>
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
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pipeline Progress</h2>
              <ul className="space-y-6">
                {pipelineSteps.slice(0, 6).map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="mr-4 mt-1">
                      {step.status === "completed" && (
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {step.status === "current" && (
                        <div className="h-6 w-6 rounded-full border-2 border-blue-500 bg-blue-100"></div>
                      )}
                      {step.status === "pending" && (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className={`font-medium ${step.status === "completed" ? "text-gray-700" : step.status === "current" ? "text-black" : "text-gray-500"}`}>
                          {step.name}
                        </h4>
                        {step.date && <span className="text-sm text-gray-500">{step.date}</span>}
                      </div>
                      {step.status === "current" && (
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
              <div className="bg-white p-6 rounded-lg shadow">
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
              
              <div className="bg-white p-6 rounded-lg shadow">
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
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-2">
                  <h3 className="text-gray-500">Active Workflows</h3>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-bold">{metrics.activeWorkflows}</span>
                  <a href="#" className="text-blue-500 hover:underline text-sm flex items-center">
                    View workflows <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Support Engineer */}
            <div className="bg-white p-6 rounded-lg shadow">
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

          {/* Document Links */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Document Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, idx) => (
                <a 
                  key={idx} 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-gray-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{doc.title}</h4>
                    </div>
                    <div className="text-gray-400">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;

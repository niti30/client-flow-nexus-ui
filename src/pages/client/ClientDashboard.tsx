
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [clientData, setClientData] = useState<any>(null);
  const [supportEngineers, setSupportEngineers] = useState([
    { name: "John Smith", role: "Lead SE", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Sarah Johnson", role: "Support SE", avatar: "https://i.pravatar.cc/150?img=5" }
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
          <h1 className="text-xl font-semibold">Client Manager</h1>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Assigned Support Engineers</h2>
            <div className="flex space-x-4">
              {supportEngineers.map((engineer, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img src={engineer.avatar} alt={engineer.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{engineer.name}</p>
                    <p className="text-sm text-gray-500">{engineer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clientUsers.map((user, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-4 whitespace-nowrap font-medium">{user.name}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{user.phone}</td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              {user.hasBilling ? (
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="inline-block w-5 h-0.5 bg-gray-300"></span>
                              )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              {user.isAdmin ? (
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="inline-block w-5 h-0.5 bg-gray-300"></span>
                              )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">{user.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Document Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {documents.map((doc, idx) => (
                      <li key={idx}>
                        <h4 className="text-sm text-gray-500 mb-1">{doc.title}</h4>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {doc.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Pipeline Progress</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <ul className="space-y-6">
                {pipelineSteps.map((step, idx) => (
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
                        <div className="h-6 w-6 rounded-full border-2 border-black"></div>
                      )}
                      {step.status === "pending" && (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{step.name}</h4>
                        {step.date && <span className="text-sm text-gray-500">{step.date}</span>}
                      </div>
                      {step.status === "current" && (
                        <div className="mt-2">
                          <button className="bg-black text-white px-4 py-2 rounded-md text-sm">
                            Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;

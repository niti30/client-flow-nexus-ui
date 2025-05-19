
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Workflow, FileText, CreditCard, Mail, Phone, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchClient() {
      try {
        setLoading(true);
        if (!id) return;

        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching client:', error);
        } else {
          setClient(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p>Loading client details...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p>Client not found.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                  {client.logo_url ? (
                    <img 
                      src={client.logo_url} 
                      alt={client.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 font-medium">
                      {client.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={client.status === "active" ? "success" : "destructive"}>
                      {client.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-gray-500">{client.industry}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="w-full max-w-md mb-6">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="workflows" className="flex-1">Workflows</TabsTrigger>
                <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
                <TabsTrigger value="billing" className="flex-1">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Account Manager</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                          <img 
                            src="https://ui-avatars.com/api/?name=Sarah+Lee&background=7D3C98&color=fff" 
                            alt="Sarah Lee" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-medium">Sarah Lee</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <a href="mailto:sarah@example.com" className="flex items-center gap-1 hover:text-blue-600">
                              <Mail className="h-3 w-3" />
                              <span>Email</span>
                            </a>
                            <a href="tel:+1234567890" className="flex items-center gap-1 hover:text-blue-600">
                              <Phone className="h-3 w-3" />
                              <span>Call</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="h-full w-0.5 bg-gray-200 absolute top-5"></div>
                          </div>
                          <div>
                            <p className="font-medium">Onboarding</p>
                            <p className="text-sm text-gray-500">Completed on {new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="h-full w-0.5 bg-gray-200 absolute top-5"></div>
                          </div>
                          <div>
                            <p className="font-medium">Requirement Analysis</p>
                            <p className="text-sm text-gray-500">Completed on {new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">Implementation</p>
                            <p className="text-sm text-gray-500">In progress</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upload Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">FTP Credentials</label>
                          <Input value="ftp://example.com/client" readOnly />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">API Key</label>
                          <Input value="sk_test_12345abcdef" readOnly />
                        </div>
                        <Button variant="outline" className="w-full">Reset Credentials</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="workflows">
                <div className="bg-white rounded-md border overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-lg font-semibold">Active Workflows</h2>
                      <Button className="mt-2 sm:mt-0">
                        <Plus size={16} className="mr-2" />
                        Add Workflow
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-center text-gray-500">Workflow data will be loaded here.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="bg-white rounded-md border overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-lg font-semibold">User Management</h2>
                      <Button className="mt-2 sm:mt-0">
                        <Plus size={16} className="mr-2" />
                        Add User
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-center text-gray-500">User data will be loaded here.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="billing">
                <div className="bg-white rounded-md border overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Billing Information</h2>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-center text-gray-500">Billing data will be loaded here.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDetail;

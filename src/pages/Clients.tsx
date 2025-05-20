
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ClientsTable from "@/components/dashboard/ClientsTable";
import ClientsTableEnhanced from "@/components/dashboard/ClientsTableEnhanced";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddClientDialog } from "@/components/dialogs/AddClientDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientSupportEngineers } from "@/components/client-detail/ClientSupportEngineers";
import { ClientUsersList } from "@/components/client-detail/ClientUsersList";
import { ClientDocumentLinks } from "@/components/client-detail/ClientDocumentLinks";
import { ClientPipelineProgress } from "@/components/client-detail/ClientPipelineProgress";
import { ClientDetailWorkflows } from "@/components/client-detail/ClientDetailWorkflows";
import { useIsMobile } from "@/hooks/use-mobile";

const Clients = () => {
  const {
    userRole
  } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const isMobile = useIsMobile();

  // Redirect client users to client dashboard
  useEffect(() => {
    if (userRole === 'client') {
      window.location.href = '/client/dashboard';
    }
  }, [userRole]);

  // Function to trigger a refresh of the clients list
  const handleClientAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return <div className="flex h-screen bg-[#f5f5f7]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" onValueChange={value => setActiveTab(value)}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <h1 className="text-2xl font-semibold">Clients</h1>
              
              {activeTab === "overview" && <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input placeholder="Search clients..." className="pl-9 w-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <AddClientDialog buttonClassName="bg-black hover:bg-gray-800 whitespace-nowrap" onClientAdded={handleClientAdded} />
                </div>}
            </div>
            
            <TabsList className="mb-6 border-b w-64">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none">Overview</TabsTrigger>
              <TabsTrigger value="workflows" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none">Client Workflows</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Support Engineers Section - Show this first regardless of screen size */}
              <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">Assigned Support Engineers</h2>
                <ClientSupportEngineers clientId="demo" />
              </section>
              
              {/* Client Users and Document Links */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Client Users</CardTitle>
                      <Button onClick={() => setShowUserDialog(true)}>
                        <Plus size={16} className="mr-2" />
                        Add User
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ClientUsersList clientId="demo" showDialog={showUserDialog} onDialogClose={() => setShowUserDialog(false)} />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Document Links</CardTitle>
                      <Button onClick={() => setShowDocumentDialog(true)}>
                        <Plus size={16} className="mr-2" />
                        Add Document
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ClientDocumentLinks clientId="demo" showDialog={showDocumentDialog} onDialogClose={() => setShowDocumentDialog(false)} />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Pipeline Progress Section */}
              <section>
                <h2 className="text-xl font-medium mb-4">Pipeline Progress</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ClientPipelineProgress clientId="demo" />
                  </CardContent>
                </Card>
              </section>
              
              {/* Table hidden by default - only show when requested through a toggle or similar */}
              <div className="hidden">
                <ClientsTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
              </div>
            </TabsContent>
            
            <TabsContent value="workflows">
              <ClientDetailWorkflows clientId="demo" />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>;
};
export default Clients;

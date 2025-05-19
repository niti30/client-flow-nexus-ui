
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ClientsTable from "@/components/dashboard/ClientsTable";
import ClientsTableEnhanced from "@/components/dashboard/ClientsTableEnhanced";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for the enhanced view (client workflows)
  const clientWorkflows = [
    {
      name: "Lead Processing",
      contractStart: "Jan 15, 2025",
      workflows: 12,
      nodes: 12,
      executions: 234,
      exceptions: 2,
      revenue: "75 USD",
      timeSaved: "30 min",
      moneySaved: "—"
    },
    {
      name: "Onboarding",
      contractStart: "Jan 10, 2025",
      workflows: 8,
      nodes: 8,
      executions: 45,
      exceptions: 0,
      revenue: "180 USD",
      timeSaved: "120 min",
      moneySaved: "—"
    }
  ];

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" onValueChange={(value) => setActiveTab(value)}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Clients</h1>
              
              {activeTab === "overview" && (
                <div className="flex items-center gap-4">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                      placeholder="Search clients..." 
                      className="pl-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-[#141417] hover:bg-black">
                    <Plus size={16} className="mr-2" />
                    Add Client
                  </Button>
                </div>
              )}
              
              {activeTab === "workflows" && (
                <Button className="bg-[#141417] hover:bg-black">
                  <Plus size={16} className="mr-2" />
                  Add Workflow
                </Button>
              )}
            </div>
            
            <TabsList className="mb-6 border-b w-64">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none">Overview</TabsTrigger>
              <TabsTrigger value="workflows" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none">Client Workflows</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ClientsTable searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="workflows">
              <ClientsTableEnhanced clients={clientWorkflows} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Clients;

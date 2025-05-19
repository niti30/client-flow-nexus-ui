
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MetricsCard from "@/components/dashboard/MetricsCard";
import ClientsTableEnhanced from "@/components/dashboard/ClientsTableEnhanced";

const Index = () => {
  const [activeTab, setActiveTab] = useState("7d");
  
  // Mock data for clients
  const clients = [
    {
      name: "Acme Corp",
      contractStart: "Jan 15, 2025",
      workflows: 24,
      nodes: 156,
      executions: 1847,
      exceptions: 12,
      revenue: "$24,500",
      timeSaved: "284h",
      moneySaved: "$42,600"
    },
    {
      name: "Globex Inc",
      contractStart: "Feb 10, 2025",
      workflows: 18,
      nodes: 92,
      executions: 1232,
      exceptions: 5,
      revenue: "$18,750",
      timeSaved: "196h",
      moneySaved: "$29,400"
    },
    {
      name: "Initech",
      contractStart: "Mar 5, 2025",
      workflows: 12,
      nodes: 78,
      executions: 924,
      exceptions: 8,
      revenue: "$15,200",
      timeSaved: "152h",
      moneySaved: "$22,800"
    }
  ];
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-[260px]">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Tabs defaultValue="7d" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-6 max-w-md">
                    <TabsTrigger value="7d">Last 7 days</TabsTrigger>
                    <TabsTrigger value="30d">Last 30 days</TabsTrigger>
                    <TabsTrigger value="mtd">MTD</TabsTrigger>
                    <TabsTrigger value="qtd">QTD</TabsTrigger>
                    <TabsTrigger value="ytd">YTD</TabsTrigger>
                    <TabsTrigger value="itd">ITD</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Dashboard Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <MetricsCard 
                  title="Total Workflows" 
                  value="2,847" 
                  trend={{ value: 12, positive: true }}
                />
                <MetricsCard 
                  title="Total Exceptions" 
                  value="156" 
                  trend={{ value: 8, positive: false }}
                />
                <MetricsCard 
                  title="Time Saved" 
                  value="1,284h" 
                  trend={{ value: 24, positive: true }}
                />
                <MetricsCard 
                  title="Revenue" 
                  value="$847K" 
                  trend={{ value: 16, positive: true }}
                />
                <MetricsCard 
                  title="Active Clients" 
                  value="128" 
                  trend={{ value: 5, positive: true }}
                />
              </div>
              
              {/* Clients Section */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">All Clients</h2>
                  
                  <Button className="w-full sm:w-auto">
                    <Plus size={16} className="mr-2" />
                    Add Client
                  </Button>
                </div>
                
                {/* Clients Table */}
                <div className="bg-white rounded-md border shadow-sm overflow-hidden">
                  <ClientsTableEnhanced clients={clients} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

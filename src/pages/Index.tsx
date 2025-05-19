
import { useState } from 'react';
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Time period filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              <div className="flex space-x-1 bg-white rounded-md shadow-sm border p-1">
                <button 
                  onClick={() => handleTabChange("7d")} 
                  className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "7d" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  Last 7 days
                </button>
                <button 
                  onClick={() => handleTabChange("30d")} 
                  className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "30d" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  Last 30 days
                </button>
                <button 
                  onClick={() => handleTabChange("mtd")} 
                  className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "mtd" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  MTD
                </button>
                <button 
                  onClick={() => handleTabChange("qtd")} 
                  className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "qtd" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  QTD
                </button>
                <button 
                  onClick={() => handleTabChange("ytd")} 
                  className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "ytd" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  YTD
                </button>
                <button 
                  onClick={() => handleTabChange("itd")} 
                  className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "itd" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  ITD
                </button>
              </div>
            </div>
            
            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
            <div className="mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">All Clients</h2>
                
                <Button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white">
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
        </main>
      </div>
    </div>
  );
};

export default Index;

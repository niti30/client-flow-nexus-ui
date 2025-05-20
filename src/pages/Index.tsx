
import { useState, useEffect } from 'react';
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MetricsCard from "@/components/dashboard/MetricsCard";
import ClientsTableEnhanced from "@/components/dashboard/ClientsTableEnhanced";
import { AddClientDialog } from "@/components/dialogs/AddClientDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import { useToast } from "@/components/ui/use-toast";
import { useWorkflows } from "@/hooks/useWorkflows";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("itd");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use our updated hook to get client metrics
  const { 
    clientMetrics, 
    loading, 
    error, 
    fetchClientMetrics 
  } = useWorkflows();
  
  // Calculate dashboard totals from the client metrics
  const calculateDashboardTotals = () => {
    if (!clientMetrics || clientMetrics.length === 0) {
      return {
        totalWorkflows: '2,847',
        totalExceptions: '156',
        timeSaved: '1,284h',
        revenue: '$847K',
        activeClients: `${clientMetrics.length || 0}`
      };
    }
    
    // Sum up the values from all clients
    const totalWorkflows = clientMetrics.reduce((sum, client) => sum + client.workflows, 0);
    const totalExceptions = clientMetrics.reduce((sum, client) => sum + client.exceptions, 0);
    
    // For string values, extract the numbers
    const extractNumericValue = (str: string) => {
      const matches = str.match(/(\d+)/);
      return matches ? parseInt(matches[0], 10) : 0;
    };
    
    const totalTimeSavedHours = clientMetrics.reduce(
      (sum, client) => sum + extractNumericValue(client.timeSaved), 
      0
    );
    
    // Extract revenue (remove $ and K)
    const totalRevenue = clientMetrics.reduce(
      (sum, client) => {
        const revenue = client.revenue.replace('$', '').replace('K', '');
        return sum + parseInt(revenue, 10);
      },
      0
    );
    
    return {
      totalWorkflows: totalWorkflows.toLocaleString(),
      totalExceptions: totalExceptions.toLocaleString(),
      timeSaved: `${totalTimeSavedHours}h`,
      revenue: `$${totalRevenue}K`,
      activeClients: `${clientMetrics.length}`
    };
  };
  
  const dashboardData = calculateDashboardTotals();
  
  // Handle client added event
  const handleClientAdded = () => {
    console.log("Client added, refreshing dashboard...");
    setRefreshTrigger(prev => prev + 1);
    
    // Refetch client metrics
    fetchClientMetrics();
    
    toast({
      title: "Success",
      description: "Client added successfully!",
      variant: "default"
    });
  };
  
  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Header />
        
        <main className="flex-1 p-6 md:p-8">
          {/* Time period filter */}
          <div className="mb-6 flex flex-wrap">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setActiveTab("7d")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "7d" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                Last 7 days
              </button>
              <button 
                onClick={() => setActiveTab("30d")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "30d" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                Last 30 days
              </button>
              <button 
                onClick={() => setActiveTab("mtd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "mtd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                MTD
              </button>
              <button 
                onClick={() => setActiveTab("qtd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "qtd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                QTD
              </button>
              <button 
                onClick={() => setActiveTab("ytd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "ytd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                YTD
              </button>
              <button 
                onClick={() => setActiveTab("itd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "itd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                ITD
              </button>
            </div>
          </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <MetricsCard 
              title="Total Workflows" 
              value={loading ? "Loading..." : dashboardData.totalWorkflows} 
              trend={{ value: 12, positive: true }}
            />
            <MetricsCard 
              title="Total Exceptions" 
              value={loading ? "Loading..." : dashboardData.totalExceptions} 
              trend={{ value: 8, positive: false }}
            />
            <MetricsCard 
              title="Time Saved" 
              value={loading ? "Loading..." : dashboardData.timeSaved} 
              trend={{ value: 24, positive: true }}
            />
            <MetricsCard 
              title="Revenue" 
              value={loading ? "Loading..." : dashboardData.revenue} 
              trend={{ value: 16, positive: true }}
            />
            <MetricsCard 
              title="Active Clients" 
              value={loading ? "Loading..." : dashboardData.activeClients} 
              trend={{ value: 5, positive: true }}
            />
          </div>
          
          {/* Clients Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">All Clients</h2>
              
              <AddClientDialog 
                buttonClassName="bg-black hover:bg-gray-800 text-white" 
                onClientAdded={handleClientAdded}
              />
            </div>
            
            {/* Clients Table */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
              <ClientsTableEnhanced 
                clients={clientMetrics} 
                isLoading={loading} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

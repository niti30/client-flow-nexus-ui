
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("itd");
  const [dashboardData, setDashboardData] = useState({
    totalWorkflows: '2,847',
    totalExceptions: '156',
    timeSaved: '1,284h',
    revenue: '$847K',
    activeClients: '128'
  });
  const [clients, setClients] = useState([
    {
      name: 'Acme Corp',
      contractStart: 'Jan 15, 2025',
      workflows: 24,
      nodes: 156,
      executions: 1847,
      exceptions: 12,
      revenue: '$24,500',
      timeSaved: '284h',
      moneySaved: '$42,600'
    }
  ]);
  const [loading, setLoading] = useState(true);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch this data from Supabase
        // For now, we'll just simulate the data loading
        
        // Set static data based on activeTab to simulate different time periods
        let data = {
          totalWorkflows: '2,847',
          totalExceptions: '156',
          timeSaved: '1,284h',
          revenue: '$847K',
          activeClients: '128'
        };
        
        if (activeTab === '7d') {
          data = {
            totalWorkflows: '732',
            totalExceptions: '42',
            timeSaved: '312h',
            revenue: '$198K',
            activeClients: '115'
          };
        } else if (activeTab === '30d') {
          data = {
            totalWorkflows: '1,564',
            totalExceptions: '87',
            timeSaved: '724h',
            revenue: '$412K',
            activeClients: '122'
          };
        }
        
        setDashboardData(data);
        
        // Simulate loading delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [activeTab]); // Refetch when tab changes
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
                onClick={() => handleTabChange("7d")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "7d" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                Last 7 days
              </button>
              <button 
                onClick={() => handleTabChange("30d")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "30d" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                Last 30 days
              </button>
              <button 
                onClick={() => handleTabChange("mtd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "mtd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                MTD
              </button>
              <button 
                onClick={() => handleTabChange("qtd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "qtd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                QTD
              </button>
              <button 
                onClick={() => handleTabChange("ytd")} 
                className={`px-4 py-2 text-sm rounded-md font-medium ${activeTab === "ytd" ? "bg-black text-white" : "bg-white text-black border border-gray-200"}`}
              >
                YTD
              </button>
              <button 
                onClick={() => handleTabChange("itd")} 
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
              
              <AddClientDialog buttonClassName="bg-black hover:bg-gray-800 text-white" />
            </div>
            
            {/* Clients Table */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
              <ClientsTableEnhanced clients={clients} isLoading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

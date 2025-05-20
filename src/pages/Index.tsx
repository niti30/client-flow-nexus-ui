
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
  const [dashboardData, setDashboardData] = useState({
    totalWorkflows: '0',
    totalExceptions: '0',
    timeSaved: '0h',
    revenue: '$0',
    activeClients: '0'
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [trendData, setTrendData] = useState({
    workflows: { value: 12, positive: true },
    exceptions: { value: 8, positive: false },
    timeSaved: { value: 24, positive: true },
    revenue: { value: 16, positive: true },
    clients: { value: 5, positive: true }
  });
  
  const { fetchClientWorkflowStats } = useWorkflows();
  
  // Fetch clients for dashboard with workflow stats
  useEffect(() => {
    const fetchClientsWithStats = async () => {
      try {
        setLoading(true);
        
        // Fetch real clients from Supabase
        const { data, error } = await supabase
          .from('clients')
          .select('*');
          
        if (error) {
          console.error("Error fetching clients:", error);
          toast({
            title: "Error fetching clients",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        console.log("Fetched clients for dashboard:", data);
        
        // Get workflow statistics for all clients
        const clientStats = await fetchClientWorkflowStats();
        console.log("Client workflow stats:", clientStats);
        
        // Process clients to match the expected format for ClientsTableEnhanced
        const formattedClients = data.map(client => {
          // Find stats for this client
          const stats = clientStats.find(stat => stat.clientId === client.id) || {
            totalWorkflows: 0,
            exceptions: 0,
            timeSaved: '0h',
            revenue: '$0',
            moneySaved: '$0'
          };
          
          return {
            name: client.name,
            contractStart: client.created_at ? new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
            workflows: stats.totalWorkflows,
            nodes: Math.round(stats.totalWorkflows * 1.8), // Approximate nodes based on workflows
            executions: Math.round(stats.totalWorkflows * 4.2), // Approximate executions based on workflows
            exceptions: stats.exceptions,
            revenue: stats.revenue,
            timeSaved: stats.timeSaved,
            moneySaved: stats.moneySaved,
            id: client.id,
            status: client.status
          };
        });
        
        setClients(formattedClients);
        
      } catch (error) {
        console.error("Error in client fetch:", error);
        toast({
          title: "Unexpected error",
          description: "Failed to fetch clients. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientsWithStats();
  }, [refreshTrigger, toast, fetchClientWorkflowStats]); 
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch real dashboard metrics from Supabase using the RPC function
        const { data, error } = await supabase.rpc('get_dashboard_metrics', {
          time_period: activeTab
        });
        
        if (error) {
          console.error("Error fetching dashboard data:", error);
          toast({
            title: "Error fetching dashboard data",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        console.log("Fetched dashboard data:", data);
        
        // Format the data for display
        const formattedData = {
          totalWorkflows: data.totalWorkflows.toLocaleString(),
          totalExceptions: data.totalExceptions.toLocaleString(),
          timeSaved: `${data.timeSaved.toLocaleString()}h`,
          revenue: `$${(data.revenue/1000).toLocaleString()}K`,
          activeClients: data.activeClients.toLocaleString()
        };
        
        setDashboardData(formattedData);
        
        // Generate some random trend data based on timeframe
        // In a real app, this would be calculated from historical data
        const randomizeTrend = (base, range) => {
          const value = Math.round(base + (Math.random() * range));
          const positive = Math.random() > 0.3; // 70% chance of positive trend
          return { value, positive };
        };
        
        setTrendData({
          workflows: randomizeTrend(10, 8),
          exceptions: { value: Math.round(Math.random() * 15), positive: false },
          timeSaved: randomizeTrend(20, 10),
          revenue: randomizeTrend(15, 10),
          clients: randomizeTrend(4, 5)
        });
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Unexpected error",
          description: "Failed to fetch dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [activeTab, toast]); 
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle client added event
  const handleClientAdded = () => {
    console.log("Client added, refreshing dashboard...");
    setRefreshTrigger(prev => prev + 1);
    
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
              trend={trendData.workflows}
            />
            <MetricsCard 
              title="Total Exceptions" 
              value={loading ? "Loading..." : dashboardData.totalExceptions} 
              trend={trendData.exceptions}
            />
            <MetricsCard 
              title="Time Saved" 
              value={loading ? "Loading..." : dashboardData.timeSaved} 
              trend={trendData.timeSaved}
            />
            <MetricsCard 
              title="Revenue" 
              value={loading ? "Loading..." : dashboardData.revenue} 
              trend={trendData.revenue}
            />
            <MetricsCard 
              title="Active Clients" 
              value={loading ? "Loading..." : dashboardData.activeClients} 
              trend={trendData.clients}
            />
          </div>
          
          {/* Additional metrics component */}
          <DashboardMetrics timeframe={activeTab} />
          
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
                clients={clients} 
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

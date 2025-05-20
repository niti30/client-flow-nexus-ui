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
        
        // Get workflow statistics for all clients
        const clientStats = await fetchClientWorkflowStats();
        console.log("Client workflow stats:", clientStats);
        
        // Format for the clients table
        const formattedClients = clientStats.map(stats => ({
          name: stats.clientName,
          contractStart: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          workflows: stats.totalWorkflows,
          nodes: Math.round(stats.totalWorkflows * 1.8), // Approximate nodes based on workflows
          executions: Math.round(stats.totalWorkflows * 4.2), // Approximate executions based on workflows
          exceptions: stats.exceptions,
          revenue: stats.revenue,
          timeSaved: stats.timeSaved,
          moneySaved: stats.moneySaved,
          id: stats.clientId,
          status: 'active'
        }));
        
        setClients(formattedClients);
        
      } catch (error) {
        console.error("Error in client fetch:", error);
        toast({
          title: "Unexpected error",
          description: "Failed to fetch clients. Using fallback data.",
          variant: "destructive"
        });
        
        // Set fallback data to ensure UI doesn't break
        setClients([
          {
            name: 'Acme Corp',
            contractStart: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            workflows: 2847,
            nodes: 5124,
            executions: 11957,
            exceptions: 156,
            revenue: '$845,559',
            timeSaved: '1284h',
            moneySaved: '$404,274',
            id: '1',
            status: 'active'
          },
          {
            name: 'Globex Industries',
            contractStart: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            workflows: 1253,
            nodes: 2255,
            executions: 5262,
            exceptions: 73,
            revenue: '$372,141',
            timeSaved: '564h',
            moneySaved: '$177,926',
            id: '2',
            status: 'active'
          },
          {
            name: 'Initech Solutions',
            contractStart: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            workflows: 978,
            nodes: 1760,
            executions: 4107,
            exceptions: 42,
            revenue: '$290,466',
            timeSaved: '440h',
            moneySaved: '$138,876',
            id: '3',
            status: 'active'
          }
        ]);
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
        
        // Try to fetch from Supabase
        const { data, error } = await supabase.rpc('get_dashboard_metrics', {
          time_period: activeTab
        });
        
        if (error) {
          console.error("Error fetching dashboard data:", error);
          // Use fallback data
          useFallbackDashboardData();
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
        
        // Generate trends based on timeframe
        setTrendData({
          workflows: generateTrend(10, 8, true),
          exceptions: generateTrend(8, 5, false),
          timeSaved: generateTrend(20, 10, true),
          revenue: generateTrend(15, 10, true),
          clients: generateTrend(4, 5, true)
        });
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        useFallbackDashboardData();
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function to use fallback data when API fails
    const useFallbackDashboardData = () => {
      toast({
        title: "Data fetch issue",
        description: "Using sample data for demonstration",
        variant: "destructive"
      });
      
      setDashboardData({
        totalWorkflows: '2,847',
        totalExceptions: '156',
        timeSaved: '1,284h',
        revenue: '$847K',
        activeClients: '3'
      });
      
      setTrendData({
        workflows: { value: 12, positive: true },
        exceptions: { value: 8, positive: false },
        timeSaved: { value: 24, positive: true },
        revenue: { value: 16, positive: true },
        clients: { value: 5, positive: true }
      });
    };
    
    // Helper function to generate trend data
    const generateTrend = (base, range, mostlyPositive = true) => {
      const value = Math.round(base + (Math.random() * range));
      const positive = mostlyPositive ? Math.random() > 0.3 : Math.random() > 0.7;
      return { value, positive };
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

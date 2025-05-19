
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
    totalWorkflows: '0',
    totalExceptions: '0',
    timeSaved: '0h',
    revenue: '$0',
    activeClients: '0'
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch total workflows
        const { data: workflows, error: workflowsError } = await supabase
          .from('workflows')
          .select('*');
        
        // Fetch total exceptions
        const { data: exceptions, error: exceptionsError } = await supabase
          .from('exceptions')
          .select('*');
        
        // Fetch clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*');
        
        if (workflowsError || exceptionsError || clientsError) {
          console.error("Error fetching data:", { workflowsError, exceptionsError, clientsError });
          return;
        }
        
        // Calculate metrics (this would be more advanced in a real app)
        const totalWorkflows = workflows?.length || 0;
        const totalExceptions = exceptions?.length || 0;
        const activeClients = clientsData?.filter(c => c.status === 'active')?.length || 0;
        
        // Mock calculations for time saved and revenue (would be from real data in production)
        const timeSaved = totalWorkflows * 4.5; // Example calculation
        const revenue = totalWorkflows * 300; // Example calculation
        
        setDashboardData({
          totalWorkflows: totalWorkflows.toLocaleString(),
          totalExceptions: totalExceptions.toLocaleString(),
          timeSaved: `${Math.round(timeSaved).toLocaleString()}h`,
          revenue: `$${Math.round(revenue).toLocaleString()}K`,
          activeClients: activeClients.toLocaleString()
        });
        
        // Prepare clients data for the table
        if (clientsData) {
          const formattedClients = await Promise.all(clientsData.map(async (client) => {
            // Fetch client's workflows
            const { data: clientWorkflows } = await supabase
              .from('workflows')
              .select('*')
              .eq('client_id', client.id);
            
            // Fetch client's exceptions
            const { data: clientExceptions } = await supabase
              .from('exceptions')
              .select('*')
              .eq('client_id', client.id);
            
            // Calculate derived metrics
            const workflowCount = clientWorkflows?.length || 0;
            const nodeCount = workflowCount * 6; // Example calculation
            const executionCount = workflowCount * 75; // Example calculation
            const exceptionCount = clientExceptions?.length || 0;
            const timeSaved = workflowCount * 12; // Example: 12 hours per workflow
            const revenue = workflowCount * 1000; // Example calculation
            
            return {
              name: client.name,
              contractStart: new Date(client.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              workflows: workflowCount,
              nodes: nodeCount,
              executions: executionCount,
              exceptions: exceptionCount,
              revenue: `$${revenue.toLocaleString()}`,
              timeSaved: `${timeSaved}h`,
              moneySaved: `$${(timeSaved * 150).toLocaleString()}` // Example: $150 per hour saved
            };
          }));
          
          setClients(formattedClients);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
          
          {/* Enhanced metrics for specific time periods */}
          <DashboardMetrics timeframe={activeTab} />
          
          {/* Clients Section */}
          <div className="mt-10">
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

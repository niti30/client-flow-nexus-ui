
import { useState, useEffect } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Users, FileText, AlertTriangle, Clock, DollarSign, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalWorkflows: 0,
    totalExceptions: 0,
    timeSaved: 0,
    revenue: 0,
    activeClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_dashboard_metrics', { time_period: '30d' });
        
        if (error) {
          console.error('Error fetching metrics:', error);
          toast({
            title: "Error loading metrics",
            description: "Could not load dashboard metrics",
            variant: "destructive",
          });
        } else if (data) {
          setMetrics(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [toast]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="bg-white">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-blue-100 p-3 mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{metrics.activeClients}</h3>
                  <p className="text-sm text-gray-500">Active Clients</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{metrics.totalWorkflows}</h3>
                  <p className="text-sm text-gray-500">Active Workflows</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-red-100 p-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{metrics.totalExceptions}</h3>
                  <p className="text-sm text-gray-500">Exceptions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{metrics.timeSaved}h</h3>
                  <p className="text-sm text-gray-500">Time Saved</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="rounded-full bg-amber-100 p-3 mb-4">
                    <DollarSign className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-3xl font-bold">{formatCurrency(metrics.revenue)}</h3>
                  <p className="text-sm text-gray-500">Revenue</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="md:col-span-1 bg-white">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => navigate('/clients')} 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    View Clients <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/workflows')} 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    Manage Workflows <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/exceptions')} 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    Check Exceptions <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/reporting')} 
                    variant="outline" 
                    className="w-full justify-between"
                  >
                    Generate Reports <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="md:col-span-2 bg-white">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">New client onboarded</span>
                          <span className="text-gray-500 text-sm">Today</span>
                        </div>
                        <p className="text-sm text-gray-500">Acme Inc. completed onboarding</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Workflow created</span>
                          <span className="text-gray-500 text-sm">Yesterday</span>
                        </div>
                        <p className="text-sm text-gray-500">Invoice automation for TechCorp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Exception resolved</span>
                          <span className="text-gray-500 text-sm">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-500">Data format issue in Global Systems workflow</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">New user added</span>
                          <span className="text-gray-500 text-sm">3 days ago</span>
                        </div>
                        <p className="text-sm text-gray-500">Sarah Johnson joined as Solutions Engineer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full text-blue-600"
                    onClick={() => navigate('/reporting')}
                  >
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, Plus, Users, Workflow, FileText, CreditCard } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ClientsTable from "@/components/dashboard/ClientsTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState("7d");
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Dashboard</h1>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Tabs defaultValue="7d" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full">
                    <TabsTrigger value="7d">7 d</TabsTrigger>
                    <TabsTrigger value="30d">30 d</TabsTrigger>
                    <TabsTrigger value="mtd">MTD</TabsTrigger>
                    <TabsTrigger value="qtd">QTD</TabsTrigger>
                    <TabsTrigger value="ytd">YTD</TabsTrigger>
                    <TabsTrigger value="itd">ITD</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* Dashboard Metrics */}
            <DashboardMetrics timeframe={activeTab} />
            
            {/* Clients Section */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Clients</h2>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                      placeholder="Search clients..." 
                      className="pl-9 w-full sm:w-[260px]" 
                    />
                  </div>
                  
                  <Button className="w-full sm:w-auto">
                    <Plus size={16} className="mr-2" />
                    Add Client
                  </Button>
                </div>
              </div>
              
              {/* Clients Table */}
              <ClientsTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

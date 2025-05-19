
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ClientsTable from "@/components/dashboard/ClientsTable";

const Clients = () => {
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Clients</h1>
              
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
        </main>
      </div>
    </div>
  );
};

export default Clients;

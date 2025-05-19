
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ClientsTable from "@/components/dashboard/ClientsTable";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Clients</h1>
          
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search clients..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-[#141417] hover:bg-black">
              <Plus size={16} className="mr-2" />
              Add Client
            </Button>
          </div>
          
          {/* Clients Table */}
          <ClientsTable searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
};

export default Clients;

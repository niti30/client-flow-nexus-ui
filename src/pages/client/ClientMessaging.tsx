
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";

const ClientMessaging = () => {
  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">Messaging</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <p className="text-gray-500 text-center">Messaging center will be implemented here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientMessaging;

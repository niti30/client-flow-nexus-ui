
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { ClientUsersList } from "@/components/client-detail/ClientUsersList";

const ClientUsers = () => {
  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ClientUsersList clientId="demo" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientUsers;

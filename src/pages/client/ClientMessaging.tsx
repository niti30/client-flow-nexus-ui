
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";

const ClientMessaging = () => {
  const navigate = useNavigate();
  
  // Redirect to the ClientSupport page
  useEffect(() => {
    navigate('/client/support');
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">Redirecting to Support...</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">You are being redirected to the Support page...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientMessaging;

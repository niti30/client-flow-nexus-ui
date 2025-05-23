
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            
            <Card>
              <CardContent className="pt-6">
                <p>Welcome to the dashboard. This is a placeholder for the dashboard content.</p>
                <p className="mt-4">Navigate to other sections using the sidebar.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

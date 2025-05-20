
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const ClientDashboard = () => {
  const navigate = useNavigate();
  
  // Sample data for client dashboard
  const timeData = {
    thisWeek: "24.5 hrs",
    allTime: "168.2 hrs"
  };
  
  const moneyData = {
    thisWeek: "$2,450",
    allTime: "$16,820"
  };
  
  const pipelineProgress = [
    { title: "Discovery: Initial Survey", date: "Jan 15, 2025", status: "completed" },
    { title: "Discovery: Process deep dive", date: "Jan 20, 2025", status: "completed" },
    { title: "ADA Proposal Sent", date: "Jan 25, 2025", status: "completed" },
    { title: "ADA Proposal Review", date: "In Progress", status: "in-progress" },
    { title: "ADA Contract Sent", date: "", status: "pending" },
    { title: "ADA Contract Signed", date: "", status: "pending" },
    { title: "Credentials collected", date: "", status: "pending" },
    { title: "Factory build initiated", date: "", status: "pending" },
  ];
  
  const handleMessageSE = () => {
    navigate('/client/support');
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Pipeline Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pipelineProgress.map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            step.status === 'completed' ? 'bg-green-500 text-white' : 
                            step.status === 'in-progress' ? 'bg-blue-500 text-white' : 
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {step.status === 'completed' ? '✓' : index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{step.title}</span>
                              <span className="text-gray-500 text-sm">{step.date}</span>
                            </div>
                            {step.status === 'in-progress' && (
                              <div className="h-1 w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/2"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">John Smith</CardTitle>
                    <p className="text-sm text-gray-500">Solutions Engineer</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img 
                          src="https://i.pravatar.cc/150?img=1" 
                          alt="Engineer" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        className="w-full flex items-center justify-center"
                        onClick={handleMessageSE}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message SE
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Time Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last 7 days</span>
                        <span className="font-bold text-xl">{timeData.thisWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">All time</span>
                        <span className="font-bold text-xl">{timeData.allTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Money Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last 7 days</span>
                        <span className="font-bold text-xl">{moneyData.thisWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">All time</span>
                        <span className="font-bold text-xl">{moneyData.allTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-10">
                  <p className="text-4xl font-bold mb-4">0</p>
                  <p className="text-gray-500 mb-4">You don't have any active workflows yet.</p>
                  <Button variant="outline">View workflows</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;

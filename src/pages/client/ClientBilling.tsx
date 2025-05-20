
import { useState } from "react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

const ClientBilling = () => {
  // Sample data
  const [billingData, setBillingData] = useState({
    plan: {
      name: "Enterprise",
      baseFee: "$2,000/month"
    },
    credits: {
      remaining: 8450,
      renewalDate: "May 1, 2025"
    },
    seHours: {
      used: 12.5,
      total: 20,
      remaining: 7.5,
      engineers: [
        { name: "John Smith", hours: 8.5 },
        { name: "Sarah Johnson", hours: 4.0 }
      ]
    },
    usage: {
      apiCalls: 245678,
      storageUsed: "1.2 TB",
      activeUsers: 127
    },
    invoices: [
      { month: "April 2025", number: "2025-04", amount: 2450 },
      { month: "March 2025", number: "2025-03", amount: 2450 },
      { month: "February 2025", number: "2025-02", amount: 2450 }
    ]
  });

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Billing Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold">{billingData.plan.name}</h3>
                  <p className="text-gray-500">{billingData.plan.baseFee} base fee</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Credits Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold">{billingData.credits.remaining}</h3>
                  <p className="text-gray-500">Renews on {billingData.credits.renewalDate}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">SE Hours This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold">{billingData.seHours.used} / {billingData.seHours.total}</h3>
                  <p className="text-gray-500">{billingData.seHours.remaining} hours remaining</p>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Hours by Engineer:</p>
                    {billingData.seHours.engineers.map((engineer, index) => (
                      <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                        <span>{engineer.name}</span>
                        <span className="font-medium">{engineer.hours} hrs</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Usage Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-gray-600">API Calls</span>
                      <span className="font-medium text-lg">{billingData.usage.apiCalls}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="font-medium text-lg">{billingData.usage.storageUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-medium text-lg">{billingData.usage.activeUsers}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-right">
                    <a href="#" className="text-blue-500 text-sm hover:underline inline-flex items-center">
                      View detailed report →
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingData.invoices.map((invoice, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{invoice.month}</p>
                          <p className="text-sm text-gray-500">Invoice #{invoice.number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${invoice.amount}</span>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-right">
                    <a href="#" className="text-blue-500 text-sm hover:underline inline-flex items-center">
                      View all invoices →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientBilling;

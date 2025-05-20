
import { useState } from "react";
import { Download, CreditCard, ArrowRight } from "lucide-react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    ],
    paymentMethod: {
      type: "Visa",
      last4: "4242",
      expiry: "12/25"
    }
  });

  return (
    <div className="flex h-screen bg-white">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Billing Overview</h1>
            
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold">{billingData.plan.name}</h3>
                  <p className="text-gray-600">{billingData.plan.baseFee} base fee</p>
                </CardContent>
              </Card>
              
              <Card className="border rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Credits Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold">{billingData.credits.remaining}</h3>
                  <p className="text-gray-600">Renews on {billingData.credits.renewalDate}</p>
                </CardContent>
              </Card>
              
              <Card className="border rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">SE Hours This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold">{billingData.seHours.used} / {billingData.seHours.total}</h3>
                  <p className="text-gray-600">{billingData.seHours.remaining} hours remaining</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Usage and Invoices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border rounded-lg">
                <CardHeader className="pb-2 flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Usage Summary</CardTitle>
                  <a href="#" className="text-blue-500 text-sm hover:underline inline-flex items-center">
                    View detailed report <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-gray-600">API Calls</span>
                      <span className="font-medium">{billingData.usage.apiCalls}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="font-medium">{billingData.usage.storageUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-medium">{billingData.usage.activeUsers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
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
                          <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <a href="#" className="text-blue-500 text-sm hover:underline inline-flex items-center justify-center">
                      View all invoices <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Billing Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Billing Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border rounded-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="bg-gray-200 p-2 rounded-lg mr-3">
                        <CreditCard className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {billingData.paymentMethod.type} ending in {billingData.paymentMethod.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {billingData.paymentMethod.expiry}
                        </p>
                      </div>
                    </div>
                    <a href="#" className="text-blue-500 text-sm hover:underline">
                      Update payment method
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="border rounded-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-center">
                      Download Contract
                    </Button>
                    <Button className="w-full justify-center bg-black hover:bg-gray-800">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientBilling;

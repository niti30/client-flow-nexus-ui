
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ClientBilling = () => {
  // Fetch billing data
  const { data: billingData } = useQuery({
    queryKey: ['billing-data'],
    queryFn: async () => {
      // Mock data based on the UI in the image
      return {
        currentPlan: {
          name: "Enterprise",
          fee: "$2,000/month base fee"
        },
        credits: {
          remaining: 8450,
          renewDate: "May 1, 2025"
        },
        seHours: {
          used: 12.5,
          total: 20,
          remaining: "7.5 hours remaining"
        },
        usage: {
          apiCalls: 245678,
          storageUsed: "1.2 TB",
          activeUsers: 127
        },
        invoices: [
          { month: "April", year: 2025, number: "2025-04", amount: 2450 },
          { month: "March", year: 2025, number: "2025-03", amount: 2450 },
          { month: "February", year: 2025, number: "2025-02", amount: 2450 }
        ],
        payment: {
          type: "Visa",
          last4: "4242",
          expiry: "12/25"
        }
      };
    }
  });

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // This would normally fetch and download the invoice
    // For now we'll simulate a file download
    const dummyLink = document.createElement('a');
    dummyLink.href = 'data:text/plain;charset=utf-8,Invoice Data';
    dummyLink.download = `Invoice_${invoiceNumber}.pdf`;
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  };

  const handleDownloadContract = () => {
    // This would normally fetch and download the contract
    // For now we'll simulate a file download
    const dummyLink = document.createElement('a');
    dummyLink.href = 'data:text/plain;charset=utf-8,Contract Data';
    dummyLink.download = 'Service_Contract.pdf';
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  };

  const handleContactSupport = () => {
    // This would normally open a support ticket or chat
    window.location.href = '/client/support';
  };

  const handleUpdatePayment = () => {
    // This would normally open a payment update modal
    alert('Update payment method functionality would open here');
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">Billing Overview</h1>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Plan</h3>
                <h2 className="text-xl font-bold mb-1">{billingData?.currentPlan?.name}</h2>
                <p className="text-gray-600">{billingData?.currentPlan?.fee}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Credits Remaining</h3>
                <h2 className="text-xl font-bold mb-1">{billingData?.credits?.remaining}</h2>
                <p className="text-gray-600">Renews on {billingData?.credits?.renewDate}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">SE Hours This Month</h3>
                <h2 className="text-xl font-bold mb-1">{billingData?.seHours?.used} / {billingData?.seHours?.total}</h2>
                <p className="text-gray-600">{billingData?.seHours?.remaining}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Usage Summary */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Usage Summary</h2>
                    <a href="#" className="text-blue-500 text-sm flex items-center">
                      View detailed report →
                    </a>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">API Calls</span>
                      <span className="font-medium">{billingData?.usage?.apiCalls}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="font-medium">{billingData?.usage?.storageUsed}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-medium">{billingData?.usage?.activeUsers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Invoices */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>
                  
                  <div className="space-y-4">
                    {billingData?.invoices?.map((invoice) => (
                      <div key={invoice.number} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                        <div>
                          <h3 className="font-medium">{invoice.month} {invoice.year}</h3>
                          <p className="text-sm text-gray-500">Invoice #{invoice.number}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">${invoice.amount.toLocaleString()}</span>
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleDownloadInvoice(invoice.number)}
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <a href="#" className="text-blue-500 text-sm flex items-center">
                      View all invoices →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Billing Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6">Billing Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium mb-4">Payment Method</h3>
                  <div className="flex items-center p-4 border border-gray-200 rounded-md">
                    <div className="h-8 w-12 mr-3 flex items-center justify-center bg-blue-100 rounded">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4H2v16h20V4z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 10h20M9 16h6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{billingData?.payment?.type} ending in {billingData?.payment?.last4}</p>
                      <p className="text-sm text-gray-500">Expires {billingData?.payment?.expiry}</p>
                    </div>
                  </div>
                  <button 
                    className="text-blue-500 text-sm mt-4"
                    onClick={handleUpdatePayment}
                  >
                    Update payment method
                  </button>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center py-6 text-base"
                      onClick={handleDownloadContract}
                    >
                      Download Contract
                    </Button>
                    <Button 
                      className="w-full justify-center py-6 text-base bg-black text-white hover:bg-gray-800"
                      onClick={handleContactSupport}
                    >
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientBilling;

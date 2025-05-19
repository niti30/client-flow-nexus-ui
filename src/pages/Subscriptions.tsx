
import { useState, useEffect } from 'react';
import { usePlans } from "@/hooks/usePlans";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import PlansTable from "@/components/subscriptions/PlansTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddPlanForm from "@/components/subscriptions/AddPlanForm";
import { Plus } from "lucide-react";

const Subscriptions = () => {
  const { plans, loading } = usePlans();
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddPlan = () => {
    setShowAddPlanDialog(true);
  };

  const handlePlanAdded = () => {
    setShowAddPlanDialog(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Plan Manager</h1>
              <Button onClick={handleAddPlan} className="bg-black text-white hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </div>
            
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No plans found. Add your first subscription plan.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-gray-800">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing Model</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Length</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cadence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setup Fee</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prepayment %</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Cap</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overage Cost</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Clients</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {plans.map((plan) => (
                        <tr key={plan.name}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{plan.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{plan.pricing_model}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{plan.contract_length}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{plan.billing_cadence}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${plan.setup_fee.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{plan.prepayment_percentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap">${plan.cap.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${plan.overage_cost}/hr</td>
                          <td className="px-6 py-4 whitespace-nowrap">{plan.client_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <Dialog open={showAddPlanDialog} onOpenChange={setShowAddPlanDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Subscription Plan</DialogTitle>
            <DialogDescription>
              Configure a new subscription plan for your clients.
            </DialogDescription>
          </DialogHeader>
          <AddPlanForm onPlanAdded={handlePlanAdded} onCancel={() => setShowAddPlanDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;

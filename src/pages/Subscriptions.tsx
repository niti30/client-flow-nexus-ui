
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import PlansTable from "@/components/subscriptions/PlansTable";
import AddPlanForm from "@/components/subscriptions/AddPlanForm";
import { usePlans } from "@/hooks/usePlans";
import { useToast } from "@/hooks/use-toast";

const Subscriptions = () => {
  const { plans, loading, addPlan } = usePlans();
  const { toast } = useToast();
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);

  const handleAddPlan = () => {
    setIsAddPlanOpen(true);
  };

  const handleAddPlanSubmit = async (planData: any) => {
    const success = await addPlan(planData);
    
    if (success) {
      toast({
        title: "Success",
        description: "Plan has been created successfully.",
        variant: "default",
      });
      setIsAddPlanOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <PlansTable 
                plans={plans} 
                onAddPlan={handleAddPlan}
              />
            )}
          </div>
        </main>
      </div>
      
      <AddPlanForm 
        isOpen={isAddPlanOpen}
        onClose={() => setIsAddPlanOpen(false)}
        onSubmit={handleAddPlanSubmit}
      />
    </div>
  );
};

export default Subscriptions;

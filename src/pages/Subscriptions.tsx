
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePlans } from "@/hooks/usePlans";
import { useToast } from "@/hooks/use-toast";
import PlansTable from "@/components/subscriptions/PlansTable";
import AddPlanForm from "@/components/subscriptions/AddPlanForm";

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
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <PlansTable 
              plans={plans} 
              loading={loading} 
              onAddPlan={handleAddPlan} 
            />
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

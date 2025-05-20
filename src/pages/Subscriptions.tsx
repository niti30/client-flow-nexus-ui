
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePlans } from "@/hooks/usePlans";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  // Sample plans matching the 4th image
  const samplePlans = [
    {
      name: "Enterprise Pro",
      pricingModel: "Tiered",
      contractLength: "12 months",
      billingCadence: "Monthly",
      setupFee: "$5,000",
      prepaymentPercentage: "25%",
      cap: "$100,000",
      overageCost: "$150/hr",
      clientCount: 12
    },
    {
      name: "Business Plus",
      pricingModel: "Fixed",
      contractLength: "6 months",
      billingCadence: "Quarterly",
      setupFee: "$2,500",
      prepaymentPercentage: "15%",
      cap: "$50,000",
      overageCost: "$125/hr",
      clientCount: 28
    },
    {
      name: "Starter",
      pricingModel: "Usage",
      contractLength: "3 months",
      billingCadence: "Monthly",
      setupFee: "$1,000",
      prepaymentPercentage: "10%",
      cap: "$25,000",
      overageCost: "$100/hr",
      clientCount: 45
    }
  ];

  const displayPlans = loading ? [] : (plans.length > 0 ? plans : samplePlans);

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Plan Manager</h1>
              <Button onClick={handleAddPlan} className="bg-black hover:bg-gray-800">
                <Plus size={16} className="mr-2" />
                Add Plan
              </Button>
            </div>
            
            <div className="bg-white rounded-md overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#FAF9F8]">
                  <TableRow className="hover:bg-[#FAF9F8]">
                    <TableHead className="font-bold text-black">Name</TableHead>
                    <TableHead className="font-bold text-black">Pricing Model</TableHead>
                    <TableHead className="font-bold text-black">Contract Length</TableHead>
                    <TableHead className="font-bold text-black">Billing Cadence</TableHead>
                    <TableHead className="font-bold text-black">Setup Fee</TableHead>
                    <TableHead className="font-bold text-black">Prepayment %</TableHead>
                    <TableHead className="font-bold text-black">$ Cap</TableHead>
                    <TableHead className="font-bold text-black">Overage Cost</TableHead>
                    <TableHead className="font-bold text-black"># Clients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayPlans.map((plan, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.pricingModel}</TableCell>
                      <TableCell>{plan.contractLength}</TableCell>
                      <TableCell>{plan.billingCadence}</TableCell>
                      <TableCell>{plan.setupFee}</TableCell>
                      <TableCell>{plan.prepaymentPercentage}</TableCell>
                      <TableCell>{plan.cap}</TableCell>
                      <TableCell>{plan.overageCost}</TableCell>
                      <TableCell>{plan.clientCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

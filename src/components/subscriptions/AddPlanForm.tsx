
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AddPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: any) => void;
}

const AddPlanForm = ({
  isOpen,
  onClose,
  onSubmit
}: AddPlanFormProps) => {
  const [planName, setPlanName] = useState("");
  const [pricingModel, setPricingModel] = useState("Fixed");
  const [contractLength, setContractLength] = useState("3 months");
  const [billingCadence, setBillingCadence] = useState("Monthly");
  const [setupFee, setSetupFee] = useState("");
  const [prepaymentPercentage, setPrepaymentPercentage] = useState("");
  const [cap, setCap] = useState("");
  const [overageCost, setOverageCost] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planData = {
      name: planName,
      pricingModel,
      contractLength,
      billingCadence,
      setupFee: `$${setupFee}`,
      prepaymentPercentage: `${prepaymentPercentage}%`,
      cap: `$${cap}`,
      overageCost: `$${overageCost}/hr`,
      clientCount: 0
    };
    onSubmit(planData);
    resetForm();
  };

  const resetForm = () => {
    setPlanName("");
    setPricingModel("Fixed");
    setContractLength("3 months");
    setBillingCadence("Monthly");
    setSetupFee("");
    setPrepaymentPercentage("");
    setCap("");
    setOverageCost("");
  };

  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200 text-slate-950">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-slate-950">Add New Plan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <Input 
              placeholder="Enter plan name" 
              value={planName} 
              onChange={e => setPlanName(e.target.value)} 
              required 
              className="border-gray-300 text-slate-950 bg-white" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={pricingModel} onValueChange={setPricingModel}>
                <SelectTrigger className="bg-white border-gray-300 text-slate-950">
                  <SelectValue placeholder="Pricing Model" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-slate-950">
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Tiered">Tiered</SelectItem>
                  <SelectItem value="Usage">Usage</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex">
                <span className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">$</span>
                <Input 
                  type="number" 
                  className="rounded-l-none bg-white border-gray-300 text-slate-950" 
                  placeholder="Price" 
                  value={setupFee} 
                  onChange={e => setSetupFee(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={contractLength} onValueChange={setContractLength}>
                <SelectTrigger className="bg-white border-gray-300 text-slate-950">
                  <SelectValue placeholder="Contract Length" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-slate-950">
                  <SelectItem value="Month">Month</SelectItem>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={billingCadence} onValueChange={setBillingCadence}>
                <SelectTrigger className="bg-white border-gray-300 text-slate-950">
                  <SelectValue placeholder="Billing Cadence" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-slate-950">
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex">
                <Input 
                  type="number" 
                  placeholder="Prepayment Percentage" 
                  className="rounded-r-none bg-white border-gray-300 text-slate-950" 
                  value={prepaymentPercentage} 
                  onChange={e => setPrepaymentPercentage(e.target.value)} 
                  required 
                />
                <span className="flex items-center justify-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">%</span>
              </div>
              
              <div className="flex">
                <span className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">$</span>
                <Input 
                  type="number" 
                  className="rounded-l-none bg-white border-gray-300 text-slate-950" 
                  placeholder="Cap" 
                  value={cap} 
                  onChange={e => setCap(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="flex">
              <span className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">$</span>
              <Input 
                type="number" 
                className="rounded-l-none bg-white border-gray-300 text-slate-950" 
                placeholder="Overage Cost" 
                value={overageCost} 
                onChange={e => setOverageCost(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-row justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="bg-white text-slate-950 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-black text-white hover:bg-gray-900"
            >
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
};

export default AddPlanForm;

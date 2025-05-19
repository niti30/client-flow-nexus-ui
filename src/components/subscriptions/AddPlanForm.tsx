
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DialogFooter,
} from "@/components/ui/dialog";

interface AddPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: any) => void;
}

const AddPlanForm = ({ isOpen, onClose, onSubmit }: AddPlanFormProps) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-4">
        <Input 
          placeholder="Enter plan name" 
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          required
          className="bg-[#f5f5f7] border-gray-300 focus:border-gray-500 text-gray-800"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select 
            value={pricingModel} 
            onValueChange={setPricingModel}
          >
            <SelectTrigger className="bg-[#f5f5f7] border-gray-300 text-gray-800">
              <SelectValue placeholder="Pricing Model" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 text-gray-800">
              <SelectItem value="Fixed" className="hover:bg-gray-100">Fixed</SelectItem>
              <SelectItem value="Tiered" className="hover:bg-gray-100">Tiered</SelectItem>
              <SelectItem value="Usage" className="hover:bg-gray-100">Usage</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex">
            <span className="flex items-center justify-center px-3 bg-[#f5f5f7] border border-r-0 border-gray-300 rounded-l-md text-gray-600">$</span>
            <Input
              type="number"
              className="rounded-l-none bg-[#f5f5f7] border-gray-300 text-gray-800"
              placeholder="Price"
              value={setupFee}
              onChange={(e) => setSetupFee(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select 
            value={contractLength}
            onValueChange={setContractLength}
          >
            <SelectTrigger className="bg-[#f5f5f7] border-gray-300 text-gray-800">
              <SelectValue placeholder="Contract Length" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 text-gray-800">
              <SelectItem value="Month" className="hover:bg-gray-100">Month</SelectItem>
              <SelectItem value="3 months" className="hover:bg-gray-100">3 months</SelectItem>
              <SelectItem value="6 months" className="hover:bg-gray-100">6 months</SelectItem>
              <SelectItem value="12 months" className="hover:bg-gray-100">12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={billingCadence}
            onValueChange={setBillingCadence}
          >
            <SelectTrigger className="bg-[#f5f5f7] border-gray-300 text-gray-800">
              <SelectValue placeholder="Billing Cadence" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 text-gray-800">
              <SelectItem value="Monthly" className="hover:bg-gray-100">Monthly</SelectItem>
              <SelectItem value="Quarterly" className="hover:bg-gray-100">Quarterly</SelectItem>
              <SelectItem value="Annually" className="hover:bg-gray-100">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex">
            <Input
              type="number"
              placeholder="Prepayment Percentage"
              className="rounded-r-none bg-[#f5f5f7] border-gray-300 text-gray-800"
              value={prepaymentPercentage}
              onChange={(e) => setPrepaymentPercentage(e.target.value)}
              required
            />
            <span className="flex items-center justify-center px-3 bg-[#f5f5f7] border border-l-0 border-gray-300 rounded-r-md text-gray-600">%</span>
          </div>
          
          <div className="flex">
            <span className="flex items-center justify-center px-3 bg-[#f5f5f7] border border-r-0 border-gray-300 rounded-l-md text-gray-600">$</span>
            <Input
              type="number"
              className="rounded-l-none bg-[#f5f5f7] border-gray-300 text-gray-800"
              placeholder="Cap"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="flex">
          <span className="flex items-center justify-center px-3 bg-[#f5f5f7] border border-r-0 border-gray-300 rounded-l-md text-gray-600">$</span>
          <Input
            type="number"
            className="rounded-l-none bg-[#f5f5f7] border-gray-300 text-gray-800"
            placeholder="Overage Cost"
            value={overageCost}
            onChange={(e) => setOverageCost(e.target.value)}
            required
          />
        </div>
      </div>
      
      <DialogFooter className="flex flex-row justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-800 hover:bg-gray-100">
          Cancel
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-gray-900">
          Create Plan
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddPlanForm;

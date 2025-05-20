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
      <DialogContent className="sm:max-w-[500px] border-gray-700 text-white bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Plan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <Input placeholder="Enter plan name" value={planName} onChange={e => setPlanName(e.target.value)} required className="bg-[#1D2130] border-gray-700 focus:border-gray-500 text-white" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={pricingModel} onValueChange={setPricingModel}>
                <SelectTrigger className="bg-[#1D2130] border-gray-700 text-white">
                  <SelectValue placeholder="Pricing Model" />
                </SelectTrigger>
                <SelectContent className="bg-[#252A37] border-gray-700 text-white">
                  <SelectItem value="Fixed" className="hover:bg-gray-700">Fixed</SelectItem>
                  <SelectItem value="Tiered" className="hover:bg-gray-700">Tiered</SelectItem>
                  <SelectItem value="Usage" className="hover:bg-gray-700">Usage</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex">
                <span className="flex items-center justify-center px-3 bg-[#1D2130] border border-r-0 border-gray-700 rounded-l-md text-gray-400">$</span>
                <Input type="number" className="rounded-l-none bg-[#1D2130] border-gray-700 text-white" placeholder="Price" value={setupFee} onChange={e => setSetupFee(e.target.value)} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={contractLength} onValueChange={setContractLength}>
                <SelectTrigger className="bg-[#1D2130] border-gray-700 text-white">
                  <SelectValue placeholder="Contract Length" />
                </SelectTrigger>
                <SelectContent className="bg-[#252A37] border-gray-700 text-white">
                  <SelectItem value="Month" className="hover:bg-gray-700">Month</SelectItem>
                  <SelectItem value="3 months" className="hover:bg-gray-700">3 months</SelectItem>
                  <SelectItem value="6 months" className="hover:bg-gray-700">6 months</SelectItem>
                  <SelectItem value="12 months" className="hover:bg-gray-700">12 months</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={billingCadence} onValueChange={setBillingCadence}>
                <SelectTrigger className="bg-[#1D2130] border-gray-700 text-white">
                  <SelectValue placeholder="Billing Cadence" />
                </SelectTrigger>
                <SelectContent className="bg-[#252A37] border-gray-700 text-white">
                  <SelectItem value="Monthly" className="hover:bg-gray-700">Monthly</SelectItem>
                  <SelectItem value="Quarterly" className="hover:bg-gray-700">Quarterly</SelectItem>
                  <SelectItem value="Annually" className="hover:bg-gray-700">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex">
                <Input type="number" placeholder="Prepayment Percentage" className="rounded-r-none bg-[#1D2130] border-gray-700 text-white" value={prepaymentPercentage} onChange={e => setPrepaymentPercentage(e.target.value)} required />
                <span className="flex items-center justify-center px-3 bg-[#1D2130] border border-l-0 border-gray-700 rounded-r-md text-gray-400">%</span>
              </div>
              
              <div className="flex">
                <span className="flex items-center justify-center px-3 bg-[#1D2130] border border-r-0 border-gray-700 rounded-l-md text-gray-400">$</span>
                <Input type="number" className="rounded-l-none bg-[#1D2130] border-gray-700 text-white" placeholder="Cap" value={cap} onChange={e => setCap(e.target.value)} required />
              </div>
            </div>
            
            <div className="flex">
              <span className="flex items-center justify-center px-3 bg-[#1D2130] border border-r-0 border-gray-700 rounded-l-md text-gray-400">$</span>
              <Input type="number" className="rounded-l-none bg-[#1D2130] border-gray-700 text-white" placeholder="Overage Cost" value={overageCost} onChange={e => setOverageCost(e.target.value)} required />
            </div>
          </div>
          
          <DialogFooter className="flex flex-row justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-gray-900">
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
};
export default AddPlanForm;
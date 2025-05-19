
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Plan {
  name: string;
  pricingModel: string;
  contractLength: string;
  billingCadence: string;
  setupFee: string;
  prepaymentPercentage: string;
  cap: string;
  overageCost: string;
  clientCount: number;
}

interface PlansTableProps {
  plans: Plan[];
  onAddPlan: () => void;
}

const PlansTable = ({ plans, onAddPlan }: PlansTableProps) => {
  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Plan Manager</h2>
        <Button onClick={onAddPlan}>
          <Plus size={16} className="mr-2" />
          Add Plan
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Pricing Model</TableHead>
              <TableHead>Contract Length</TableHead>
              <TableHead>Billing Cadence</TableHead>
              <TableHead>Setup Fee</TableHead>
              <TableHead>Prepayment %</TableHead>
              <TableHead>$ Cap</TableHead>
              <TableHead className="w-[100px]">Overage</TableHead>
              <TableHead># Clients</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.pricingModel}</TableCell>
                <TableCell>{plan.contractLength}</TableCell>
                <TableCell>{plan.billingCadence}</TableCell>
                <TableCell>{plan.setupFee}</TableCell>
                <TableCell>{plan.prepaymentPercentage}</TableCell>
                <TableCell>{plan.cap}</TableCell>
                <TableCell className="whitespace-nowrap">{plan.overageCost}</TableCell>
                <TableCell>{plan.clientCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit plan</DropdownMenuItem>
                      <DropdownMenuItem>View clients</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete plan</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlansTable;

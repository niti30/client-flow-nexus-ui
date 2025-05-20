
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
import { Plan } from "@/hooks/usePlans";
import { Skeleton } from "@/components/ui/skeleton";

interface PlansTableProps {
  plans: Plan[];
  loading: boolean;
  onAddPlan: () => void;
}

const PlansTable = ({ plans, loading, onAddPlan }: PlansTableProps) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Plan Manager</h2>
        <Button onClick={onAddPlan} className="bg-black hover:bg-gray-800">
          <Plus size={16} className="mr-2" />
          Add Plan
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#f5f5f7]">
            <TableRow className="hover:bg-[#f5f5f7]">
              <TableHead className="font-semibold text-gray-700">Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Pricing Model</TableHead>
              <TableHead className="font-semibold text-gray-700">Contract Length</TableHead>
              <TableHead className="font-semibold text-gray-700">Billing Cadence</TableHead>
              <TableHead className="font-semibold text-gray-700">Setup Fee</TableHead>
              <TableHead className="font-semibold text-gray-700">Prepayment %</TableHead>
              <TableHead className="font-semibold text-gray-700">$ Cap</TableHead>
              <TableHead className="font-semibold text-gray-700">Overage</TableHead>
              <TableHead className="font-semibold text-gray-700"># Clients</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(3).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={10}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-gray-500">
                  No plans available. Create your first plan to get started.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan, index) => (
                <TableRow key={plan.id || index} className="hover:bg-gray-50">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlansTable;

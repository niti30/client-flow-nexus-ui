
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface Client {
  name: string;
  contractStart: string;
  workflows: number;
  nodes: number;
  executions: number;
  exceptions: number;
  revenue: string;
  timeSaved: string;
  moneySaved: string;
}

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTableEnhanced = ({ clients }: ClientsTableProps) => {
  const isMobile = useIsMobile();
  
  // Function to extract the actual date parts from strings like "Jan 15, 2025"
  const extractDateParts = (dateString: string) => {
    const parts = dateString.split(" ");
    return {
      month: parts[0],
      day: parts[1].replace(",", ""),
      year: parts[2]
    };
  };

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#FAF9F8]">
            <TableRow>
              <TableHead className="font-medium text-gray-500 text-xs uppercase">
                Create Date
              </TableHead>
              {!isMobile && (
                <TableHead className="font-medium text-gray-500 text-xs uppercase">
                  Department
                </TableHead>
              )}
              <TableHead className="font-medium text-gray-500 text-xs uppercase">
                Workflow Name
              </TableHead>
              {!isMobile && (
                <TableHead className="font-medium text-gray-500 text-xs uppercase">
                  # of Nodes
                </TableHead>
              )}
              <TableHead className="font-medium text-gray-500 text-xs uppercase">
                # of Executions
              </TableHead>
              {!isMobile && (
                <TableHead className="font-medium text-gray-500 text-xs uppercase">
                  # of Exceptions
                </TableHead>
              )}
              <TableHead className="font-medium text-gray-500 text-xs uppercase">
                Time Saved
              </TableHead>
              {!isMobile && (
                <TableHead className="font-medium text-gray-500 text-xs uppercase">
                  $ Saved
                </TableHead>
              )}
              <TableHead className="font-medium text-gray-500 text-xs uppercase">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => {
              const dateParts = extractDateParts(client.contractStart);
              
              // Determine department based on workflow name (this is just example logic)
              const department = client.name.includes("Lead") ? "Sales" : "HR";
              
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{dateParts.month}</span>
                      <span className="font-medium">{dateParts.day},</span>
                      <span className="font-medium">{dateParts.year}</span>
                    </div>
                  </TableCell>
                  {!isMobile && <TableCell>{department}</TableCell>}
                  <TableCell className="font-medium text-[#4E86CF]">{client.name}</TableCell>
                  {!isMobile && <TableCell>{client.nodes}</TableCell>}
                  <TableCell className="text-[#4E86CF]">{client.executions}</TableCell>
                  {!isMobile && <TableCell className="text-[#4E86CF]">{client.exceptions}</TableCell>}
                  <TableCell>
                    <div className="flex items-center">
                      <span>{client.timeSaved.split(" ")[0]}</span>
                      <span className="text-xs text-gray-500 ml-1">min</span>
                    </div>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <div className="flex items-center">
                        <span>{client.revenue.split(" ")[0]}</span>
                        <span className="text-xs text-gray-500 ml-1">USD</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-black"></div>
                      <Button variant="link" className="p-0 h-auto text-blue-500">
                        ROI Report
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsTableEnhanced;

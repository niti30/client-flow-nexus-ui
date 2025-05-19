
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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

interface ClientsTableEnhancedProps {
  clients: Client[];
}

const ClientsTableEnhanced = ({ clients }: ClientsTableEnhancedProps) => {
  const isEven = (num: number) => num % 2 === 0;

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer">
                Client Name <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Contract Start <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Workflows <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Nodes <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Executions <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Exceptions <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Revenue <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Time Saved <span>↓</span>
              </TableHead>
              <TableHead className="cursor-pointer">
                Money Saved <span>↓</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-blue-600">{client.name}</TableCell>
                  <TableCell>{client.contractStart}</TableCell>
                  <TableCell>{client.workflows}</TableCell>
                  <TableCell>{client.nodes}</TableCell>
                  <TableCell>{client.executions}</TableCell>
                  <TableCell className="text-blue-600">{client.exceptions}</TableCell>
                  <TableCell>{client.revenue}</TableCell>
                  <TableCell>{client.timeSaved}</TableCell>
                  <TableCell>{client.moneySaved}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsTableEnhanced;

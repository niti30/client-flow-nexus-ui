
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
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer whitespace-nowrap">
              Client Name <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap">
              Contract Start <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
              Workflows <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
              Nodes <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
              Executions <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
              Exceptions <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
              Revenue <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
              Time Saved <span>↓</span>
            </TableHead>
            <TableHead className="cursor-pointer whitespace-nowrap text-center">
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
                <TableCell className="font-medium text-blue-600 whitespace-nowrap">{client.name}</TableCell>
                <TableCell className="whitespace-nowrap">{client.contractStart}</TableCell>
                <TableCell className="text-center">{client.workflows}</TableCell>
                <TableCell className="text-center">{client.nodes}</TableCell>
                <TableCell className="text-center">{client.executions}</TableCell>
                <TableCell className="text-center text-blue-600">{client.exceptions}</TableCell>
                <TableCell className="text-center">{client.revenue}</TableCell>
                <TableCell className="text-center">{client.timeSaved}</TableCell>
                <TableCell className="text-center">{client.moneySaved}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTableEnhanced;

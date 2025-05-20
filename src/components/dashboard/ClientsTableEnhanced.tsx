import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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
  isLoading?: boolean;
}
const ClientsTableEnhanced: React.FC<ClientsTableEnhancedProps> = ({
  clients,
  isLoading = false
}) => {
  if (isLoading) {
    return <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>;
  }
  if (!clients.length) {
    return <div className="p-6 text-center text-gray-500">
        No clients found. Add your first client to get started.
      </div>;
  }
  return <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium">Client Name</TableHead>
          <TableHead className="font-medium">Contract Start</TableHead>
          <TableHead className="font-medium">Workflows</TableHead>
          <TableHead className="font-medium">Nodes</TableHead>
          <TableHead className="font-medium">Executions</TableHead>
          <TableHead className="font-medium">Exceptions</TableHead>
          <TableHead className="font-medium">Revenue</TableHead>
          <TableHead className="font-medium">Time Saved</TableHead>
          <TableHead className="font-medium">Money Saved</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client, index) => <TableRow key={index}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.contractStart}</TableCell>
            <TableCell>{client.workflows}</TableCell>
            <TableCell>{client.nodes}</TableCell>
            <TableCell>{client.executions}</TableCell>
            <TableCell>{client.exceptions}</TableCell>
            <TableCell>{client.revenue}</TableCell>
            <TableCell>{client.timeSaved}</TableCell>
            <TableCell>{client.moneySaved}</TableCell>
            
          </TableRow>)}
      </TableBody>
    </Table>;
};
export default ClientsTableEnhanced;
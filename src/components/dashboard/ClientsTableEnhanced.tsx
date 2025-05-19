
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#FAF9F8]">
          <TableRow>
            <TableHead className="font-bold">
              <div>
                Client
                <br />
                Name
              </div>
            </TableHead>
            <TableHead className="font-bold">
              <div>
                Contract
                <br />
                Start
              </div>
            </TableHead>
            <TableHead className="font-bold">Workflows</TableHead>
            <TableHead className="font-bold">Nodes</TableHead>
            <TableHead className="font-bold">Executions</TableHead>
            <TableHead className="font-bold">Exceptions</TableHead>
            <TableHead className="font-bold">Revenue</TableHead>
            <TableHead className="font-bold">
              <div>
                Time
                <br />
                Saved
              </div>
            </TableHead>
            <TableHead className="font-bold">
              <div>
                Money
                <br />
                Saved
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow key={index}>
              <TableCell className="text-[#4E86CF]">{client.name}</TableCell>
              <TableCell className="text-[#4E86CF]">{client.contractStart}</TableCell>
              <TableCell className="text-[#4E86CF]">{client.workflows}</TableCell>
              <TableCell>{client.nodes}</TableCell>
              <TableCell className="text-[#4E86CF]">{client.executions}</TableCell>
              <TableCell className="text-[#4E86CF]">{client.exceptions}</TableCell>
              <TableCell>{client.revenue}</TableCell>
              <TableCell>{client.timeSaved}</TableCell>
              <TableCell>{client.moneySaved}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTableEnhanced;

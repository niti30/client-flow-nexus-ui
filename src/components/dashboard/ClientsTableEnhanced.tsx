
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const ClientsTableEnhanced: React.FC<ClientsTableEnhancedProps> = ({ clients, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!clients.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No clients found. Add your first client to get started.
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
          <th className="p-4">CLIENT NAME</th>
          <th className="p-4">START DATE</th>
          <th className="p-4">WORKFLOWS</th>
          <th className="p-4">NODES</th>
          <th className="p-4">EXECUTIONS</th>
          <th className="p-4">EXCEPTIONS</th>
          <th className="p-4">ROI</th>
          <th className="p-4">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, index) => (
          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-4 font-medium">{client.name}</td>
            <td className="p-4 text-gray-600">{client.contractStart}</td>
            <td className="p-4">{client.workflows}</td>
            <td className="p-4">{client.nodes}</td>
            <td className="p-4">{client.executions}</td>
            <td className="p-4">{client.exceptions}</td>
            <td className="p-4">
              <div>Revenue: {client.revenue}</div>
              <div>Time Saved: {client.timeSaved}</div>
              <div>Money Saved: {client.moneySaved}</div>
            </td>
            <td className="p-4">
              <Link to={`/clients/${index}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                Details <ChevronRight size={16} />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientsTableEnhanced;

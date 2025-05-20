
import React, { useState } from 'react';
import { ChevronRight, ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
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

type SortKey = keyof Client;
type SortDirection = 'asc' | 'desc';

const ClientsTableEnhanced: React.FC<ClientsTableEnhancedProps> = ({
  clients,
  isLoading = false
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if same key
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Handle different types of values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // For string values like name, revenue (which has $ prefix)
      let aCompare = aValue.replace(/[$,]/g, '');
      let bCompare = bValue.replace(/[$,]/g, '');
      
      if (aCompare < bCompare) return sortDirection === 'asc' ? -1 : 1;
      if (aCompare > bCompare) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      // For numeric values
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      // For time values (which end with 'h')
      let aCompare = aValue?.toString().replace('h', '') || '0';
      let bCompare = bValue?.toString().replace('h', '') || '0';
      
      return sortDirection === 'asc' 
        ? parseFloat(aCompare) - parseFloat(bCompare) 
        : parseFloat(bCompare) - parseFloat(aCompare);
    }
  });

  // Helper to render sort indicators using ChevronUp/Down instead of Arrow
  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline ml-1 h-4 w-4" /> 
      : <ChevronDown className="inline ml-1 h-4 w-4" />;
  };

  return <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('name')}
          >
            CLIENT NAME {renderSortIndicator('name')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('contractStart')}
          >
            CONTRACT START {renderSortIndicator('contractStart')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('workflows')}
          >
            WORKFLOWS {renderSortIndicator('workflows')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('nodes')}
          >
            NODES {renderSortIndicator('nodes')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('executions')}
          >
            EXECUTIONS {renderSortIndicator('executions')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('exceptions')}
          >
            EXCEPTIONS {renderSortIndicator('exceptions')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('revenue')}
          >
            REVENUE {renderSortIndicator('revenue')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('timeSaved')}
          >
            TIME SAVED {renderSortIndicator('timeSaved')}
          </TableHead>
          <TableHead 
            className="font-medium cursor-pointer"
            onClick={() => handleSort('moneySaved')}
          >
            MONEY SAVED {renderSortIndicator('moneySaved')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedClients.map((client, index) => <TableRow key={index}>
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

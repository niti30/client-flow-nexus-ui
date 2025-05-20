
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface UserTableHeaderProps {
  activeTab: "admin" | "se";
  sortConfig: {
    key: string;
    direction: "ascending" | "descending" | null;
  };
  requestSort: (key: string) => void;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  activeTab,
  sortConfig,
  requestSort,
}) => {
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }

    if (sortConfig.direction === "ascending") {
      return <ChevronUp className="inline ml-1 h-4 w-4" />;
    }

    if (sortConfig.direction === "descending") {
      return <ChevronDown className="inline ml-1 h-4 w-4" />;
    }

    return null;
  };

  return (
    <TableHeader className="bg-white">
      <TableRow className="hover:bg-white border-b">
        <TableHead
          className="font-medium text-gray-600 cursor-pointer"
          onClick={() => requestSort("first_name")}
        >
          Name {getSortIcon("first_name")}
        </TableHead>
        <TableHead
          className="font-medium text-gray-600 cursor-pointer"
          onClick={() => requestSort("email")}
        >
          Email {getSortIcon("email")}
        </TableHead>
        <TableHead
          className="font-medium text-gray-600 cursor-pointer"
          onClick={() => requestSort("phone")}
        >
          Phone {getSortIcon("phone")}
        </TableHead>
        {activeTab === "se" && (
          <>
            <TableHead
              className="font-medium text-gray-600 cursor-pointer"
              onClick={() => requestSort("cost_rate")}
            >
              Cost Rate {getSortIcon("cost_rate")}
            </TableHead>
            <TableHead
              className="font-medium text-gray-600 cursor-pointer"
              onClick={() => requestSort("bill_rate")}
            >
              Bill Rate {getSortIcon("bill_rate")}
            </TableHead>
            <TableHead
              className="font-medium text-gray-600 cursor-pointer"
              onClick={() => requestSort("assignedClients")}
            >
              Assigned Clients {getSortIcon("assignedClients")}
            </TableHead>
          </>
        )}
        <TableHead className="font-medium text-gray-600">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

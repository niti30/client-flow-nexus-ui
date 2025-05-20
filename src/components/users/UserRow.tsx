
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { User } from "@/hooks/useUsers";

interface UserRowProps {
  user: User;
  activeTab: "admin" | "se";
  onDelete: (userId: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ 
  user, 
  activeTab, 
  onDelete 
}) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "";
    return `$${value}/hr`;
  };

  return (
    <TableRow key={user.id} className="bg-white">
      <TableCell className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          {user.first_name?.[0] || ""}
          {user.last_name?.[0] || ""}
        </div>
        {`${user.first_name || ""} ${user.last_name || ""}`}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone || "-"}</TableCell>
      {activeTab === "se" && (
        <>
          <TableCell>{formatCurrency(user.cost_rate)}</TableCell>
          <TableCell>{formatCurrency(user.bill_rate)}</TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {user.assigned_clients && user.assigned_clients.length > 0 ? (
                user.assigned_clients.map((client, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs"
                  >
                    {client.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No clients</span>
              )}
            </div>
          </TableCell>
        </>
      )}
      <TableCell>
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800">
            <Edit size={18} />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => onDelete(user.id)}
          >
            <Trash size={18} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

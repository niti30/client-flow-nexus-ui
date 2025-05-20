
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { User } from "@/hooks/useUsers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserRowProps {
  user: User;
  activeTab: "admin" | "se";
  onDelete: (userId: string) => void;
  onEdit: (user: User) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ 
  user, 
  activeTab, 
  onDelete,
  onEdit
}) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return `$${value}/hr`;
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <TableRow className="bg-white hover:bg-gray-50">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-gray-200">
            <AvatarFallback className="text-gray-600 text-sm">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{`${user.first_name || ""} ${user.last_name || ""}`}</span>
        </div>
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
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {client.name}
                  </Badge>
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
          <button 
            className="text-blue-600 hover:text-blue-800"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.first_name} ${user.last_name}`}
          >
            <Edit size={18} />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => onDelete(user.id)}
            aria-label={`Delete ${user.first_name} ${user.last_name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

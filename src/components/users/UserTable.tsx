
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { User } from "@/hooks/useUsers";
import { UserTableHeader } from "./UserTableHeader";
import { UserRow } from "./UserRow";

interface UserTableProps {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  activeTab: "admin" | "se";
  sortConfig: {
    key: string;
    direction: "ascending" | "descending" | null;
  };
  requestSort: (key: string) => void;
  handleDeleteUser: (userId: string) => void;
  handleEditUser: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  filteredUsers, 
  loading, 
  activeTab, 
  sortConfig, 
  requestSort,
  handleDeleteUser,
  handleEditUser
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Table>
      <UserTableHeader 
        activeTab={activeTab} 
        sortConfig={sortConfig} 
        requestSort={requestSort} 
      />
      <TableBody>
        {filteredUsers.length === 0 ? (
          <TableRow>
            <TableCell 
              colSpan={activeTab === "se" ? 7 : 4} 
              className="h-24 text-center text-gray-500"
            >
              No users found. Try a different search or add a new user.
            </TableCell>
          </TableRow>
        ) : (
          filteredUsers.map((user) => (
            <UserRow 
              key={user.id} 
              user={user} 
              activeTab={activeTab} 
              onDelete={handleDeleteUser}
              onEdit={handleEditUser}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

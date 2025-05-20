
import React from "react";
import { AddUserDialog } from "@/components/dialogs/AddUserDialog";

interface UserHeaderProps {
  activeTab: "admin" | "se";
  refreshUsers: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  activeTab,
  refreshUsers,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
      <AddUserDialog
        userRole={activeTab}
        onUserAdded={refreshUsers}
        buttonVariant="outline"
        buttonClassName="bg-white hover:bg-gray-100"
      />
    </div>
  );
};

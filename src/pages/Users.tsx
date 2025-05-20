
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { UserHeader } from "@/components/users/UserHeader";
import { UserFilters } from "@/components/users/UserFilters";
import { UserTable } from "@/components/users/UserTable";
import { supabase } from "@/integrations/supabase/client";

const Users = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "se">("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({
    key: "",
    direction: null,
  });

  // Use the hook to fetch users based on active tab
  const { users, loading, refreshUsers } = useUsers(activeTab);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key || sortConfig.direction === null) {
      return users;
    }

    return [...users].sort((a, b) => {
      // Handle nested properties like "assigned_clients"
      if (sortConfig.key === "assignedClients") {
        const aLength = a.assigned_clients?.length || 0;
        const bLength = b.assigned_clients?.length || 0;

        if (sortConfig.direction === "ascending") {
          return aLength - bLength;
        } else {
          return bLength - aLength;
        }
      }

      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortConfig.direction === "ascending") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        if (sortConfig.direction === "ascending") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }

      return 0;
    });
  };

  const sortedUsers = getSortedData();

  const filteredUsers = sortedUsers.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const fullName = `${user.first_name || ""} ${
      user.last_name || ""
    }`.toLowerCase();

    return (
      fullName.includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone?.toLowerCase() || "").includes(query) ||
      (user.cost_rate?.toString() || "").includes(query) ||
      (user.bill_rate?.toString() || "").includes(query)
    );
  });

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", userId);

        if (error) throw error;

        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        });
        
        refreshUsers();
      } catch (error: any) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col space-y-4 mb-6">
              <UserHeader activeTab={activeTab} refreshUsers={refreshUsers} />
              
              <UserFilters
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                refreshUsers={refreshUsers}
              />
            </div>

            <Card className="shadow-sm">
              <UserTable
                users={users}
                filteredUsers={filteredUsers}
                loading={loading}
                activeTab={activeTab}
                sortConfig={sortConfig}
                requestSort={requestSort}
                handleDeleteUser={handleDeleteUser}
              />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;

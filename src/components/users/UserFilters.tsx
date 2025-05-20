
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AddUserDialog } from "@/components/dialogs/AddUserDialog";

interface UserFiltersProps {
  activeTab: "admin" | "se";
  setActiveTab: (tab: "admin" | "se") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshUsers: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  refreshUsers,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <ToggleGroup
        type="single"
        value={activeTab}
        onValueChange={(value) => value && setActiveTab(value as "admin" | "se")}
      >
        <ToggleGroupItem
          value="admin"
          aria-label="Admin Users"
          className={activeTab === "admin" ? "bg-black text-white" : ""}
        >
          Admin Users
        </ToggleGroupItem>
        <ToggleGroupItem
          value="se"
          aria-label="SE Users"
          className={activeTab === "se" ? "bg-black text-white" : ""}
        >
          SE Users
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="relative w-full md:w-auto max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2 w-full"
        />
      </div>
    </div>
  );
};

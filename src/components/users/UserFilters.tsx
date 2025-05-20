
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "admin" || value === "se") {
      setActiveTab(value);
      // Clear search when switching tabs
      setSearchQuery("");
      // Refresh users when changing tabs to ensure we get the latest data
      refreshUsers();
    }
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <ToggleGroup
        type="single"
        value={activeTab}
        onValueChange={(value) => value && handleTabChange(value)}
        className="border rounded-lg"
      >
        <ToggleGroupItem
          value="admin"
          aria-label="Admin Users"
          className={`${activeTab === "admin" ? "bg-black text-white" : "bg-white"} rounded-l-lg`}
        >
          Admin Users
        </ToggleGroupItem>
        <ToggleGroupItem
          value="se"
          aria-label="SE Users"
          className={`${activeTab === "se" ? "bg-black text-white" : "bg-white"} rounded-r-lg`}
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
          className="pl-9 pr-4 py-2 w-full bg-white"
        />
      </div>
    </div>
  );
};

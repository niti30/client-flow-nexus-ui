
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const handleTabChange = (value: "admin" | "se") => {
    setActiveTab(value);
    // Clear search when switching tabs
    setSearchQuery("");
    // Refresh users when changing tabs to ensure we get the latest data
    refreshUsers();
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="inline-flex rounded-full border border-gray-200 p-1">
        <Button
          type="button"
          className={`px-4 py-1 rounded-full font-medium transition ${
            activeTab === "admin"
              ? "bg-black text-white"
              : "border-0 text-black bg-white hover:bg-gray-50"
          }`}
          onClick={() => handleTabChange("admin")}
        >
          Admin Users
        </Button>
        
        <Button
          type="button"
          className={`px-4 py-1 rounded-full font-medium transition ${
            activeTab === "se"
              ? "bg-black text-white"
              : "border-0 text-black bg-white hover:bg-gray-50"
          }`}
          onClick={() => handleTabChange("se")}
        >
          SE Users
        </Button>
      </div>

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

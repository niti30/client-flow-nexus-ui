
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ChevronUp, ChevronDown, Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { AddUserDialog } from "@/components/dialogs/AddUserDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Users = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "se">("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: "",
    direction: null
  });
  
  // Use the new hook to fetch users based on active tab
  const { users, loading, refreshUsers } = useUsers(activeTab);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
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
        
        if (sortConfig.direction === 'ascending') {
          return aLength - bLength;
        } else {
          return bLength - aLength;
        }
      }
      
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortConfig.direction === 'ascending') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortConfig.direction === 'ascending') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
      
      return 0;
    });
  };

  const sortedUsers = getSortedData();
  
  const filteredUsers = sortedUsers.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    
    return (
      fullName.includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone?.toLowerCase() || '').includes(query) ||
      (user.cost_rate?.toString() || '').includes(query) ||
      (user.bill_rate?.toString() || '').includes(query)
    );
  });

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    
    if (sortConfig.direction === 'ascending') {
      return <ChevronUp className="inline ml-1 h-4 w-4" />;
    }
    
    if (sortConfig.direction === 'descending') {
      return <ChevronDown className="inline ml-1 h-4 w-4" />;
    }
    
    return null;
  };
  
  const formatCurrency = (value: number | null) => {
    if (value === null) return "";
    return `$${value}/hr`;
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // TODO: Implement user deletion logic with Supabase
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
      refreshUsers();
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
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
                <AddUserDialog 
                  userRole={activeTab} 
                  onUserAdded={refreshUsers} 
                  buttonVariant="outline" 
                  buttonClassName="bg-white hover:bg-gray-100"
                />
              </div>
              
              <div className="flex justify-between items-center flex-wrap gap-4">
                <ToggleGroup type="single" value={activeTab} onValueChange={(value) => value && setActiveTab(value as "admin" | "se")}>
                  <ToggleGroupItem value="admin" aria-label="Admin Users" className={activeTab === "admin" ? "bg-black text-white" : ""}>
                    Admin Users
                  </ToggleGroupItem>
                  <ToggleGroupItem value="se" aria-label="SE Users" className={activeTab === "se" ? "bg-black text-white" : ""}>
                    SE Users
                  </ToggleGroupItem>
                </ToggleGroup>
                
                <div className="relative w-full md:w-auto max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full"
                  />
                </div>
              </div>
            </div>
            
            <Card className="shadow-sm">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-white">
                    <TableRow className="hover:bg-white border-b">
                      <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('first_name')}>
                        Name {getSortIcon('first_name')}
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('email')}>
                        Email {getSortIcon('email')}
                      </TableHead>
                      <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('phone')}>
                        Phone {getSortIcon('phone')}
                      </TableHead>
                      {activeTab === "se" && (
                        <>
                          <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('cost_rate')}>
                            Cost Rate {getSortIcon('cost_rate')}
                          </TableHead>
                          <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('bill_rate')}>
                            Bill Rate {getSortIcon('bill_rate')}
                          </TableHead>
                          <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('assignedClients')}>
                            Assigned Clients {getSortIcon('assignedClients')}
                          </TableHead>
                        </>
                      )}
                      <TableHead className="font-medium text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
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
                        <TableRow key={user.id} className="bg-white">
                          <TableCell className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              {user.first_name?.[0] || ''}
                              {user.last_name?.[0] || ''}
                            </div>
                            {`${user.first_name || ''} ${user.last_name || ''}`}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          {activeTab === "se" && (
                            <>
                              <TableCell>{formatCurrency(user.cost_rate)}</TableCell>
                              <TableCell>{formatCurrency(user.bill_rate)}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {user.assigned_clients && user.assigned_clients.length > 0 ? (
                                    user.assigned_clients.map((client, idx) => (
                                      <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs">
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
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;

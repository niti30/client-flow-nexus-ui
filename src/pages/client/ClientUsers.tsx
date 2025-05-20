
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ClientUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: "",
    direction: null
  });
  
  // Sample user data - this would be replaced with actual data from API
  const users = [
    { 
      name: "John Smith", 
      email: "john@example.com", 
      phone: "+1 234 567 8900",
      department: "Sales",
      role: "Manager"
    },
    { 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "+1 234 567 8901",
      department: "Marketing",
      role: "Specialist"
    },
    { 
      name: "Robert Johnson", 
      email: "robert@example.com", 
      phone: "+1 234 567 8902",
      department: "IT",
      role: "Administrator"
    },
  ];

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
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortConfig.direction === 'ascending') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });
  };

  const sortedUsers = getSortedData();
  
  const filteredUsers = sortedUsers.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
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

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">User Management</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full max-w-xs"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                <Button className="bg-black hover:bg-gray-800">
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            
            <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium cursor-pointer" onClick={() => requestSort('name')}>
                        Name {getSortIcon('name')}
                      </TableHead>
                      <TableHead className="font-medium cursor-pointer" onClick={() => requestSort('email')}>
                        Email {getSortIcon('email')}
                      </TableHead>
                      <TableHead className="font-medium cursor-pointer" onClick={() => requestSort('phone')}>
                        Phone {getSortIcon('phone')}
                      </TableHead>
                      <TableHead className="font-medium cursor-pointer" onClick={() => requestSort('department')}>
                        Department {getSortIcon('department')}
                      </TableHead>
                      <TableHead className="font-medium cursor-pointer" onClick={() => requestSort('role')}>
                        Role {getSortIcon('role')}
                      </TableHead>
                      <TableHead className="font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientUsers;

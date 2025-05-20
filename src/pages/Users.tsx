
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
import { Plus, Edit, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Users = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: "",
    direction: null
  });
  
  // Sample user data
  const users = [
    { 
      name: "John Smith", 
      email: "john@example.com", 
      phone: "+1 234 567 8900",
      costRate: "$75/hr",
      billRate: "$150/hr",
      assignedClients: ["Client A", "Client B"]
    },
    { 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "+1 234 567 8901",
      costRate: "$65/hr",
      billRate: "$130/hr",
      assignedClients: ["Client C"]
    },
    { 
      name: "Robert Johnson", 
      email: "robert@example.com", 
      phone: "+1 234 567 8902",
      costRate: "$80/hr",
      billRate: "$160/hr",
      assignedClients: ["Client A", "Client D", "Client E"]
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
  
  const handleAddUser = () => {
    toast({
      title: "Feature coming soon",
      description: "Add user functionality will be available soon",
    });
  };

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
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
                <Button onClick={handleAddUser} className="bg-black hover:bg-gray-800">
                  <Plus size={16} className="mr-2" />
                  Add New User
                </Button>
              </div>
              
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab("admin")}
                    className={`px-4 py-2 rounded-md font-medium ${
                      activeTab === "admin" 
                        ? "bg-black text-white" 
                        : "bg-white text-black border border-gray-200"
                    }`}
                  >
                    Admin Users
                  </button>
                  <button 
                    onClick={() => setActiveTab("se")}
                    className={`px-4 py-2 rounded-md font-medium ${
                      activeTab === "se" 
                        ? "bg-black text-white" 
                        : "bg-white text-black border border-gray-200"
                    }`}
                  >
                    SE Users
                  </button>
                </div>
                
                <div className="relative w-full md:w-auto max-w-md">
                  <Input 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </span>
                </div>
              </div>
            </div>
            
            <Card className="shadow-sm">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="hover:bg-white border-b">
                    <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('name')}>
                      Name {getSortIcon('name')}
                    </TableHead>
                    <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('email')}>
                      Email {getSortIcon('email')}
                    </TableHead>
                    <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('phone')}>
                      Phone {getSortIcon('phone')}
                    </TableHead>
                    <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('costRate')}>
                      Cost Rate {getSortIcon('costRate')}
                    </TableHead>
                    <TableHead className="font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('billRate')}>
                      Bill Rate {getSortIcon('billRate')}
                    </TableHead>
                    <TableHead className="font-medium text-gray-600">Assigned Clients</TableHead>
                    <TableHead className="font-medium text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user, index) => (
                    <TableRow key={index} className="bg-white">
                      <TableCell className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.costRate}</TableCell>
                      <TableCell>{user.billRate}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.assignedClients.map((client, idx) => (
                            <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs">
                              {client}
                            </span>
                          ))}
                        </div>
                      </TableCell>
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
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;

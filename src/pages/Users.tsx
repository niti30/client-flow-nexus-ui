
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
import { Plus, Search, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Users = () => {
  const [activeTab, setActiveTab] = useState("admin");
  
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

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col space-y-4 mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
              
              <div className="flex justify-between items-center">
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
                
                <Button className="bg-black hover:bg-gray-800">
                  <Plus size={16} className="mr-2" />
                  Add New User
                </Button>
              </div>
            </div>
            
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-white">
                    <TableRow className="hover:bg-white border-b">
                      <TableHead className="font-medium text-gray-600">Name</TableHead>
                      <TableHead className="font-medium text-gray-600">Email</TableHead>
                      <TableHead className="font-medium text-gray-600">Phone</TableHead>
                      <TableHead className="font-medium text-gray-600">Cost Rate</TableHead>
                      <TableHead className="font-medium text-gray-600">Bill Rate</TableHead>
                      <TableHead className="font-medium text-gray-600">Assigned Clients</TableHead>
                      <TableHead className="font-medium text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;

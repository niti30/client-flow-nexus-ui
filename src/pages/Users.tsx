
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
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Users = () => {
  // Sample user data
  const users = [
    { name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2 hours ago" },
    { name: "Jane Smith", email: "jane@example.com", role: "Editor", lastActive: "1 day ago" },
    { name: "Robert Johnson", email: "robert@example.com", role: "Viewer", lastActive: "3 days ago" },
  ];

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
              <Button className="bg-[#141417] hover:bg-black">
                <Plus size={16} className="mr-2" />
                Add User
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-[#FAF9F8]">
                    <TableRow className="hover:bg-[#FAF9F8]">
                      <TableHead className="font-bold text-black">Name</TableHead>
                      <TableHead className="font-bold text-black">Email</TableHead>
                      <TableHead className="font-bold text-black">Role</TableHead>
                      <TableHead className="font-bold text-black">Last Active</TableHead>
                      <TableHead className="font-bold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
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

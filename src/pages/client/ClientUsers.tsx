import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define the user type - ensuring all required properties are clearly marked
interface User {
  id: string;
  name: string; // This is required
  email: string;
  phone: string;
  department: string;
  role: string;
}

// Form schema for adding/editing users
const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number"
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters"
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters"
  })
});
type UserFormValues = z.infer<typeof userFormSchema>;
const ClientUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: "",
    direction: null
  });

  // State for user management
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Set up forms
  const addForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      role: ""
    }
  });
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      role: ""
    }
  });

  // Sample user data
  const fetchedUsers = [{
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    department: "Sales",
    role: "Manager"
  }, {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8901",
    department: "Marketing",
    role: "Specialist"
  }, {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 234 567 8902",
    department: "IT",
    role: "Administrator"
  }];

  // Fetch users
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['clientUsers'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchedUsers;
    }
  });

  // Update users when data changes
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // Sort functionality
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({
      key,
      direction
    });
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
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.phone.toLowerCase().includes(query) || user.department.toLowerCase().includes(query) || user.role.toLowerCase().includes(query);
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

  // User management handlers
  const handleAddUser = (values: UserFormValues) => {
    // Fix: Ensure that we're creating a complete User object with all required properties
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      department: values.department,
      role: values.role
    };
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    addForm.reset();
    toast.success("User added successfully");
  };
  const handleEditUser = (values: UserFormValues) => {
    if (!selectedUser) return;

    // Fix: Create a complete updated user object with all required properties
    const updatedUser: User = {
      ...selectedUser,
      name: values.name,
      email: values.email,
      phone: values.phone,
      department: values.department,
      role: values.role
    };
    const updatedUsers = users.map(user => user.id === selectedUser.id ? updatedUser : user);
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    editForm.reset();
    toast.success("User updated successfully");
  };
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    toast.success("User deleted successfully");
  };
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      role: user.role
    });
    setIsEditDialogOpen(true);
  };
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  return <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">User Management</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-full max-w-xs" />
                </div>
                
                <Button variant="outline" onClick={() => setIsAddDialogOpen(true)} className="bg-slate-950 hover:bg-slate-800 text-slate-50">
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
                    {isLoading ? Array(3).fill(0).map((_, index) => <TableRow key={index}>
                          <TableCell colSpan={6}>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                          </TableCell>
                        </TableRow>) : filteredUsers.length === 0 ? <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow> : filteredUsers.map(user => <TableRow key={user.id}>
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
                              <button className="text-blue-600 hover:text-blue-800" onClick={() => openEditDialog(user)}>
                                <Edit size={18} />
                              </button>
                              <button className="text-red-600 hover:text-red-800" onClick={() => openDeleteDialog(user)}>
                                <Trash size={18} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new user to your organization. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField control={addForm.control} name="name" render={({
              field
            }) => <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={addForm.control} name="email" render={({
              field
            }) => <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={addForm.control} name="phone" render={({
              field
            }) => <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={addForm.control} name="department" render={({
              field
            }) => <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Sales" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={addForm.control} name="role" render={({
              field
            }) => <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Manager" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField control={editForm.control} name="name" render={({
              field
            }) => <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={editForm.control} name="email" render={({
              field
            }) => <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={editForm.control} name="phone" render={({
              field
            }) => <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={editForm.control} name="department" render={({
              field
            }) => <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <FormField control={editForm.control} name="role" render={({
              field
            }) => <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>} />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedUser && <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-md">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default ClientUsers;
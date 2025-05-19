
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AddClientDialogProps {
  buttonClassName?: string;
  className?: string;
  onClientAdded?: () => void;
  children?: React.ReactNode;
}

export function AddClientDialog({ buttonClassName, className, onClientAdded, children }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      
      // Save the client to Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert([{ 
          name: companyName,
          status: 'active',
          // You could save other fields as well
        }])
        .select();

      if (error) {
        console.error("Error adding client:", error);
        toast({
          title: "Error adding client",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const clientId = data?.[0]?.id;
      
      // Save departments, users, engineers, etc. in real implementation
      
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={buttonClassName || className}>
            <Plus size={16} className="mr-2" />
            Add Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the details for the new client. Click Create Client when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                />
              </div>
              
              <div>
                <Label htmlFor="companyUrl">Company URL*</Label>
                <Input 
                  id="companyUrl" 
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://" 
                />
              </div>
            </div>
            
            {/* Users Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Users</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-500">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Phone</div>
                  <div>Department</div>
                  <div className="flex justify-between">
                    <div>Exceptions</div>
                    <div>Access</div>
                  </div>
                </div>
                
                {users.map((user, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    <Input 
                      placeholder="Full name" 
                      value={user.name}
                      onChange={(e) => updateUser(index, 'name', e.target.value)}
                    />
                    <Input 
                      placeholder="Email" 
                      value={user.email}
                      onChange={(e) => updateUser(index, 'email', e.target.value)}
                    />
                    <Input 
                      placeholder="Phone" 
                      value={user.phone}
                      onChange={(e) => updateUser(index, 'phone', e.target.value)}
                    />
                    <select 
                      className="border rounded p-2 w-full bg-white"
                      value={user.department}
                      onChange={(e) => updateUser(index, 'department', e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.filter(d => d).map((dept, i) => (
                        <option key={i} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={`email-${index}`} 
                          checked={user.notifications.email}
                          onCheckedChange={(checked) => 
                            updateUser(index, 'notifications.email', checked === true)
                          }
                        />
                        <Label htmlFor={`email-${index}`}>Email</Label>
                        
                        <Checkbox 
                          id={`sms-${index}`} 
                          checked={user.notifications.sms}
                          onCheckedChange={(checked) => 
                            updateUser(index, 'notifications.sms', checked === true)
                          }
                        />
                        <Label htmlFor={`sms-${index}`}>SMS</Label>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox 
                          id={`billing-${index}`} 
                          checked={user.access.billing}
                          onCheckedChange={(checked) => 
                            updateUser(index, 'access.billing', checked === true)
                          }
                        />
                        <Label htmlFor={`billing-${index}`}>Billing Access</Label>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Checkbox 
                          id={`admin-${index}`} 
                          checked={user.access.admin}
                          onCheckedChange={(checked) => 
                            updateUser(index, 'access.admin', checked === true)
                          }
                        />
                        <Label htmlFor={`admin-${index}`}>Admin Access</Label>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={addUser}
                >
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Departments Section */}
            <div>
              <h3 className="text-sm font-medium mb-4">Manage Departments</h3>
              
              <div className="space-y-3">
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
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeDepartment(index)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={addDepartment}
                >
                  <Plus size={16} className="mr-2" />
                  Add Department
                </Button>
              </div>
            </div>
            
            {/* Solutions Engineers Section */}
            <div className="mt-10">
              <h3 className="text-sm font-medium mb-4">Assign Solutions Engineers</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Actions</div>
                </div>
                
                {engineers.map((engineer, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <select 
                      className="border rounded p-2 w-full bg-white"
                      value={engineer.name}
                      onChange={(e) => updateEngineer(index, 'name', e.target.value)}
                    >
                      <option value="">Select SE</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Robert Johnson">Robert Johnson</option>
                    </select>
                    <Input 
                      value={engineer.email || 'email@example.com'} 
                      disabled
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeEngineer(index)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={addEngineer}
                >
                  <Plus size={16} className="mr-2" />
                  Add Solutions Engineer
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-4 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800"
          >
            {isSubmitting ? "Creating..." : "Create Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

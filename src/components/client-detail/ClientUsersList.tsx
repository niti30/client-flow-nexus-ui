
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  billing: boolean;
  admin: boolean;
  notes: string;
}

interface ClientUsersListProps {
  clientId: string;
  showDialog?: boolean;
  onDialogClose?: () => void;
}

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  billing: z.boolean().default(false),
  admin: z.boolean().default(false),
  notes: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function ClientUsersList({ clientId, showDialog = false, onDialogClose }: ClientUsersListProps) {
  const [open, setOpen] = useState(showDialog);
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'Robert Wilson', 
      email: 'robert@company.com', 
      phone: '+1 555-0123', 
      billing: true, 
      admin: true, 
      notes: 'Primary contact' 
    },
    { 
      id: '2', 
      name: 'Emily Brown', 
      email: 'emily@company.com', 
      phone: '+1 555-0124', 
      billing: false, 
      admin: false, 
      notes: 'Technical lead' 
    },
  ]);
  
  const { toast } = useToast();
  
  // Update dialog open state when showDialog prop changes
  useEffect(() => {
    setOpen(showDialog);
  }, [showDialog]);
  
  // Handle dialog close
  const handleDialogClose = () => {
    setOpen(false);
    if (onDialogClose) {
      onDialogClose();
    }
  };
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      billing: false,
      admin: false,
      notes: "",
    },
  });

  const onSubmit = (values: UserFormValues) => {
    // Create a new user with all required properties
    const newUser: User = {
      id: Date.now().toString(),
      name: values.name,         // Required by schema
      email: values.email,       // Required by schema
      phone: values.phone || "", // Convert optional to required with empty string fallback
      billing: values.billing,   
      admin: values.admin,
      notes: values.notes || "", // Convert optional to required with empty string fallback
    };
    
    setUsers([...users, newUser]);
    toast({
      title: "User Added",
      description: `${values.name} has been added to client users.`,
    });
    handleDialogClose();
    form.reset();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.billing ? <Check className="h-5 w-5 text-green-500" /> : <Minus className="h-5 w-5 text-gray-300" />}
                </TableCell>
                <TableCell>
                  {user.admin ? <Check className="h-5 w-5 text-green-500" /> : <Minus className="h-5 w-5 text-gray-300" />}
                </TableCell>
                <TableCell>{user.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && onDialogClose) onDialogClose();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Client User</DialogTitle>
            <DialogDescription>
              Add a new user for this client. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555-0000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="billing"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Billing Contact</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="admin"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Admin</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional notes" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">Save User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

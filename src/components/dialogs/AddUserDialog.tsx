
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddUserDialogProps {
  userRole: "admin" | "se";
  onUserAdded?: () => void;
  buttonVariant?: "default" | "outline" | "secondary";
  buttonClassName?: string;
}

const formSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  cost_rate: z.coerce.number().optional(),
  bill_rate: z.coerce.number().optional(),
  role: z.enum(["admin", "se"]),
  assigned_clients: z.array(z.string()).optional(),
});

export function AddUserDialog({ 
  userRole, 
  onUserAdded, 
  buttonVariant = "default", 
  buttonClassName = "" 
}: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  // Set up form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      cost_rate: undefined,
      bill_rate: undefined,
      role: userRole,
      assigned_clients: [],
    },
  });

  // Fetch clients for SE user role
  useEffect(() => {
    if (userRole === "se" && open) {
      const fetchClients = async () => {
        try {
          const { data, error } = await supabase
            .from("clients")
            .select("id, name")
            .order("name");

          if (error) {
            console.error("Error fetching clients:", error);
            toast({
              title: "Error",
              description: "Failed to load clients. Please try again.",
              variant: "destructive",
            });
            setClients([]);
          } else {
            setClients(data || []);
          }
        } catch (err) {
          console.error("Error in fetchClients:", err);
          setClients([]);
          toast({
            title: "Error",
            description: "Failed to load clients. Please try again.",
            variant: "destructive",
          });
        }
      };

      fetchClients();
    }
  }, [userRole, open, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Add user to the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          role: values.role,
          cost_rate: values.role === "se" ? values.cost_rate : null,
          bill_rate: values.role === "se" ? values.bill_rate : null,
        })
        .select()
        .single();

      if (userError) throw userError;

      // If SE user, add client assignments
      if (values.role === "se" && selectedClients.length > 0 && userData) {
        const clientAssignments = selectedClients.map(clientId => ({
          user_id: userData.id,
          client_id: clientId
        }));

        const { error: assignmentError } = await supabase
          .from("user_client_assignments")
          .insert(clientAssignments);

        if (assignmentError) throw assignmentError;
      }

      toast({
        title: "Success",
        description: "User added successfully",
      });

      // Reset form and close dialog
      form.reset();
      setSelectedClients([]);
      setOpen(false);
      
      // Trigger refresh of user list
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Safely handle client selection and deselection
  const handleClientSelection = (clientId: string) => {
    setSelectedClients((prev) => {
      const isSelected = prev.includes(clientId);
      const updatedSelection = isSelected
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId];
      
      // Update the form value
      form.setValue("assigned_clients", updatedSelection);
      
      return updatedSelection;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          <Plus size={16} className="mr-2" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New {userRole === "admin" ? "Admin" : "SE"} User</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new {userRole === "admin" ? "admin" : "solutions engineer"} user.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {userRole === "se" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cost_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Rate ($/hr)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bill_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Rate ($/hr)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="assigned_clients"
                  render={() => (
                    <FormItem>
                      <FormLabel>Assigned Clients</FormLabel>
                      <FormControl>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                              disabled={clients.length === 0}
                            >
                              {selectedClients.length > 0
                                ? `${selectedClients.length} client${selectedClients.length > 1 ? "s" : ""} selected`
                                : "Select clients..."}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            {clients.length > 0 ? (
                              <Command>
                                <CommandInput placeholder="Search clients..." />
                                <CommandEmpty>No clients found.</CommandEmpty>
                                <ScrollArea className="h-52">
                                  <CommandGroup>
                                    {clients.map((client) => (
                                      <CommandItem
                                        key={client.id}
                                        onSelect={() => handleClientSelection(client.id)}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={selectedClients.includes(client.id)}
                                            onCheckedChange={() => handleClientSelection(client.id)}
                                          />
                                          <span>{client.name}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </Command>
                            ) : (
                              <div className="p-4 text-center text-sm">
                                No clients available to assign.
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

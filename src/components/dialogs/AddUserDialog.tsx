
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { UserInfoFields } from "./user/UserInfoFields";
import { SESpecificFields } from "./user/SESpecificFields";

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
  assigned_clients: z.array(z.string()).default([]),
});

export function AddUserDialog({ 
  userRole, 
  onUserAdded, 
  buttonVariant = "default", 
  buttonClassName = "" 
}: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
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
          setClientsLoading(true);
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
        } finally {
          setClientsLoading(false);
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

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserInfoFields />

            {userRole === "se" && (
              <SESpecificFields 
                clients={clients} 
                selectedClients={selectedClients}
                setSelectedClients={setSelectedClients}
                clientsLoading={clientsLoading}
                popoverOpen={popoverOpen}
                setPopoverOpen={setPopoverOpen}
              />
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}


import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserInfoFields } from "./user/UserInfoFields";
import { SESpecificFields } from "./user/SESpecificFields";
import { User } from "@/hooks/useUsers";

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
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

export function EditUserDialog({ 
  user, 
  isOpen, 
  onClose, 
  onUserUpdated 
}: EditUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  // Set up form with validation and default values from the user
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      phone: user.phone || "",
      cost_rate: user.cost_rate,
      bill_rate: user.bill_rate,
      role: user.role,
      assigned_clients: user.assigned_clients?.map(client => client.client_id) || [],
    },
  });

  // Set selected clients when user data is loaded
  useEffect(() => {
    if (user.assigned_clients && user.assigned_clients.length > 0) {
      setSelectedClients(user.assigned_clients.map(client => client.client_id));
    }
  }, [user]);

  // Fetch clients for SE user role
  useEffect(() => {
    if (user.role === "se" && isOpen) {
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
        } finally {
          setClientsLoading(false);
        }
      };

      fetchClients();
    }
  }, [user.role, isOpen, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Update user in the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          role: values.role,
          cost_rate: values.role === "se" ? values.cost_rate : null,
          bill_rate: values.role === "se" ? values.bill_rate : null,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (userError) throw userError;

      // If SE user, update client assignments
      if (values.role === "se") {
        // First delete all existing assignments
        const { error: deleteError } = await supabase
          .from("user_client_assignments")
          .delete()
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        // Then add new assignments if any selected
        if (selectedClients.length > 0) {
          const clientAssignments = selectedClients.map(clientId => ({
            user_id: user.id,
            client_id: clientId
          }));

          const { error: assignmentError } = await supabase
            .from("user_client_assignments")
            .insert(clientAssignments);

          if (assignmentError) throw assignmentError;
        }
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      // Close dialog
      onClose();
      
      // Trigger refresh of user list
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the details for this user.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserInfoFields />

            {user.role === "se" && (
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
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

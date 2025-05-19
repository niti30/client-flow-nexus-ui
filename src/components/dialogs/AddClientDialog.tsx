
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddClientForm, ClientFormValues } from "../forms/AddClientForm";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddClientDialogProps {
  buttonClassName?: string;
  className?: string;
  onClientAdded?: () => void;
  children?: React.ReactNode; // Added children prop
}

export function AddClientDialog({ buttonClassName, className, onClientAdded, children }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("New client:", values);
      
      // Prepare client data object
      const clientData: any = { 
        name: values.name,
        status: 'active',
        industry: null // This could be added to the form later
      };
      
      // Only add email if it's provided and not empty
      if (values.email) {
        clientData.email = values.email;
      }
      
      // Save the client to Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
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

      toast({
        title: "Client added successfully",
        description: `${values.name} has been added with contract start date: ${values.contractStart.toLocaleDateString()}`,
      });
      
      setOpen(false);
      
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the details for the new client. Click Add Client when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddClientForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}


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

interface AddClientDialogProps {
  buttonClassName?: string;
  className?: string;
}

export function AddClientDialog({ buttonClassName, className }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (values: ClientFormValues) => {
    console.log("New client:", values);
    // Here you would typically make an API call to create the client
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName || className}>
          <Plus size={16} className="mr-2" />
          Add Client
        </Button>
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
        />
      </DialogContent>
    </Dialog>
  );
}

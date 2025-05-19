
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
import { AddWorkflowForm, WorkflowFormValues } from "../forms/AddWorkflowForm";

interface AddWorkflowDialogProps {
  buttonClassName?: string;
}

export function AddWorkflowDialog({ buttonClassName }: AddWorkflowDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (values: WorkflowFormValues) => {
    console.log("New workflow:", values);
    // Here you would typically make an API call to create the workflow
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>
          <Plus size={16} className="mr-2" />
          Add Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Workflow</DialogTitle>
          <DialogDescription>
            Enter the details for the new workflow. Click Add Workflow when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddWorkflowForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}

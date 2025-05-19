
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
import { useToast } from "@/hooks/use-toast";

interface AddWorkflowDialogProps {
  buttonClassName?: string;
  onWorkflowAdded?: (workflow: WorkflowFormValues) => void;
  children?: React.ReactNode; // Added children prop
}

export function AddWorkflowDialog({ buttonClassName, onWorkflowAdded, children }: AddWorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (values: WorkflowFormValues) => {
    console.log("New workflow:", values);
    // Here you would typically make an API call to create the workflow
    
    toast({
      title: "Workflow Created",
      description: `${values.name} workflow has been created successfully.`,
    });
    
    if (onWorkflowAdded) {
      onWorkflowAdded(values);
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={buttonClassName}>
            <Plus size={16} className="mr-2" />
            Add Workflow
          </Button>
        )}
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

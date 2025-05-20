
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddWorkflowForm, WorkflowFormValues } from "@/components/forms/AddWorkflowForm";
import { PlusCircle } from "lucide-react";
import { useWorkflowActions } from "@/hooks/useWorkflowActions";
import { Workflow } from "@/types/workflow";

interface AddWorkflowDialogProps {
  clientId: string;
  onWorkflowAdded?: (workflow?: Workflow) => void;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  children?: React.ReactNode;
}

export function AddWorkflowDialog({ 
  clientId, 
  onWorkflowAdded,
  buttonText = "Add Workflow", 
  buttonVariant = "default",
  className,
  children
}: AddWorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const { addWorkflow, isSubmitting } = useWorkflowActions();

  const handleSubmit = async (values: WorkflowFormValues) => {
    const result = await addWorkflow(values, clientId, (workflow) => {
      setOpen(false);
      if (onWorkflowAdded && workflow) {
        onWorkflowAdded(workflow);
      }
    });
    
    // Dialog will be closed by the callback if successful
    return !!result;
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={buttonVariant} className={className}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Workflow</DialogTitle>
        </DialogHeader>
        <AddWorkflowForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

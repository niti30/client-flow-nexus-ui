
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
import { supabase } from "@/integrations/supabase/client";

export interface Workflow {
  id: string;
  name: string;
  department: string;
  description?: string;
  created_at: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved: string;
  moneySaved: string;
  status: string;
}

interface AddWorkflowDialogProps {
  buttonClassName?: string;
  onWorkflowAdded?: (workflow: Workflow) => void;
  children?: React.ReactNode;
  clientId?: string;
}

export function AddWorkflowDialog({ 
  buttonClassName, 
  onWorkflowAdded, 
  children,
  clientId 
}: AddWorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: WorkflowFormValues) => {
    setIsSubmitting(true);
    console.log("New workflow:", values);
    
    try {
      // In a real app, this would be an API call to create the workflow
      // For now, we'll simulate the database insert
      
      // Create a workflow object with default values for the fields
      const newWorkflow: Workflow = {
        id: Date.now().toString(), // In real app, this would come from DB
        name: values.name,
        department: values.department,
        description: values.description,
        created_at: new Date().toISOString(),
        nodes: 0,
        executions: 0,
        exceptions: 0,
        timeSaved: '0',
        moneySaved: '0',
        status: 'active'
      };
      
      // In a real app with Supabase, you would do:
      // const { data, error } = await supabase
      //   .from('workflows')
      //   .insert({
      //     name: values.name,
      //     department: values.department,
      //     description: values.description,
      //     client_id: clientId || null
      //   })
      //   .select()
      //   .single();
      
      toast({
        title: "Workflow Created",
        description: `${values.name} workflow has been created successfully.`,
      });
      
      if (onWorkflowAdded) {
        onWorkflowAdded(newWorkflow);
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Error creating workflow:", error);
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
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
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

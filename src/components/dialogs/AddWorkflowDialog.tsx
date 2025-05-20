
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
    console.log("New workflow values:", values);
    
    try {
      if (!clientId) {
        throw new Error("Client ID is required to create a workflow");
      }
      
      console.log("Inserting workflow with client ID:", clientId);
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          name: values.name,
          department: values.department,
          description: values.description,
          client_id: clientId,
          nodes: typeof values.nodes === 'number' ? values.nodes : 0,
          executions: typeof values.executions === 'number' ? values.executions : 0,
          exceptions: typeof values.exceptions === 'number' ? values.exceptions : 0,
          time_saved: 0,
          cost_saved: 0,
          status: 'active'
        })
        .select();
        
      if (error) {
        console.error("Error creating workflow:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("No data returned from workflow creation");
      }
      
      // Transform the returned Supabase data to match our Workflow interface
      const newWorkflow: Workflow = {
        id: data[0].id,
        name: data[0].name,
        department: data[0].department || '',
        description: data[0].description,
        created_at: data[0].created_at,
        nodes: data[0].nodes || 0,
        executions: data[0].executions || 0,
        exceptions: data[0].exceptions || 0,
        timeSaved: data[0].time_saved?.toString() || '0',
        moneySaved: data[0].cost_saved?.toString() || '0',
        status: data[0].status
      };
      
      toast({
        title: "Workflow Created",
        description: `${values.name} workflow has been created successfully.`,
      });
      
      if (onWorkflowAdded) {
        onWorkflowAdded(newWorkflow);
      }
      
      // Close the modal after successful submission
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if not submitting
      if (isSubmitting && newOpen === false) {
        return; // Prevent closing while submitting
      }
      setOpen(newOpen);
    }}>
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

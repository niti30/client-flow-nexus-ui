
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkflowFormValues } from "@/components/forms/AddWorkflowForm";
import { useAuth } from "@/contexts/AuthContext";
import { Workflow } from "@/types/workflow";

export const useWorkflowActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addWorkflow = async (values: WorkflowFormValues, clientId: string, onSuccess?: (workflow?: Workflow) => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add a workflow.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const workflowData = {
        client_id: clientId,
        name: values.name, // Ensure name is present and not optional
        department: values.department || '',
        description: values.description || '',
        nodes: values.nodes || 0,
        executions: values.executions || 0, 
        exceptions: values.exceptions || 0,
        status: 'active',
        progress: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('workflows')
        .insert(workflowData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Workflow added",
        description: `${values.name} has been successfully added.`,
      });

      // Convert DB data to Workflow interface format for the callback
      const newWorkflow: Workflow = {
        id: data.id,
        name: data.name,
        department: data.department,
        description: data.description,
        nodes: data.nodes || 0,
        executions: data.executions || 0,
        exceptions: data.exceptions || 0,
        status: data.status,
        created_at: data.created_at,
        progress: data.progress || 0,
        timeSaved: data.time_saved ? data.time_saved.toString() : '0',
        moneySaved: data.cost_saved ? data.cost_saved.toString() : '0',
        client_id: data.client_id
      };

      if (onSuccess) {
        onSuccess(newWorkflow);
      }

      return data;
    } catch (error: any) {
      console.error("Error adding workflow:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add workflow. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateWorkflowStatus = async (workflowId: string, isActive: boolean) => {
    try {
      const status = isActive ? 'active' : 'inactive';
      
      const { error } = await supabase
        .from('workflows')
        .update({ status })
        .eq('id', workflowId);

      if (error) {
        throw error;
      }

      toast({
        title: "Status updated",
        description: `Workflow is now ${status}.`,
      });

      return true;
    } catch (error: any) {
      console.error("Error updating workflow status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update workflow status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    addWorkflow,
    updateWorkflowStatus,
    isSubmitting
  };
};

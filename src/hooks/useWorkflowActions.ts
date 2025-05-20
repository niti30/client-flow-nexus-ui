
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkflowFormValues } from "@/components/forms/AddWorkflowForm";
import { useAuth } from "@/contexts/AuthContext";

export const useWorkflowActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addWorkflow = async (values: WorkflowFormValues, clientId: string, onSuccess?: () => void) => {
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
        ...values,
        client_id: clientId,
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

      if (onSuccess) {
        onSuccess();
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

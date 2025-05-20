
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useWorkflowActions } from "@/hooks/useWorkflowActions";
import { toast } from "sonner";

interface WorkflowStatusToggleProps {
  workflowId: string;
  initialStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

const WorkflowStatusToggle = ({ 
  workflowId, 
  initialStatus, 
  onStatusChange 
}: WorkflowStatusToggleProps) => {
  const [status, setStatus] = useState(initialStatus === 'active');
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateWorkflowStatus } = useWorkflowActions();

  // Synchronize status if initialStatus changes
  useEffect(() => {
    setStatus(initialStatus === 'active');
  }, [initialStatus]);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    
    const success = await updateWorkflowStatus(workflowId, checked);
    
    if (success) {
      setStatus(checked);
      
      if (onStatusChange) {
        onStatusChange(checked ? 'active' : 'inactive');
      }
      
      toast(
        checked ? "Workflow activated" : "Workflow deactivated",
        { description: checked ? "Workflow is now active" : "Workflow is now inactive" }
      );
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center">
      <Switch 
        checked={status} 
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="data-[state=checked]:bg-green-500"
      />
      <span className={`ml-2 ${status ? 'text-green-600' : 'text-gray-500'}`}>
        {status ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default WorkflowStatusToggle;

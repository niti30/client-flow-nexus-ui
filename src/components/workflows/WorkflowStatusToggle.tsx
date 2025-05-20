
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useWorkflowActions } from "@/hooks/useWorkflowActions";
import { useToast } from "@/hooks/use-toast";

interface WorkflowStatusToggleProps {
  workflowId: string;
  initialStatus: string;
  onStatusChange?: (newStatus: string) => void;
  className?: string;
}

const WorkflowStatusToggle = ({ 
  workflowId, 
  initialStatus, 
  onStatusChange,
  className
}: WorkflowStatusToggleProps) => {
  const [status, setStatus] = useState(initialStatus === 'active');
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateWorkflowStatus } = useWorkflowActions();
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    
    const success = await updateWorkflowStatus(workflowId, checked);
    
    if (success) {
      setStatus(checked);
      
      toast({
        title: "Status updated",
        description: `Workflow is now ${checked ? 'active' : 'inactive'}.`,
      });
      
      if (onStatusChange) {
        onStatusChange(checked ? 'active' : 'inactive');
      }
    }
    
    setIsUpdating(false);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Switch 
        checked={status} 
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className={`${status ? 'bg-green-500' : 'bg-gray-300'} data-[state=checked]:bg-green-500`}
      />
      <span className={`ml-2 text-sm ${status ? 'text-green-600' : 'text-gray-500'}`}>
        {status ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default WorkflowStatusToggle;

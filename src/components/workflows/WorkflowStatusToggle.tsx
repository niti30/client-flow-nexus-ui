
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useWorkflowActions } from "@/hooks/useWorkflowActions";

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

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    
    const success = await updateWorkflowStatus(workflowId, checked);
    
    if (success) {
      setStatus(checked);
      
      if (onStatusChange) {
        onStatusChange(checked ? 'active' : 'inactive');
      }
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

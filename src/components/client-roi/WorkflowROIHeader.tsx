
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddWorkflowDialog, Workflow } from "@/components/dialogs/AddWorkflowDialog";

interface WorkflowROIHeaderProps {
  clientId: string;
  onWorkflowAdded: (workflow: Workflow) => void;
}

const WorkflowROIHeader = ({ clientId, onWorkflowAdded }: WorkflowROIHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Workflow ROI</h1>
      {clientId && (
        <AddWorkflowDialog
          onWorkflowAdded={onWorkflowAdded}
          clientId={clientId}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </AddWorkflowDialog>
      )}
    </div>
  );
};

export default WorkflowROIHeader;

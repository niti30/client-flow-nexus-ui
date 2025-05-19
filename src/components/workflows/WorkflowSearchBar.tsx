
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface WorkflowSearchBarProps {
  onSearch?: (query: string) => void;
  onAddWorkflow?: () => void;
}

const WorkflowSearchBar = ({ onSearch, onAddWorkflow }: WorkflowSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search workflows..." 
          className="pl-9 w-full sm:w-[260px]" 
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      
      <Button className="w-full sm:w-auto" onClick={onAddWorkflow}>
        <Plus size={16} className="mr-2" />
        Add Workflow
      </Button>
    </div>
  );
};

export default WorkflowSearchBar;

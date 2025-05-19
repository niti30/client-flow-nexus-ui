
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface ExceptionSearchBarProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

const ExceptionSearchBar = ({ onSearch, onFilter }: ExceptionSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search exceptions..." 
          className="pl-9 w-full sm:w-[260px]" 
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      
      <Button variant="outline" className="w-full sm:w-auto" onClick={onFilter}>
        <Filter size={16} className="mr-2" />
        Filter
      </Button>
    </div>
  );
};

export default ExceptionSearchBar;

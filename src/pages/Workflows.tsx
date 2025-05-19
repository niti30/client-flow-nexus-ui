
import { useWorkflows } from '@/hooks/useWorkflows';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import WorkflowsTable from '@/components/workflows/WorkflowsTable';
import WorkflowSearchBar from '@/components/workflows/WorkflowSearchBar';

const Workflows = () => {
  const { workflows, loading } = useWorkflows();

  const handleAddWorkflow = () => {
    // Placeholder for adding new workflow functionality
    console.log('Add workflow clicked');
  };

  const handleSearch = (query: string) => {
    // Placeholder for search functionality
    console.log('Searching for:', query);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Workflows</h1>
              <WorkflowSearchBar 
                onSearch={handleSearch} 
                onAddWorkflow={handleAddWorkflow} 
              />
            </div>
            
            <WorkflowsTable workflows={workflows} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Workflows;

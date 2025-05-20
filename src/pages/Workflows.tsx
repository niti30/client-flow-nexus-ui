
import { useWorkflows } from '@/hooks/useWorkflows';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import WorkflowsTable from '@/components/workflows/WorkflowsTable';
import WorkflowSearchBar from '@/components/workflows/WorkflowSearchBar';
import { AddWorkflowDialog } from '@/components/dialogs/AddWorkflowDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Workflows = () => {
  const { workflows, loading } = useWorkflows();

  const handleSearch = (query: string) => {
    // Placeholder for search functionality
    console.log('Searching for:', query);
  };

  // Handle ROI Report click
  const handleRoiReportClick = () => {
    // In a real app, this would generate and download a report
    // For now we'll simulate a file download
    const dummyLink = document.createElement('a');
    dummyLink.href = 'data:text/plain;charset=utf-8,ROI Report Data';
    dummyLink.download = 'ROI_Report.csv';
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-white mb-2 md:mb-0">Workflows</h1>
              <div className="flex items-center gap-4">
                <WorkflowSearchBar 
                  onSearch={handleSearch} 
                />
                <AddWorkflowDialog buttonClassName="bg-[#2a2a2d] hover:bg-[#3a3a3d] text-white" />
              </div>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-md border border-gray-800 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-[#2a2a2d]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Workflow Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"># of Nodes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"># of Executions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"># of Exceptions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Saved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">$ Saved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1e1e1e] divide-y divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">Sales</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400">Lead Processing</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">12</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400">234</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400">2</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">30 min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">75 USD</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <button 
                          onClick={handleRoiReportClick} 
                          className="text-blue-400 hover:text-blue-500 text-sm"
                        >
                          ROI Report
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">HR</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400">Onboarding</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">8</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400">45</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400">0</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">120 min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">180 USD</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <button 
                          onClick={handleRoiReportClick} 
                          className="text-blue-400 hover:text-blue-500 text-sm"
                        >
                          ROI Report
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Workflows;

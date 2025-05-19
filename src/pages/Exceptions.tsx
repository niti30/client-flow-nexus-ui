
import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ExceptionSearchBar from "@/components/exceptions/ExceptionSearchBar";
import ExceptionsTable from "@/components/exceptions/ExceptionsTable";
import { useExceptions } from "@/hooks/useExceptions";

const Exceptions = () => {
  const { exceptions, loading, setSearchQuery } = useExceptions();

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter button handler
  const handleFilter = () => {
    console.log("Filter button clicked");
    // Filter logic could be added here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-[260px]">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Exceptions</h1>
              
              <ExceptionSearchBar 
                onSearch={handleSearch} 
                onFilter={handleFilter}
              />
            </div>
            
            <ExceptionsTable 
              exceptions={exceptions} 
              loading={loading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exceptions;

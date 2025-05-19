
import { useState, useEffect } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useExceptions } from "@/hooks/useExceptions";
import ExceptionsTable from "@/components/exceptions/ExceptionsTable";
import ExceptionSearchBar from "@/components/exceptions/ExceptionSearchBar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Exceptions = () => {
  const navigate = useNavigate();
  const { exceptions, loading, setSearchQuery } = useExceptions();
  const [clientFilter, setClientFilter] = useState("All clients");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [severityFilter, setSeverityFilter] = useState("All severities");
  const [filteredExceptions, setFilteredExceptions] = useState(exceptions);

  // Apply filters whenever filter values or exceptions data changes
  useEffect(() => {
    let filtered = [...exceptions];
    
    if (clientFilter !== "All clients") {
      filtered = filtered.filter(exception => 
        exception.clients?.name === clientFilter
      );
    }
    
    if (typeFilter !== "All types") {
      filtered = filtered.filter(exception => 
        exception.exception_type === typeFilter
      );
    }
    
    if (severityFilter !== "All severities") {
      filtered = filtered.filter(exception => 
        exception.severity === severityFilter
      );
    }
    
    setFilteredExceptions(filtered);
  }, [exceptions, clientFilter, typeFilter, severityFilter]);

  // Get unique values for filter dropdowns
  const getUniqueClients = () => {
    const uniqueClients = new Set(exceptions.map(e => e.clients?.name).filter(Boolean));
    return Array.from(uniqueClients);
  };

  const getUniqueTypes = () => {
    const uniqueTypes = new Set(exceptions.map(e => e.exception_type).filter(Boolean));
    return Array.from(uniqueTypes);
  };

  const getUniqueSeverities = () => {
    const uniqueSeverities = new Set(exceptions.map(e => e.severity).filter(Boolean));
    return Array.from(uniqueSeverities);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewCredentials = (clientId: string) => {
    navigate('/client/credentials', { state: { clientId } });
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Exceptions</h1>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client name</label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-800">
                  <SelectGroup>
                    <SelectItem value="All clients">All clients</SelectItem>
                    {getUniqueClients().map(client => (
                      <SelectItem key={client} value={client}>{client}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exception type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-800">
                  <SelectGroup>
                    <SelectItem value="All types">All types</SelectItem>
                    {getUniqueTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-800">
                  <SelectGroup>
                    <SelectItem value="All severities">All severities</SelectItem>
                    {getUniqueSeverities().map(severity => (
                      <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-white text-gray-800 rounded-md border border-gray-300 overflow-hidden">
            <ExceptionsTable 
              exceptions={filteredExceptions} 
              loading={loading} 
              onViewCredentials={handleViewCredentials}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exceptions;

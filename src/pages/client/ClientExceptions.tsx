
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import ExceptionsTable from "@/components/exceptions/ExceptionsTable";
import ExceptionSearchBar from "@/components/exceptions/ExceptionSearchBar";
import { useExceptions } from "@/hooks/useExceptions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClientExceptions = () => {
  const {
    exceptions,
    loading,
    setSearchQuery
  } = useExceptions();
  const [clientFilter, setClientFilter] = useState("All clients");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [severityFilter, setSeverityFilter] = useState("All severities");
  const [filteredExceptions, setFilteredExceptions] = useState(exceptions);

  // Apply filters whenever filter values or exceptions data changes
  useEffect(() => {
    let filtered = [...exceptions];
    if (clientFilter !== "All clients") {
      filtered = filtered.filter(exception => exception.clients?.name === clientFilter);
    }
    if (typeFilter !== "All types") {
      filtered = filtered.filter(exception => exception.exception_type === typeFilter);
    }
    if (severityFilter !== "All severities") {
      filtered = filtered.filter(exception => exception.severity === severityFilter);
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
  
  return (
    <div className="flex h-screen bg-background text-foreground">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">Exceptions</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Exception type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full bg-card border-border text-card-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectGroup>
                      <SelectItem value="All types">All types</SelectItem>
                      {getUniqueTypes().map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full bg-card border-border text-card-foreground">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectGroup>
                      <SelectItem value="All severities">All severities</SelectItem>
                      {getUniqueSeverities().map(severity => <SelectItem key={severity} value={severity}>{severity}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border border-border">
              <ExceptionsTable exceptions={filteredExceptions} loading={loading} onViewCredentials={() => {}} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientExceptions;

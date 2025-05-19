
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Exceptions = () => {
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExceptions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('exceptions')
          .select(`
            *,
            clients(name),
            workflows(name)
          `);
        
        if (error) {
          console.error('Error fetching exceptions:', error);
        } else {
          setExceptions(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExceptions();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'open':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Exceptions</h1>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input 
                    placeholder="Search exceptions..." 
                    className="pl-9 w-full sm:w-[260px]" 
                  />
                </div>
                
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Loading exceptions...
                        </TableCell>
                      </TableRow>
                    ) : exceptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No exceptions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      exceptions.map((exception) => (
                        <TableRow key={exception.id}>
                          <TableCell className="font-medium">{exception.description}</TableCell>
                          <TableCell>{exception.clients?.name || "—"}</TableCell>
                          <TableCell>{exception.workflows?.name || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(exception.status)}>
                              {exception.status?.replace('_', ' ') || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {exception.created_at ? new Date(exception.created_at).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            {exception.resolved_at ? new Date(exception.resolved_at).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                                <DropdownMenuItem>Assign</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="border-t py-2 px-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exceptions;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  name: string;
  status: string;
  industry: string;
  logo_url?: string;
  email?: string;
}

interface ClientsTableProps {
  searchQuery?: string;
  refreshTrigger?: number;
}

const ClientsTable = ({ searchQuery = '', refreshTrigger = 0 }: ClientsTableProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      console.log("Fetching clients...");
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Error fetching clients",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Fetched clients:', data);
        setClients(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected error",
        description: "Failed to fetch clients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch clients when component mounts or refresh trigger changes
    fetchClients();
  }, [refreshTrigger]); 

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.industry && client.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClientClick = (clientId: string) => {
    navigate(`/client/dashboard`, { state: { clientId } });
  };

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#FAF9F8]">
            <TableRow>
              <TableHead className="font-bold">CLIENT</TableHead>
              <TableHead className="font-bold">EMAIL</TableHead>
              <TableHead className="font-bold">INDUSTRY</TableHead>
              <TableHead className="font-bold">STATUS</TableHead>
              <TableHead className="font-bold">WORKFLOWS</TableHead>
              <TableHead className="font-bold">SUBSCRIPTION</TableHead>
              <TableHead className="font-bold text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {client.logo_url ? (
                          <img src={client.logo_url} alt={client.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-500">
                            {client.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleClientClick(client.id)}
                        className="text-[#4E86CF] hover:underline cursor-pointer"
                      >
                        {client.name}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{client.email || "—"}</TableCell>
                  <TableCell>{client.industry || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "active" ? "success" : "destructive"} className="capitalize">
                      {client.status || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">— / —</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">—</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#4E86CF]"
                      onClick={() => handleClientClick(client.id)}
                    >
                      View
                    </Button>
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
  );
};

export default ClientsTable;

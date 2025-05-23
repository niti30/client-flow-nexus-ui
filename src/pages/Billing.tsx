import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Edit, Trash, ExternalLink, MoreHorizontal } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { usePlans } from "@/hooks/usePlans";
import AddPlanForm from "@/components/subscriptions/AddPlanForm";
import { useToast } from '@/hooks/use-toast';

const Billing = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPlan, setShowAddPlan] = useState(false);
  const { plans, addPlan, fetchPlans } = usePlans();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch invoices
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select(`
            *,
            clients(name),
            subscriptions(
              *,
              plans(name, price)
            )
          `);
        
        if (invoicesError) {
          console.error('Error fetching invoices:', invoicesError);
        } else {
          setInvoices(invoicesData || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddPlan = async (planData: any) => {
    const success = await addPlan(planData);
    
    if (success) {
      setShowAddPlan(false);
      toast({
        title: "Success",
        description: "New plan has been added",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add new plan",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `INV-${invoice.id.slice(0, 8)}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientClick = (clientId: string) => {
    navigate(`/client-detail/${clientId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9f8]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="relative mb-4 md:mb-0 w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search invoices or clients..." 
                  className="pl-10 pr-4 py-2 w-full bg-white border-gray-300 text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button onClick={() => setShowAddPlan(true)} className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>
            
            {/* Plans */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan) => (
                  <Card key={plan.id} className="border border-gray-300 bg-white shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-medium">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-500">{plan.pricingModel} pricing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.setupFee}</span>
                        <span className="text-gray-500">/{plan.billingCadence.toLowerCase()}</span>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">
                            Contract Length: {plan.contractLength}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">
                            Prepayment: {plan.prepaymentPercentage}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">
                            Cap: {plan.cap}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">
                            Overage: {plan.overageCost}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-800 hover:bg-gray-100" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Invoices */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Invoices</h2>
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-300">
                        <TableHead className="font-medium text-gray-700">Invoice ID</TableHead>
                        <TableHead className="font-medium text-gray-700">Client</TableHead>
                        <TableHead className="font-medium text-gray-700">Plan</TableHead>
                        <TableHead className="font-medium text-gray-700">Amount</TableHead>
                        <TableHead className="font-medium text-gray-700">Status</TableHead>
                        <TableHead className="font-medium text-gray-700">Due Date</TableHead>
                        <TableHead className="font-medium text-gray-700">Paid Date</TableHead>
                        <TableHead className="text-right font-medium text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow className="border-gray-300">
                          <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                            Loading invoices...
                          </TableCell>
                        </TableRow>
                      ) : filteredInvoices.length === 0 ? (
                        <TableRow className="border-gray-300">
                          <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                            No invoices found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="border-gray-300">
                            <TableCell className="font-medium">INV-{invoice.id.slice(0, 8)}</TableCell>
                            <TableCell>
                              <button
                                className="text-blue-600 hover:underline"
                                onClick={() => handleClientClick(invoice.client_id)}
                              >
                                {invoice.clients?.name || "—"}
                              </button>
                            </TableCell>
                            <TableCell>{invoice.subscriptions?.plans?.name || "—"}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1) || "—"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell>
                              {invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white border-gray-300 text-gray-800">
                                    {invoice.status !== 'paid' && (
                                      <DropdownMenuItem className="hover:bg-gray-100">Mark as paid</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="hover:bg-gray-100">Send reminder</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100">View details</DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-300" />
                                    <DropdownMenuItem className="text-red-600 hover:bg-gray-100 hover:text-red-700">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="border-t border-gray-300 p-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" className="text-gray-500 hover:text-gray-800" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive className="bg-gray-200 hover:bg-gray-300">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" className="text-gray-500 hover:text-gray-800" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Plan Dialog */}
      <AddPlanForm 
        isOpen={showAddPlan} 
        onClose={() => setShowAddPlan(false)} 
        onSubmit={handleAddPlan} 
      />
    </div>
  );
};

export default Billing;


import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Billing = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        
        // Fetch plans
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('*');
        
        if (plansError) {
          console.error('Error fetching plans:', plansError);
        } else {
          setPlans(plansData || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  const pricingModels = ["Fixed", "Tiered", "Usage"];
  const billingCycles = ["Monthly", "Quarterly", "Annually"];
  const contractLengths = ["1 month", "3 months", "6 months", "12 months", "24 months"];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-[220px]">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="relative mb-4 md:mb-0 w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search invoices or clients..." 
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button onClick={() => setShowAddPlan(true)} className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>
            
            {/* Plans */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan) => (
                  <Card key={plan.id} className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-medium">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-500">/{plan.billing_cycle}</span>
                      </div>
                      <div className="space-y-2 mb-6">
                        {plan.features && typeof plan.features === 'object' && (
                          Object.entries(plan.features as Record<string, any>).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">
                                {key}: {value}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
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
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Invoice ID</TableHead>
                        <TableHead className="font-medium">Client</TableHead>
                        <TableHead className="font-medium">Plan</TableHead>
                        <TableHead className="font-medium">Amount</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Due Date</TableHead>
                        <TableHead className="font-medium">Paid Date</TableHead>
                        <TableHead className="text-right font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            Loading invoices...
                          </TableCell>
                        </TableRow>
                      ) : filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No invoices found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">INV-{invoice.id.slice(0, 8)}</TableCell>
                            <TableCell>{invoice.clients?.name || "—"}</TableCell>
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
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {invoice.status !== 'paid' && (
                                      <DropdownMenuItem>Mark as paid</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>Send reminder</DropdownMenuItem>
                                    <DropdownMenuItem>View details</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
                <div className="border-t p-4">
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
          </div>
        </main>
      </div>

      {/* Add Plan Dialog */}
      <Dialog open={showAddPlan} onOpenChange={setShowAddPlan}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
            <DialogDescription>
              Create a new billing plan for your clients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input placeholder="Enter plan name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Fixed" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingModels.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input type="number" className="pl-7" placeholder="0.00" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Contract Length" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractLengths.map(length => (
                      <SelectItem key={length} value={length}>{length}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Billing Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {billingCycles.map(cycle => (
                      <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input type="number" placeholder="0" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input type="number" className="pl-7" placeholder="0.00" />
              </div>
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input type="number" className="pl-7" placeholder="0.00" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPlan(false)}>Cancel</Button>
            <Button>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;

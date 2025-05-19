
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Check, Circle } from "lucide-react";
import { ClientDetailWorkflows } from '@/components/client-detail/ClientDetailWorkflows';
import { ClientSupportEngineers } from '@/components/client-detail/ClientSupportEngineers';
import { ClientUsersList } from '@/components/client-detail/ClientUsersList';
import { ClientDocumentLinks } from '@/components/client-detail/ClientDocumentLinks';
import { ClientPipelineProgress } from '@/components/client-detail/ClientPipelineProgress';
import { useToast } from '@/hooks/use-toast';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching client:', error);
          toast({
            title: "Error",
            description: "Failed to load client details",
            variant: "destructive"
          });
        } else {
          setClient(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#faf9f8]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse">Loading client details...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Client Manager</h1>
          
          <Tabs defaultValue="overview" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="mb-6 border-b w-64">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none">Overview</TabsTrigger>
              <TabsTrigger value="client-workflows" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none">Client Workflows</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Support Engineers Section */}
                <div className="bg-white rounded-md border p-6">
                  <h2 className="text-xl font-medium mb-4">Assigned Support Engineers</h2>
                  <ClientSupportEngineers clientId={id!} />
                </div>

                {/* Two-column layout for Users and Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Users */}
                  <div className="bg-white rounded-md border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-medium">Client Users</h2>
                      <Button>
                        <Plus size={16} className="mr-2" />
                        Add User
                      </Button>
                    </div>
                    <ClientUsersList clientId={id!} />
                  </div>
                  
                  {/* Document Links */}
                  <div className="bg-white rounded-md border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-medium">Document Links</h2>
                      <Button>
                        <Plus size={16} className="mr-2" />
                        Add Document
                      </Button>
                    </div>
                    <ClientDocumentLinks clientId={id!} />
                  </div>
                </div>

                {/* Pipeline Progress */}
                <div className="bg-white rounded-md border p-6">
                  <h2 className="text-xl font-medium mb-4">Pipeline Progress</h2>
                  <ClientPipelineProgress clientId={id!} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="client-workflows">
              <ClientDetailWorkflows clientId={id!} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ClientDetail;

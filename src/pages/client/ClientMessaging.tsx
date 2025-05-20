
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Message } from "@/pages/Messaging";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ClientMessaging = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Fetch client-specific messages
  const { data, isLoading, error } = useQuery({
    queryKey: ['clientMessages'],
    queryFn: async () => {
      // Mock data for client messages
      const mockMessages: Message[] = [
        { 
          id: '1',
          subject: "Monthly Report", 
          body: "Here is your monthly report for May 2025.",
          recipients: "Your Company", 
          sentDate: "2025-05-15", 
          status: "Delivered", 
          openRate: "100%" 
        },
        { 
          id: '2',
          subject: "Feature Update Available", 
          body: "We've added new features to your account.",
          recipients: "Your Company", 
          sentDate: "2025-05-01", 
          status: "Delivered", 
          openRate: "100%" 
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockMessages;
    },
  });
  
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);
  
  const handleViewMessage = (messageId: string) => {
    // Would navigate to a client-specific message view
    console.log(`View message ${messageId}`);
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 bg-white">
                <CardTitle className="text-xl font-semibold">Message History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#f5f5f7]">
                      <TableRow className="hover:bg-[#f5f5f7]">
                        <TableHead className="font-semibold text-gray-700">Subject</TableHead>
                        <TableHead className="font-semibold text-gray-700">Sent Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={4}>
                              <Skeleton className="h-10 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : messages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                            No messages available.
                          </TableCell>
                        </TableRow>
                      ) : (
                        messages.map((message) => (
                          <TableRow key={message.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{message.subject}</TableCell>
                            <TableCell>{message.sentDate}</TableCell>
                            <TableCell>
                              <Badge variant={message.status === 'Delivered' ? 'default' : 'destructive'}>
                                {message.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 rounded-full"
                                onClick={() => handleViewMessage(message.id)}
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientMessaging;

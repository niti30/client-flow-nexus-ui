
import { useState, useEffect } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CreateMessageForm from "@/components/messaging/CreateMessageForm";
import ViewMessageDialog from "@/components/messaging/ViewMessageDialog";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  subject: string;
  body: string;
  recipients: string;
  sentDate: string;
  status: string;
  openRate: string;
}

const Messaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateMessageOpen, setIsCreateMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewMessageOpen, setIsViewMessageOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // This would be replaced with a real API call in production
      // const { data, error } = await supabase.from('messages').select('*');
      // if (error) throw error;
      // setMessages(data || []);
      
      // Using mock data for now
      setTimeout(() => {
        const mockData = [
          { 
            id: '1',
            subject: "Monthly Report", 
            body: "Here is your monthly report for May 2025.",
            recipients: "All Clients", 
            sentDate: "2025-05-15", 
            status: "Delivered", 
            openRate: "85%" 
          },
          { 
            id: '2',
            subject: "System Maintenance", 
            body: "We will be performing system maintenance on May 20, 2025.",
            recipients: "Admins", 
            sentDate: "2025-05-10", 
            status: "Delivered", 
            openRate: "100%" 
          },
          { 
            id: '3',
            subject: "New Feature Announcement", 
            body: "We're excited to announce our new dashboard features!",
            recipients: "All Users", 
            sentDate: "2025-05-01", 
            status: "Delivered", 
            openRate: "72%" 
          },
        ];
        setMessages(mockData);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCreateMessage = () => {
    setIsCreateMessageOpen(true);
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewMessageOpen(true);
  };

  const handleResendMessage = async (messageId: string) => {
    try {
      // This would be replaced with a real API call in production
      // await supabase.from('messages').update({ status: 'Resent' }).eq('id', messageId);
      
      // Mock successful resend
      toast({
        title: "Message Resent",
        description: "The message has been successfully resent.",
        variant: "default",
      });
      
      // Update the local state to reflect the resend
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: "Delivered", sentDate: new Date().toISOString().split('T')[0] } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error resending message:', error);
      toast({
        title: "Error",
        description: "Failed to resend message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitMessage = async (messageData: Omit<Message, 'id' | 'status' | 'sentDate' | 'openRate'>) => {
    try {
      // This would be replaced with a real API call in production
      // const { data, error } = await supabase.from('messages').insert([
      //   { 
      //     subject: messageData.subject,
      //     body: messageData.body,
      //     recipients: messageData.recipients,
      //     status: 'Delivered',
      //     sent_date: new Date(),
      //     open_rate: '0%'
      //   }
      // ]).select();
      // if (error) throw error;
      
      // Create a new message with mock data
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        subject: messageData.subject,
        body: messageData.body,
        recipients: messageData.recipients,
        sentDate: new Date().toISOString().split('T')[0],
        status: 'Delivered',
        openRate: '0%'
      };
      
      // Add new message to the list
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        variant: "default",
      });
      
      setIsCreateMessageOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Messaging</h1>
              <Button className="bg-black hover:bg-gray-800" onClick={handleCreateMessage}>
                <Plus size={16} className="mr-2" />
                New Message
              </Button>
            </div>
            
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
                        <TableHead className="font-semibold text-gray-700">Recipients</TableHead>
                        <TableHead className="font-semibold text-gray-700">Sent Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Open Rate</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array(3).fill(0).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={6}>
                              <Skeleton className="h-10 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : messages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                            No messages available. Create your first message to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        messages.map((message) => (
                          <TableRow key={message.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{message.subject}</TableCell>
                            <TableCell>{message.recipients}</TableCell>
                            <TableCell>{message.sentDate}</TableCell>
                            <TableCell>
                              <Badge variant={message.status === 'Delivered' ? 'default' : 'destructive'}>
                                {message.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{message.openRate}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 rounded-full"
                                  onClick={() => handleViewMessage(message)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 rounded-full"
                                  onClick={() => handleResendMessage(message.id)}
                                >
                                  Resend
                                </Button>
                              </div>
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
      
      <CreateMessageForm 
        isOpen={isCreateMessageOpen}
        onClose={() => setIsCreateMessageOpen(false)}
        onSubmit={handleSubmitMessage}
      />
      
      <ViewMessageDialog
        isOpen={isViewMessageOpen}
        onClose={() => setIsViewMessageOpen(false)}
        message={selectedMessage}
      />
    </div>
  );
};

export default Messaging;

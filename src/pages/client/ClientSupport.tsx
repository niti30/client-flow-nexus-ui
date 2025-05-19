
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { MessageSquare, Send, ArrowUpRight, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/hooks/use-toast';

const ClientSupport = () => {
  const { user } = useAuth();
  const location = useLocation();
  const clientId = location.state?.clientId || 'demo';
  const { toast } = useToast();
  
  const [message, setMessage] = useState("");
  
  const supportEngineers = [
    { 
      name: "John Smith", 
      role: "Lead Solutions Engineer", 
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://i.pravatar.cc/150?img=1" 
    },
    { 
      name: "Sarah Johnson", 
      role: "Support Engineer", 
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 987-6543",
      avatar: "https://i.pravatar.cc/150?img=5" 
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the support team.",
      variant: "default",
    });
    
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Acme Corporation</h1>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Support</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {supportEngineers.map((engineer, idx) => (
              <Card key={idx} className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                      <img src={engineer.avatar} alt={engineer.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{engineer.name}</CardTitle>
                      <CardDescription>{engineer.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`mailto:${engineer.email}`} className="text-blue-600 hover:underline">
                        {engineer.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`tel:${engineer.phone}`} className="text-blue-600 hover:underline">
                        {engineer.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Send a Message
              </CardTitle>
              <CardDescription>
                Send a message to our support team and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Type your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] w-full p-3 border rounded-md"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ClientSupport;

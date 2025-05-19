
import { useState } from "react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, User, ArrowRight } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "support";
  content: string;
  timestamp: string;
  read: boolean;
}

const ClientSupport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState("");
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "support",
      content: "Hi there! How can I help you today with your automation workflows?",
      timestamp: "2025-05-19 09:30",
      read: true
    },
    {
      id: "2",
      role: "user",
      content: "I'm having trouble setting up the invoice processing workflow. Can you help?",
      timestamp: "2025-05-19 09:32",
      read: true
    },
    {
      id: "3",
      role: "support",
      content: "Of course! I'd be happy to help with your invoice processing workflow. Could you tell me which specific step you're having trouble with?",
      timestamp: "2025-05-19 09:33",
      read: true
    }
  ]);
  
  const [supportEngineers, setSupportEngineers] = useState([
    { 
      name: "John Smith", 
      role: "Solutions Engineer", 
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "online" 
    },
    { 
      name: "Sarah Johnson", 
      role: "Support SE", 
      avatar: "https://i.pravatar.cc/150?img=5",
      status: "away" 
    }
  ]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    // Simulate a response after a delay
    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "support",
        content: "I'll look into that for you. Can you provide more details about what you're trying to accomplish?",
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Support</h1>
          <div className="flex items-center space-x-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Support Engineers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportEngineers.map((engineer) => (
                    <div key={engineer.name} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img src={engineer.avatar} alt={engineer.name} className="h-full w-full object-cover" />
                        </div>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          engineer.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{engineer.name}</p>
                        <p className="text-xs text-gray-500">{engineer.role}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
                    <CardTitle>Chat with Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="flex flex-col p-4 space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Textarea 
                      placeholder="Type your message here..."
                      className="flex-1 resize-none"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientSupport;

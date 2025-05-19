
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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

const Messaging = () => {
  // Sample messages data
  const messages = [
    { 
      subject: "Monthly Report", 
      recipients: "All Clients", 
      sentDate: "2025-05-15", 
      status: "Delivered", 
      openRate: "85%" 
    },
    { 
      subject: "System Maintenance", 
      recipients: "Admins", 
      sentDate: "2025-05-10", 
      status: "Delivered", 
      openRate: "100%" 
    },
    { 
      subject: "New Feature Announcement", 
      recipients: "All Users", 
      sentDate: "2025-05-01", 
      status: "Delivered", 
      openRate: "72%" 
    },
  ];

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Messaging</h1>
              <Button className="bg-[#141417] hover:bg-black">
                <Plus size={16} className="mr-2" />
                New Message
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Message History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-[#FAF9F8]">
                    <TableRow className="hover:bg-[#FAF9F8]">
                      <TableHead className="font-bold text-black">Subject</TableHead>
                      <TableHead className="font-bold text-black">Recipients</TableHead>
                      <TableHead className="font-bold text-black">Sent Date</TableHead>
                      <TableHead className="font-bold text-black">Status</TableHead>
                      <TableHead className="font-bold text-black">Open Rate</TableHead>
                      <TableHead className="font-bold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{message.subject}</TableCell>
                        <TableCell>{message.recipients}</TableCell>
                        <TableCell>{message.sentDate}</TableCell>
                        <TableCell>{message.status}</TableCell>
                        <TableCell>{message.openRate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Resend</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messaging;

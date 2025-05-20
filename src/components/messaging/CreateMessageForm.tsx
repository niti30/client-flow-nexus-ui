
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Message } from "@/pages/Messaging";

interface CreateMessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (messageData: Omit<Message, 'id' | 'status' | 'sentDate' | 'openRate'>) => void;
}

const CreateMessageForm = ({ isOpen, onClose, onSubmit }: CreateMessageFormProps) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("All Clients");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body || !recipients) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({ subject, body, recipients });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubject("");
    setBody("");
    setRecipients("All Clients");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetForm, 300);
      }
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New Message</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter message subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <label htmlFor="recipients" className="text-sm font-medium">
                Recipients
              </label>
              <Select value={recipients} onValueChange={setRecipients}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Clients">All Clients</SelectItem>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="Admins">Admins</SelectItem>
                  <SelectItem value="Support Engineers">Support Engineers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full gap-1.5">
              <label htmlFor="body" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="body"
                placeholder="Enter your message here"
                className="min-h-[150px] resize-none"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-gray-800">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMessageForm;

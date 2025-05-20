
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Message } from "@/pages/Messaging";

interface ViewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
}

const ViewMessageDialog = ({ isOpen, onClose, message }: ViewMessageDialogProps) => {
  if (!message) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {message.subject}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Sent To</p>
              <p className="text-sm">{message.recipients}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sent Date</p>
              <p className="text-sm">{message.sentDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={message.status === 'Delivered' ? 'default' : 'destructive'}>
                {message.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Open Rate</p>
              <p className="text-sm">{message.openRate}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
            <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap">
              {message.body}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="bg-black hover:bg-gray-800">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMessageDialog;

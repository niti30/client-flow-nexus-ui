
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface MissingClientIdAlertProps {
  onReturnToClients: () => void;
}

const MissingClientIdAlert = ({ onReturnToClients }: MissingClientIdAlertProps) => {
  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Client ID is missing. Please return to the clients page to select a client.
        </AlertDescription>
      </Alert>
      
      <Button onClick={onReturnToClients}>
        Return to Clients
      </Button>
    </>
  );
};

export default MissingClientIdAlert;

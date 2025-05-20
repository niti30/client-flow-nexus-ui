
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MissingClientIdAlert = () => {
  const navigate = useNavigate();

  const handleReturnToClients = () => {
    navigate('/clients');
  };

  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Client ID is missing. Please return to the clients page.
        </AlertDescription>
      </Alert>
      
      <Button onClick={handleReturnToClients}>
        Return to Clients
      </Button>
    </>
  );
};

export default MissingClientIdAlert;

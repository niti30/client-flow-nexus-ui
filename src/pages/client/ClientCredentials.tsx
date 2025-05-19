
import { useState } from "react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceCredential {
  name: string;
  logo: string;
  isConnected: boolean;
}

interface ServiceConfig {
  name: string;
  logo: string;
  fields: {
    name: string;
    type: "text" | "password";
    placeholder: string;
    value: string;
  }[];
}

const ClientCredentials = () => {
  const { toast } = useToast();
  
  const [thirdPartyServices, setThirdPartyServices] = useState<ServiceCredential[]>([
    { name: "Slack", logo: "S", isConnected: true },
    { name: "GitHub", logo: "G", isConnected: false },
    { name: "Jira", logo: "J", isConnected: false },
    { name: "Salesforce", logo: "S", isConnected: false },
    { name: "AWS", logo: "A", isConnected: false }
  ]);
  
  const [selectedService, setSelectedService] = useState<ServiceConfig>({
    name: "Slack",
    logo: "S",
    fields: [
      { name: "Workspace URL", type: "text", placeholder: "youworkspace.slack.com", value: "acme-corp.slack.com" },
      { name: "Bot User OAuth Token", type: "password", placeholder: "xoxb-...", value: "xoxb-************" },
      { name: "Signing Secret", type: "password", placeholder: "********", value: "********" }
    ]
  });

  const handleServiceClick = (serviceName: string) => {
    // In a real app, this would load the correct service configuration
    // Here we'll just update the name and reset fields as a simulation
    
    // For demonstration, let's load different fields for different services
    let newFields;
    
    switch(serviceName) {
      case "GitHub":
        newFields = [
          { name: "Repository URL", type: "text" as const, placeholder: "https://github.com/username/repo", value: "" },
          { name: "API Key", type: "password" as const, placeholder: "ghp_...", value: "" }
        ];
        break;
      case "Jira":
        newFields = [
          { name: "Jira Domain", type: "text" as const, placeholder: "yourdomain.atlassian.net", value: "" },
          { name: "API Token", type: "password" as const, placeholder: "...", value: "" },
          { name: "Email", type: "text" as const, placeholder: "your.email@company.com", value: "" }
        ];
        break;
      case "Salesforce":
        newFields = [
          { name: "Instance URL", type: "text" as const, placeholder: "https://yourinstance.my.salesforce.com", value: "" },
          { name: "Client ID", type: "text" as const, placeholder: "...", value: "" },
          { name: "Client Secret", type: "password" as const, placeholder: "...", value: "" }
        ];
        break;
      case "AWS":
        newFields = [
          { name: "Access Key ID", type: "text" as const, placeholder: "AKIA...", value: "" },
          { name: "Secret Access Key", type: "password" as const, placeholder: "...", value: "" },
          { name: "Region", type: "text" as const, placeholder: "us-east-1", value: "" }
        ];
        break;
      default: // Slack
        newFields = [
          { name: "Workspace URL", type: "text" as const, placeholder: "youworkspace.slack.com", value: serviceName === "Slack" ? "acme-corp.slack.com" : "" },
          { name: "Bot User OAuth Token", type: "password" as const, placeholder: "xoxb-...", value: serviceName === "Slack" ? "xoxb-************" : "" },
          { name: "Signing Secret", type: "password" as const, placeholder: "********", value: serviceName === "Slack" ? "********" : "" }
        ];
    }
    
    setSelectedService({
      name: serviceName,
      logo: serviceName.charAt(0),
      fields: newFields
    });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save changes to the backend
    // Here we'll just show a success message
    
    // Update the connected status for the selected service
    setThirdPartyServices(prev => 
      prev.map(service => 
        service.name === selectedService.name
          ? { ...service, isConnected: true }
          : service
      )
    );
    
    toast({
      title: "Credentials Saved",
      description: `${selectedService.name} credentials have been updated.`,
      variant: "default",
    });
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
                src="https://i.pravatar.cc/150?img=12" 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Third-party services list */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Third Party Services</h2>
              <div className="space-y-2">
                {thirdPartyServices.map((service) => (
                  <div 
                    key={service.name} 
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedService.name === service.name 
                        ? 'bg-green-50 border border-green-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => handleServiceClick(service.name)}
                  >
                    <div 
                      className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 text-white font-medium ${
                        service.name === "Slack" ? "bg-[#4A154B]" : 
                        service.name === "GitHub" ? "bg-[#24292e]" :
                        service.name === "Jira" ? "bg-[#0052CC]" :
                        service.name === "Salesforce" ? "bg-[#00A1E0]" :
                        "bg-[#232F3E]" // AWS
                      }`}
                    >
                      {service.logo}
                    </div>
                    <span className="flex-1 font-medium">{service.name}</span>
                    {service.isConnected && (
                      <div className="flex items-center text-green-600">
                        <Check className="h-5 w-5 mr-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Service credentials form */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div 
                  className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 text-white font-medium ${
                    selectedService.name === "Slack" ? "bg-[#4A154B]" : 
                    selectedService.name === "GitHub" ? "bg-[#24292e]" :
                    selectedService.name === "Jira" ? "bg-[#0052CC]" :
                    selectedService.name === "Salesforce" ? "bg-[#00A1E0]" :
                    "bg-[#232F3E]" // AWS
                  }`}
                >
                  {selectedService.logo}
                </div>
                <h2 className="text-xl font-semibold">
                  {selectedService.name} Credentials
                </h2>
                {thirdPartyServices.find(s => s.name === selectedService.name)?.isConnected && (
                  <span className="ml-auto flex items-center text-green-600 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    Connected
                  </span>
                )}
              </div>
              
              <form className="space-y-4">
                {selectedService.fields.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">{field.name}</label>
                    <Input 
                      type={field.type} 
                      placeholder={field.placeholder} 
                      value={field.value}
                      onChange={(e) => {
                        // Update the field value
                        setSelectedService(prev => ({
                          ...prev,
                          fields: prev.fields.map(f => 
                            f.name === field.name ? { ...f, value: e.target.value } : f
                          )
                        }));
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button 
                    onClick={handleSaveChanges}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientCredentials;


import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Credential {
  id: string;
  name: string;
  isConnected: boolean;
  icon?: React.ReactNode;
}

interface CredentialDetails {
  id: string;
  name: string;
  fields: { 
    name: string;
    value: string;
    isSecret: boolean;
  }[];
}

const ClientCredentials = () => {
  const location = useLocation();
  const clientId = location.state?.clientId || 'demo';
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>("slack");
  
  // Mock credential data
  const services: Credential[] = [
    { 
      id: "slack", 
      name: "Slack", 
      isConnected: true, 
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
        </svg>
      )
    },
    { 
      id: "github", 
      name: "GitHub", 
      isConnected: false,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="#181616"/>
        </svg>
      )
    },
    { 
      id: "jira", 
      name: "Jira", 
      isConnected: false,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.571 11.513H0a5.908 5.908 0 0 0 5.999 5.897l5.572-5.897zM15.145 7.895h-11.57L9.143 2h5.999c3.319 0 6 2.667 6 5.948a5.88 5.88 0 0 1-1.768 4.207l-4.229 4.385V7.895z" fill="#2684FF"/>
        </svg>
      )
    },
    { 
      id: "salesforce", 
      name: "Salesforce", 
      isConnected: false,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.3 3.84c-1.46-.35-2.96-.35-4.4.06-.9.33-1.6.85-2.2 1.53-.59.7-.99 1.55-1.2 2.42-.13.63-.2 1.28-.15 1.93-.76.3-1.45.78-2.04 1.42a5.6 5.6 0 0 0-1.6 3.91c0 .85.2 1.7.6 2.45.39.77.95 1.43 1.66 1.93a5.87 5.87 0 0 0 3.16 1.03 5.89 5.89 0 0 0 5.42-3.52 6.91 6.91 0 0 0 8.5-1.09 6.88 6.88 0 0 0-7.5-11.08h-.25v.01zm-5.7 14.15a4.45 4.45 0 0 1-3.67-1.9 4.46 4.46 0 0 1-.27-4.48 4.47 4.47 0 0 1 3.94-2.38h.26a5.93 5.93 0 0 0 .72 4.18c.8 1.39 1.95 2.45 3.38 3.2-.85.88-2.02 1.38-3.36 1.38h-.01zm5.9-2.33a5.95 5.95 0 0 1-3.86-4.68 5.99 5.99 0 0 1 1.45-5.32 6.01 6.01 0 0 1 5.1-2.31h.1a4.97 4.97 0 0 1 2.1 9.24 4.93 4.93 0 0 1-4.9 3.07h.01z" fill="#00A1E0"/>
        </svg>
      )
    },
    { 
      id: "aws", 
      name: "AWS", 
      isConnected: false,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.24-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.128-1.036-.39-1.284-.26-.248-.686-.367-1.284-.367-.276 0-.558.032-.85.096-.292.064-.574.144-.854.24-.128.048-.224.08-.28.096-.056.016-.096.024-.128.024-.104 0-.16-.08-.16-.247v-.391c0-.128.016-.224.056-.28a.626.626 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.856 4.856 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.511.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.262.215-.39.518-.39.917 0 .375.095.647.285.815.192.167.454.248.798.248zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.32L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.311.08.064.048.112.16.16.32l1.342 5.284 1.245-5.284c.04-.16.088-.272.151-.32a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.112.16.151.32l1.261 5.348 1.381-5.348c.048-.16.104-.272.16-.32a.56.56 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.272-.168.32-.064.048-.16.08-.304.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.112-.16-.151-.32l-1.238-5.148-1.23 5.14c-.04.16-.088.272-.152.32-.64.056-.168.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.318.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.343.072-.655.216-.926.144-.27.335-.503.575-.69.24-.183.51-.327.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .167-.064.255-.184.255-.063 0-.176-.032-.336-.096-.399-.168-.87-.247-1.397-.247-.447 0-.806.072-1.07.216-.263.144-.39.375-.39.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.216.935-.144.288-.344.535-.59.727-.248.192-.543.343-.886.448-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.152 11.877 3.152 2.914 0 6.114-.607 9.06-1.852.439-.2.814.288.385.608zm1.093-1.254c-.334-.43-2.22-.207-3.084-.103-.255.032-.295-.193-.063-.36 1.5-1.053 3.967-.75 4.252-.399.286.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.04-2.56.707-2.994z" fill="#232F3E"/>
        </svg>
      )
    }
  ];
  
  const credentialDetails: Record<string, CredentialDetails> = {
    slack: {
      id: "slack",
      name: "Slack Credentials",
      fields: [
        { name: "Workspace URL", value: "acme-corp.slack.com", isSecret: false },
        { name: "Bot User OAuth Token", value: "xoxb-************", isSecret: true },
        { name: "Signing Secret", value: "********", isSecret: true }
      ]
    },
    github: {
      id: "github",
      name: "GitHub Credentials",
      fields: [
        { name: "Organization", value: "", isSecret: false },
        { name: "API Key", value: "", isSecret: true },
        { name: "Webhook Secret", value: "", isSecret: true }
      ]
    },
    jira: {
      id: "jira",
      name: "Jira Credentials",
      fields: [
        { name: "Instance URL", value: "", isSecret: false },
        { name: "API Token", value: "", isSecret: true },
        { name: "Email", value: "", isSecret: false }
      ]
    },
    salesforce: {
      id: "salesforce",
      name: "Salesforce Credentials",
      fields: [
        { name: "Instance URL", value: "", isSecret: false },
        { name: "Client ID", value: "", isSecret: true },
        { name: "Client Secret", value: "", isSecret: true },
        { name: "Username", value: "", isSecret: false }
      ]
    },
    aws: {
      id: "aws",
      name: "AWS Credentials",
      fields: [
        { name: "Access Key ID", value: "", isSecret: false },
        { name: "Secret Access Key", value: "", isSecret: true },
        { name: "Region", value: "", isSecret: false }
      ]
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Credentials Saved",
      description: `Your ${credentialDetails[selectedService!].name} have been saved successfully.`,
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-[#f8f7f6]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Acme Corporation</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Third Party Services</h2>
              <div className="space-y-4">
                {services.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`flex items-center p-3 rounded-md cursor-pointer ${
                      selectedService === service.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="h-8 w-8 mr-3 flex items-center justify-center">
                      {service.icon || (
                        <div className="h-6 w-6 rounded-md bg-gray-200 flex items-center justify-center text-gray-700">
                          {service.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="flex-1">{service.name}</span>
                    {service.isConnected && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Credential Details */}
            {selectedService && credentialDetails[selectedService] && (
              <div className="md:col-span-2 bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 mr-3 flex items-center justify-center">
                    {services.find(s => s.id === selectedService)?.icon || (
                      <div className="h-6 w-6 rounded-md bg-gray-200 flex items-center justify-center text-gray-700">
                        {credentialDetails[selectedService].name.split(' ')[0].charAt(0)}
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-medium">{credentialDetails[selectedService].name}</h2>
                  {services.find(s => s.id === selectedService)?.isConnected && (
                    <div className="ml-auto flex items-center text-sm text-green-600">
                      <Check size={16} className="mr-1" />
                      Connected
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {credentialDetails[selectedService].fields.map((field, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.name}
                      </label>
                      <Input 
                        type={field.isSecret ? "password" : "text"} 
                        value={field.value} 
                        onChange={() => {}} // Would update state in a real app
                        className="w-full border-gray-300"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleSaveChanges} className="bg-black hover:bg-gray-800 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientCredentials;

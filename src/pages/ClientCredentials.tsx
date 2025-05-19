
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface Credential {
  id: string;
  name: string;
  isConnected: boolean;
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

  const [selectedService, setSelectedService] = useState<string | null>("slack");
  
  // Mock credential data
  const services: Credential[] = [
    { id: "slack", name: "Slack", isConnected: true },
    { id: "github", name: "GitHub", isConnected: false },
    { id: "jira", name: "Jira", isConnected: false },
    { id: "salesforce", name: "Salesforce", isConnected: false },
    { id: "aws", name: "AWS", isConnected: false }
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
    }
  };

  const handleSaveChanges = () => {
    console.log("Saving credentials for", selectedService);
    // In a real application, this would save the credentials to the database
  };

  return (
    <div className="flex h-screen bg-[#f8f7f6]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Acme Corporation</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="bg-white rounded-lg border shadow p-6">
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
                      {/* Placeholder for service icon */}
                      <div className="h-6 w-6 rounded-md bg-gray-200 flex items-center justify-center text-gray-700">
                        {service.name.charAt(0)}
                      </div>
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
              <div className="md:col-span-2 bg-white rounded-lg border shadow p-6">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 mr-3 flex items-center justify-center bg-gray-100 rounded-full">
                    {/* Service icon */}
                    <div className="h-6 w-6 rounded-md bg-gray-200 flex items-center justify-center text-gray-700">
                      {credentialDetails[selectedService].name.split(' ')[0].charAt(0)}
                    </div>
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

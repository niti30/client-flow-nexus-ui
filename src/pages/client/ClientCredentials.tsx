
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientSidebar from "@/components/layout/ClientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface ServiceProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

const ClientCredentials = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>({
    id: "slack",
    name: "Slack",
    icon: "slack",
    connected: true
  });
  
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([
    { id: "slack", name: "Slack", icon: "slack", connected: true },
    { id: "github", name: "GitHub", icon: "github", connected: false },
    { id: "jira", name: "Jira", icon: "jira", connected: false },
    { id: "salesforce", name: "Salesforce", icon: "salesforce", connected: false },
    { id: "aws", name: "AWS", icon: "aws", connected: false }
  ]);
  
  const [credentials, setCredentials] = useState({
    workspaceUrl: "acme-corp.slack.com",
    apiToken: "xoxb-************",
    signingSecret: "********"
  });
  
  const handleServiceSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveChanges = () => {
    // In a real application, this would save the credentials to the database
    toast({
      title: "Credentials saved",
      description: `Your ${selectedProvider?.name} credentials have been updated.`,
    });
  };

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Credentials</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Third Party Services</h2>
              <ul className="space-y-4">
                {serviceProviders.map((provider) => (
                  <li key={provider.id} className="relative">
                    <button
                      onClick={() => handleServiceSelect(provider)}
                      className={`w-full flex items-center p-3 rounded-md ${
                        selectedProvider?.id === provider.id
                          ? "bg-green-50 border border-green-200"
                          : "hover:bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div className="mr-3">
                        {provider.id === "slack" && (
                          <span className="flex items-center justify-center h-6 w-6 bg-[#4A154B] rounded text-white text-xs font-bold">#</span>
                        )}
                        {provider.id === "github" && (
                          <svg className="h-6 w-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd"></path>
                          </svg>
                        )}
                        {provider.id === "jira" && (
                          <span className="flex items-center justify-center h-6 w-6 bg-[#0052CC] rounded text-white text-xs font-bold">J</span>
                        )}
                        {provider.id === "salesforce" && (
                          <span className="flex items-center justify-center h-6 w-6 bg-[#00A1E0] rounded text-white text-xs font-bold">SF</span>
                        )}
                        {provider.id === "aws" && (
                          <span className="flex items-center justify-center h-6 w-6 bg-[#232F3E] rounded text-white text-xs font-bold">AWS</span>
                        )}
                      </div>
                      <span className="text-base font-medium">{provider.name}</span>
                      {provider.connected && (
                        <div className="absolute right-3">
                          <div className="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {selectedProvider && (
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  {selectedProvider.id === "slack" && (
                    <span className="flex items-center justify-center h-8 w-8 bg-[#4A154B] rounded text-white text-sm font-bold">#</span>
                  )}
                  <h2 className="text-xl font-semibold">Slack Credentials</h2>
                  {selectedProvider.connected && (
                    <div className="ml-auto flex items-center text-green-600 text-sm font-medium">
                      <div className="mr-1.5">
                        <Check className="h-4 w-4" />
                      </div>
                      Connected
                    </div>
                  )}
                </div>
                
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="workspaceUrl" className="block text-sm font-medium text-gray-700">
                      Workspace URL
                    </label>
                    <Input 
                      id="workspaceUrl"
                      name="workspaceUrl"
                      value={credentials.workspaceUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">
                      Bot User OAuth Token
                    </label>
                    <Input 
                      id="apiToken"
                      name="apiToken"
                      value={credentials.apiToken}
                      onChange={handleInputChange}
                      type="password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signingSecret" className="block text-sm font-medium text-gray-700">
                      Signing Secret
                    </label>
                    <Input 
                      id="signingSecret"
                      name="signingSecret"
                      value={credentials.signingSecret}
                      onChange={handleInputChange}
                      type="password"
                    />
                  </div>
                  
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientCredentials;

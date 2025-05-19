
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import ClientSidebar from "@/components/layout/ClientSidebar";
import ClientHeader from "@/components/layout/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface ServiceCredential {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

interface ServiceDetail {
  id: string;
  name: string;
  workspaceUrl?: string;
  apiToken?: string;
  oauthToken?: string;
  signingSecret?: string;
  connected: boolean;
}

const ClientCredentials = () => {
  const [selectedService, setSelectedService] = useState<string | null>("slack");
  
  // Fetch third-party services
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      // Mock data based on the UI in the image
      return [
        { id: "slack", name: "Slack", icon: "slack-icon", connected: true },
        { id: "github", name: "GitHub", icon: "github-icon", connected: false },
        { id: "jira", name: "Jira", icon: "jira-icon", connected: false },
        { id: "salesforce", name: "Salesforce", icon: "salesforce-icon", connected: false },
        { id: "aws", name: "AWS", icon: "aws-icon", connected: false }
      ] as ServiceCredential[];
    }
  });

  // Fetch details for the selected service
  const { data: serviceDetails } = useQuery({
    queryKey: ['service-details', selectedService],
    queryFn: async () => {
      if (selectedService === "slack") {
        return {
          id: "slack",
          name: "Slack Credentials",
          workspaceUrl: "acme-corp.slack.com",
          oauthToken: "xoxb-************",
          signingSecret: "********",
          connected: true
        } as ServiceDetail;
      }
      return null;
    },
    enabled: !!selectedService
  });
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your credentials have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex gap-6">
              {/* Services List */}
              <div className="w-1/3 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Third Party Services</h2>
                <div className="space-y-4">
                  {services?.map((service) => (
                    <div 
                      key={service.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer border ${selectedService === service.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-center">
                        {service.id === "slack" && (
                          <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                          </svg>
                        )}
                        {service.id === "github" && (
                          <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="#181717"/>
                          </svg>
                        )}
                        {service.id === "jira" && (
                          <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.218 5.218h1.78v1.574A5.218 5.218 0 0 0 12.218 24V12.16a.647.647 0 0 0-.647-.647" fill="#2684FF"/>
                            <path d="M17.782 5.231H6.21a5.218 5.218 0 0 0 5.22 5.218h1.778v1.575a5.218 5.218 0 0 0 5.218 5.218V5.878a.647.647 0 0 0-.646-.647" fill="#2684FF"/>
                            <path d="M23.996 0H12.425a5.218 5.218 0 0 0 5.218 5.218h1.779v1.574A5.218 5.218 0 0 0 24.642 12V.647A.647.647 0 0 0 23.996 0" fill="#2684FF"/>
                          </svg>
                        )}
                        {service.id === "salesforce" && (
                          <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.328 12.883c.438-.623.696-1.38.696-2.202 0-2.122-1.717-3.84-3.84-3.84-.4 0-.782.066-1.147.174-.772-1.487-2.344-2.505-4.157-2.505-2.59 0-4.689 2.099-4.689 4.689 0 .586.114 1.15.314 1.669-.974.548-1.631 1.588-1.631 2.792 0 1.762 1.428 3.19 3.19 3.19.18 0 .355-.023.53-.052.603 1.075 1.741 1.802 3.051 1.802 1.253 0 2.353-.67 2.967-1.664.42.186.88.292 1.374.292 1.834 0 3.322-1.488 3.322-3.322-.002-.68-.208-1.312-.564-1.845z" fill="#00A1E0"/>
                          </svg>
                        )}
                        {service.id === "aws" && (
                          <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.763 10.036c0 .296.032.535.088.716.064.187.169.373.306.553a.466.466 0 0 1 .09.3.414.414 0 0 1-.168.32c-.112.09-.224.134-.337.134-.143 0-.279-.075-.425-.247a2.07 2.07 0 0 1-.454-.689 3.79 3.79 0 0 1-.269-.99 7.42 7.42 0 0 1-.086-1.176c0-.781.129-1.39.388-1.824.259-.435.686-.653 1.277-.653.39 0 .762.08 1.118.243.355.161.644.383.867.662l-.265.388c-.211-.239-.429-.417-.653-.534a1.426 1.426 0 0 0-.693-.17c-.403 0-.714.16-.929.483-.217.323-.323.852-.323 1.582v.335c.21-.335.477-.592.797-.771.32-.18.68-.27 1.073-.27.179 0 .351.023.518.069.167.045.346.128.536.245v.39zM4.973 14.342c.455 0 .826-.12 1.114-.358.287-.239.431-.569.431-.991 0-.175-.018-.364-.055-.565a1.44 1.44 0 0 0-.211-.584 1.374 1.374 0 0 0-.465-.434c-.201-.113-.455-.17-.763-.17-.197 0-.406.04-.624.119a1.738 1.738 0 0 0-.6.373v2.317c.18.07.384.118.61.146.227.026.427.04.6.04l-.037.107zm15.075-2.822c.236.42.354.947.354 1.582 0 .847-.145 1.602-.435 2.268-.29.666-.714 1.184-1.274 1.557-.56.373-1.239.56-2.032.56-.543 0-1.01-.07-1.404-.211a2.653 2.653 0 0 1-.917-.487l.316-.547c.12.106.282.21.485.31.203.1.439.182.705.245.267.064.544.095.834.095.61 0 1.12-.13 1.528-.389.409-.259.719-.635.93-1.128.211-.493.317-1.076.317-1.75 0-.54-.091-.973-.274-1.297a1.175 1.175 0 0 0-.729-.553 1.774 1.774 0 0 0-.934-.022 2.236 2.236 0 0 0-.821.416l-.316-.51c.211-.235.5-.435.864-.602.366-.167.773-.251 1.22-.251.435 0 .835.106 1.202.317.366.211.646.534.841.967zm-10.88.172c.32.353.48.784.48 1.295 0 .389-.075.733-.227 1.03-.15.298-.362.53-.636.694-.273.164-.59.247-.949.247-.37 0-.693-.083-.967-.247a1.636 1.636 0 0 1-.624-.694 2.297 2.297 0 0 1-.22-1.03c0-.511.164-.942.493-1.295.329-.352.76-.528 1.295-.528.524 0 .947.176 1.274.528zm8.422-1.939l-2.326 7.198c-.14.437-.28.809-.421 1.117-.14.308-.32.572-.538.789-.218.218-.485.39-.8.513-.314.123-.715.185-1.203.185-.114 0-.237-.007-.367-.023a2.452 2.452 0 0 1-.316-.05V18.3c.106.02.202.034.292.044.09.01.184.015.284.015.316 0 .572-.064.764-.191a1.27 1.27 0 0 0 .457-.507c.123-.21.228-.492.32-.842l.13-.404-1.951-6.714h1.118l.917 3.264c.088.352.175.704.26 1.059.087.353.171.71.252 1.069a44.33 44.33 0 0 0 .259-1.073c.09-.352.178-.704.266-1.055l.922-3.264h1.081zm-16.78 0v5.397h-1.051v-5.397h1.052zm3.715 4.36c.063-.211.095-.431.095-.66 0-.395-.08-.706-.24-.932-.159-.226-.41-.339-.753-.339-.326 0-.599.113-.818.339-.22.226-.329.537-.329.932 0 .229.033.449.099.66.065.211.163.387.294.528.13.141.288.247.472.32.184.07.392.106.624.106.22 0 .42-.035.6-.107.18-.07.336-.177.468-.32.132-.14.235-.316.313-.527zm10.711-2.376h3.128v.815h-3.128v-.815zm-8.455-1.984h-2.743v5.397H2.93v-4.556h1.898v4.556h1.081v-4.556h1.752v-.841z" fill="#222F3E"/>
                          </svg>
                        )}
                        <span>{service.name}</span>
                      </div>
                      {service.connected && (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Service Details */}
              {serviceDetails && (
                <div className="w-2/3 bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                    </svg>
                    <h2 className="text-xl font-semibold">{serviceDetails.name}</h2>
                    <div className="ml-auto flex items-center">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {serviceDetails.workspaceUrl && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Workspace URL</label>
                        <Input 
                          type="text" 
                          value={serviceDetails.workspaceUrl} 
                          className="w-full"
                          readOnly
                        />
                      </div>
                    )}
                    
                    {serviceDetails.oauthToken && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Bot User OAuth Token</label>
                        <Input 
                          type="password" 
                          value={serviceDetails.oauthToken} 
                          className="w-full"
                          readOnly
                        />
                      </div>
                    )}
                    
                    {serviceDetails.signingSecret && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Signing Secret</label>
                        <Input 
                          type="password" 
                          value={serviceDetails.signingSecret} 
                          className="w-full"
                          readOnly
                        />
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        className="bg-black text-white hover:bg-gray-800" 
                        onClick={handleSaveChanges}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientCredentials;

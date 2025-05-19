
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Engineer {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface ClientSupportEngineersProps {
  clientId: string;
}

export function ClientSupportEngineers({ clientId }: ClientSupportEngineersProps) {
  const { toast } = useToast();
  
  // Mock data for engineers
  const engineers: Engineer[] = [
    { id: '1', name: 'John Smith', role: 'Lead SE', avatar: '' },
    { id: '2', name: 'Sarah Johnson', role: 'Support SE', avatar: '' },
  ];

  const handleAddEngineer = () => {
    toast({
      title: "Add Engineer",
      description: "This functionality will be implemented soon.",
    });
  };

  return (
    <div>
      <div className="flex space-x-6 items-start mb-4">
        {engineers.map((engineer) => (
          <div key={engineer.id} className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={engineer.avatar} alt={engineer.name} />
              <AvatarFallback className="bg-gray-200 text-gray-700">
                {engineer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium">{engineer.name}</div>
            <div className="text-sm text-gray-500">{engineer.role}</div>
          </div>
        ))}
        <Button 
          onClick={handleAddEngineer}
          variant="outline" 
          className="h-16 w-16 rounded-full flex items-center justify-center border-dashed mt-2"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

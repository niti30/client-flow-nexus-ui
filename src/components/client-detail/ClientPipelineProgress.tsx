
import React, { useState } from 'react';
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface PipelineStep {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedDate?: string;
}

interface ClientPipelineProgressProps {
  clientId: string;
}

export function ClientPipelineProgress({ clientId }: ClientPipelineProgressProps) {
  const { toast } = useToast();
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    { 
      id: '1', 
      title: 'Discovery: Initial Survey', 
      status: 'completed', 
      completedDate: 'Jan 15, 2025' 
    },
    { 
      id: '2', 
      title: 'Discovery: Process Deep Dive', 
      status: 'completed', 
      completedDate: 'Jan 20, 2025' 
    },
    { 
      id: '3', 
      title: 'ADA Proposal Sent', 
      status: 'completed', 
      completedDate: 'Jan 25, 2025' 
    },
    { 
      id: '4', 
      title: 'ADA Proposal Review', 
      status: 'in_progress'
    },
    { 
      id: '5', 
      title: 'ADA Contract Sent', 
      status: 'pending'
    },
    { 
      id: '6', 
      title: 'ADA Contract Signed', 
      status: 'pending'
    },
    { 
      id: '7', 
      title: 'Credentials Collected', 
      status: 'pending'
    },
    { 
      id: '8', 
      title: 'Factory Build Initiated', 
      status: 'pending'
    },
    { 
      id: '9', 
      title: 'Test Plan Generated', 
      status: 'pending'
    },
    { 
      id: '10', 
      title: 'Testing Started', 
      status: 'pending'
    },
    { 
      id: '11', 
      title: 'Production Deploy', 
      status: 'pending'
    },
  ]);

  const markComplete = (stepId: string) => {
    setPipelineSteps(steps => 
      steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              status: 'completed', 
              completedDate: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }) 
            } 
          : step
      )
    );
    
    toast({
      title: "Step Completed",
      description: "Pipeline step marked as completed.",
    });
  };

  return (
    <div className="space-y-4">
      {pipelineSteps.map((step) => (
        <div key={step.id} className="flex items-center gap-4">
          {step.status === 'completed' ? (
            <div className="bg-green-500 text-white rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <Circle className="h-6 w-6 text-gray-300" />
          )}
          
          <div className="flex-1">
            <div className="font-medium">{step.title}</div>
            {step.completedDate && (
              <div className="text-xs text-gray-500">Completed on {step.completedDate}</div>
            )}
          </div>
          
          {step.status === 'in_progress' && (
            <Button size="sm" onClick={() => markComplete(step.id)}>
              Mark Complete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

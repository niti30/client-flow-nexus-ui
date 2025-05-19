import React, { useState, useEffect } from 'react';
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch pipeline steps from database when component mounts
  useEffect(() => {
    const fetchPipelineSteps = async () => {
      try {
        // In a real application, we would fetch the pipeline steps from the database
        // For now, we'll use the mock data
        console.log('Fetching pipeline steps for client:', clientId);
        
        // In a real application with Supabase, you would do something like:
        // const { data, error } = await supabase
        //   .from('pipeline_steps')
        //   .select('*')
        //   .eq('client_id', clientId)
        //   .order('id', { ascending: true });
        
        // if (error) {
        //   console.error('Error fetching pipeline steps:', error);
        //   return;
        // }
        
        // if (data) {
        //   setPipelineSteps(data);
        // }
      } catch (error) {
        console.error('Failed to fetch pipeline steps:', error);
      }
    };

    fetchPipelineSteps();
  }, [clientId]);

  const markComplete = async (stepId: string) => {
    try {
      // Find the current step index
      const currentIndex = pipelineSteps.findIndex(step => step.id === stepId);
      if (currentIndex === -1) return;
      
      // Create a copy of the pipeline steps
      const updatedSteps = [...pipelineSteps];
      
      // Update the current step to completed
      updatedSteps[currentIndex] = {
        ...updatedSteps[currentIndex],
        status: 'completed',
        completedDate: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      };
      
      // Find the next step to mark as in_progress
      if (currentIndex < updatedSteps.length - 1) {
        updatedSteps[currentIndex + 1] = {
          ...updatedSteps[currentIndex + 1],
          status: 'in_progress'
        };
      }
      
      // Update the state first for immediate UI feedback
      setPipelineSteps(updatedSteps);
      
      // In a real application, save changes to the database
      // For example with Supabase:
      // const { error } = await supabase
      //   .from('pipeline_steps')
      //   .update({ 
      //     status: 'completed',
      //     completed_date: new Date().toISOString()
      //   })
      //   .eq('id', stepId);
      
      // if (error) throw error;
      
      // If we have a next step, update it to in_progress
      // if (currentIndex < updatedSteps.length - 1) {
      //   const nextStepId = updatedSteps[currentIndex + 1].id;
      //   const { error: nextError } = await supabase
      //     .from('pipeline_steps')
      //     .update({ status: 'in_progress' })
      //     .eq('id', nextStepId);
      //   
      //   if (nextError) throw nextError;
      // }
      
      // Show success message
      toast({
        title: "Step Completed",
        description: `${updatedSteps[currentIndex].title} marked as completed.`,
      });
    } catch (error) {
      console.error('Error updating pipeline step:', error);
      toast({
        title: "Error",
        description: "Failed to update pipeline step.",
        variant: "destructive"
      });
    }
  };

  // Function to determine if the step is the next in line to be completed
  const isNextInSequence = (step: PipelineStep, index: number): boolean => {
    // If it's already in_progress, it's the next to complete
    if (step.status === 'in_progress') return true;
    
    // Otherwise, check if it's the first pending step after all completed steps
    if (step.status === 'pending' && index > 0) {
      const previousStepsCompleted = pipelineSteps
        .slice(0, index)
        .every(prevStep => prevStep.status === 'completed');
      
      return previousStepsCompleted;
    }
    
    return false;
  };

  return (
    <div className="space-y-4">
      {pipelineSteps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-4">
          {step.status === 'completed' ? (
            <div className="bg-green-500 text-white rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <Circle className={`h-6 w-6 ${step.status === 'in_progress' ? 'text-black' : 'text-gray-300'}`} />
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

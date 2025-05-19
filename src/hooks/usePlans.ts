
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface Plan {
  id: string;
  name: string;
  pricingModel: string;
  contractLength: string;
  billingCadence: string;
  setupFee: string;
  prepaymentPercentage: string;
  cap: string;
  overageCost: string;
  clientCount: number;
}

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded data for now
  const mockPlans = [
    {
      id: '1',
      name: 'Enterprise Pro',
      pricingModel: 'Tiered',
      contractLength: '12 months',
      billingCadence: 'Monthly',
      setupFee: '$5,000',
      prepaymentPercentage: '25%',
      cap: '$100,000',
      overageCost: '$150/hr',
      clientCount: 12
    },
    {
      id: '2',
      name: 'Business Plus',
      pricingModel: 'Fixed',
      contractLength: '6 months',
      billingCadence: 'Quarterly',
      setupFee: '$2,500',
      prepaymentPercentage: '15%',
      cap: '$50,000',
      overageCost: '$125/hr',
      clientCount: 28
    },
    {
      id: '3',
      name: 'Starter',
      pricingModel: 'Usage',
      contractLength: '3 months',
      billingCadence: 'Monthly',
      setupFee: '$1,000',
      prepaymentPercentage: '10%',
      cap: '$25,000',
      overageCost: '$100/hr',
      clientCount: 45
    }
  ];

  const fetchPlans = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('plans')
      //   .select(`
      //     *,
      //     subscriptions:subscriptions(client_id)
      //   `);
      
      // if (error) {
      //   console.error('Error fetching plans:', error);
      // } else {
      //   // Process the data
      //   setPlans(data || []);
      // }
      
      // Using mockData for now
      setPlans(mockPlans);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const addPlan = async (planData: any) => {
    try {
      // In a real implementation, we would add to Supabase
      // const { data, error } = await supabase
      //   .from('plans')
      //   .insert([planData])
      //   .select();
      
      // if (error) {
      //   console.error('Error adding plan:', error);
      //   return false;
      // } 
      
      // Mock adding plan
      const newPlan = {
        id: Date.now().toString(),
        ...planData
      };
      
      setPlans([...plans, newPlan]);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  return { plans, loading, fetchPlans, addPlan };
};


import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DashboardMetricsProps {
  timeframe: string;
}

interface MetricsData {
  totalSaved: { value: number, change: number },
  avgCycleTime: { value: number, change: number },
  exceptions: { value: number, change: number }
}

const DashboardMetrics = ({ timeframe }: DashboardMetricsProps) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<MetricsData>({
    totalSaved: { value: 0, change: 0 },
    avgCycleTime: { value: 0, change: 0 },
    exceptions: { value: 0, change: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Call the Supabase function to get metrics based on timeframe
        const { data, error } = await supabase.rpc('get_dashboard_metrics', {
          time_period: timeframe
        });
        
        if (error) {
          console.error("Error fetching dashboard metrics:", error);
          toast({
            title: "Error fetching metrics",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        console.log("Fetched dashboard metrics:", data);
        
        // Set placeholder change percentages based on timeframe
        let changeValues = { 
          saved: 5.2, 
          cycleTime: -8.4, 
          exceptions: 2.5 
        };
        
        if (timeframe === '30d') {
          changeValues = { 
            saved: 12.1, 
            cycleTime: -5.1, 
            exceptions: -3.2 
          };
        } else if (timeframe === 'ytd') {
          changeValues = { 
            saved: 18.5, 
            cycleTime: -12.7, 
            exceptions: -8.9 
          };
        }
        
        // Format the metrics for display
        setMetrics({
          totalSaved: { 
            value: Math.round(data.timeSaved), 
            change: changeValues.saved 
          },
          avgCycleTime: { 
            value: 3.2, // Placeholder - would be calculated from actual cycle time data
            change: changeValues.cycleTime 
          },
          exceptions: { 
            value: data.totalExceptions, 
            change: changeValues.exceptions 
          }
        });
      } catch (error) {
        console.error("Error in metrics fetch:", error);
        toast({
          title: "Unexpected error",
          description: "Failed to fetch metrics. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeframe, toast]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
      {/* Total $ Saved Card */}
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-medium">Total $ Saved</p>
              <p className="text-3xl font-bold mt-2">${loading ? "..." : metrics.totalSaved.value.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {metrics.totalSaved.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metrics.totalSaved.change > 0 ? "text-green-500" : "text-red-500"}>
                  {metrics.totalSaved.change > 0 ? "+" : ""}{metrics.totalSaved.change}%
                </span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avg Cycle Time Card */}
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-medium">Avg Cycle Time</p>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : metrics.avgCycleTime.value} days</p>
              <div className="flex items-center mt-1">
                {metrics.avgCycleTime.change < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metrics.avgCycleTime.change < 0 ? "text-green-500" : "text-red-500"}>
                  {metrics.avgCycleTime.change > 0 ? "+" : ""}{metrics.avgCycleTime.change}%
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exceptions Card */}
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-medium"># Exceptions</p>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : metrics.exceptions.value}</p>
              <div className="flex items-center mt-1">
                {metrics.exceptions.change < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metrics.exceptions.change < 0 ? "text-green-500" : "text-red-500"}>
                  {metrics.exceptions.change > 0 ? "+" : ""}{metrics.exceptions.change}%
                </span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;

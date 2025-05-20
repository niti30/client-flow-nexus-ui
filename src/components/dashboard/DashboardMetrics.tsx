import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";

interface DashboardMetricsProps {
  timeframe: string;
}

const DashboardMetrics = ({ timeframe }: DashboardMetricsProps) => {
  const [metrics, setMetrics] = useState({
    totalSaved: { value: 0, change: 0 },
    avgCycleTime: { value: 0, change: 0 },
    exceptions: { value: 0, change: 0 }
  });

  useEffect(() => {
    // In a real app, we'd fetch metrics from Supabase based on the timeframe
    // For now, we'll use placeholder data
    switch (timeframe) {
      case "7d":
        setMetrics({
          totalSaved: { value: 12500, change: 5.2 },
          avgCycleTime: { value: 3.2, change: -8.4 },
          exceptions: { value: 12, change: 2.5 }
        });
        break;
      case "30d":
        setMetrics({
          totalSaved: { value: 42800, change: 12.1 },
          avgCycleTime: { value: 3.8, change: -5.1 },
          exceptions: { value: 48, change: -3.2 }
        });
        break;
      // Other timeframes would have similar logic
      default:
        setMetrics({
          totalSaved: { value: 12500, change: 5.2 },
          avgCycleTime: { value: 3.2, change: -8.4 },
          exceptions: { value: 12, change: 2.5 }
        });
    }
  }, [timeframe]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
      {/* Total $ Saved Card */}
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-medium">Total $ Saved</p>
              <p className="text-3xl font-bold mt-2">${metrics.totalSaved.value.toLocaleString()}</p>
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
              <p className="text-3xl font-bold mt-2">{metrics.avgCycleTime.value} days</p>
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
              <p className="text-3xl font-bold mt-2">{metrics.exceptions.value}</p>
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


import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";

interface DashboardMetricsProps {
  timeframe: string;
}

const DashboardMetrics = ({ timeframe }: DashboardMetricsProps) => {
  const { clientMetrics, loading } = useWorkflows(timeframe);
  const [metrics, setMetrics] = useState({
    totalSaved: { value: 0, change: 0 },
    avgCycleTime: { value: 0, change: 0 },
    exceptions: { value: 0, change: 0 }
  });

  useEffect(() => {
    // Calculate metrics based on client data
    if (!loading && clientMetrics.length > 0) {
      // Calculate total saved amount from client metrics
      const totalMoneySaved = clientMetrics.reduce((sum, client) => {
        const moneyValue = parseInt(client.moneySaved.replace('$', '').replace('K', ''), 10) || 0;
        return sum + moneyValue;
      }, 0);

      // Calculate total exceptions
      const totalExceptions = clientMetrics.reduce((sum, client) => sum + client.exceptions, 0);

      // Set metrics based on timeframe
      switch (timeframe) {
        case "7d":
          setMetrics({
            totalSaved: { value: totalMoneySaved, change: 5.2 },
            avgCycleTime: { value: 3.2, change: -8.4 },
            exceptions: { value: totalExceptions, change: 2.5 }
          });
          break;
        case "30d":
          setMetrics({
            totalSaved: { value: totalMoneySaved, change: 12.1 },
            avgCycleTime: { value: 3.8, change: -5.1 },
            exceptions: { value: totalExceptions, change: -3.2 }
          });
          break;
        case "mtd":
          setMetrics({
            totalSaved: { value: totalMoneySaved, change: 7.5 },
            avgCycleTime: { value: 3.5, change: -6.2 },
            exceptions: { value: totalExceptions, change: 1.8 }
          });
          break;
        case "qtd":
          setMetrics({
            totalSaved: { value: totalMoneySaved, change: 9.3 },
            avgCycleTime: { value: 3.6, change: -5.8 },
            exceptions: { value: totalExceptions, change: -2.1 }
          });
          break;
        case "ytd":
          setMetrics({
            totalSaved: { value: totalMoneySaved, change: 10.5 },
            avgCycleTime: { value: 3.7, change: -6.5 },
            exceptions: { value: totalExceptions, change: -1.5 }
          });
          break;
        default:
          setMetrics({
            totalSaved: { value: totalMoneySaved, change: 5.2 },
            avgCycleTime: { value: 3.2, change: -8.4 },
            exceptions: { value: totalExceptions, change: 2.5 }
          });
      }
    }
  }, [timeframe, clientMetrics, loading]);

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

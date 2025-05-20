import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
interface DashboardMetricsProps {
  timeframe: string;
}
const DashboardMetrics = ({
  timeframe
}: DashboardMetricsProps) => {
  const {
    clientMetrics,
    loading
  } = useWorkflows(timeframe);
  const [metrics, setMetrics] = useState({
    totalSaved: {
      value: 0,
      change: 0
    },
    avgCycleTime: {
      value: 0,
      change: 0
    },
    exceptions: {
      value: 0,
      change: 0
    }
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
            totalSaved: {
              value: totalMoneySaved,
              change: 5.2
            },
            avgCycleTime: {
              value: 3.2,
              change: -8.4
            },
            exceptions: {
              value: totalExceptions,
              change: 2.5
            }
          });
          break;
        case "30d":
          setMetrics({
            totalSaved: {
              value: totalMoneySaved,
              change: 12.1
            },
            avgCycleTime: {
              value: 3.8,
              change: -5.1
            },
            exceptions: {
              value: totalExceptions,
              change: -3.2
            }
          });
          break;
        case "mtd":
          setMetrics({
            totalSaved: {
              value: totalMoneySaved,
              change: 7.5
            },
            avgCycleTime: {
              value: 3.5,
              change: -6.2
            },
            exceptions: {
              value: totalExceptions,
              change: 1.8
            }
          });
          break;
        case "qtd":
          setMetrics({
            totalSaved: {
              value: totalMoneySaved,
              change: 9.3
            },
            avgCycleTime: {
              value: 3.6,
              change: -5.8
            },
            exceptions: {
              value: totalExceptions,
              change: -2.1
            }
          });
          break;
        case "ytd":
          setMetrics({
            totalSaved: {
              value: totalMoneySaved,
              change: 10.5
            },
            avgCycleTime: {
              value: 3.7,
              change: -6.5
            },
            exceptions: {
              value: totalExceptions,
              change: -1.5
            }
          });
          break;
        default:
          setMetrics({
            totalSaved: {
              value: totalMoneySaved,
              change: 5.2
            },
            avgCycleTime: {
              value: 3.2,
              change: -8.4
            },
            exceptions: {
              value: totalExceptions,
              change: 2.5
            }
          });
      }
    }
  }, [timeframe, clientMetrics, loading]);
  return;
};
export default DashboardMetrics;
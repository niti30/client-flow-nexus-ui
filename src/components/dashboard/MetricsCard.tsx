
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const MetricsCard = ({ title, value, trend }: MetricsCardProps) => {
  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-700">{title}</h3>
          {trend && (
            <div className={`flex items-center text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.positive ? (
                <span className="flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  {trend.value}%
                </span>
              ) : (
                <span className="flex items-center">
                  <TrendingDown size={16} className="mr-1" />
                  {trend.value}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
    </Card>
  );
};

export default MetricsCard;

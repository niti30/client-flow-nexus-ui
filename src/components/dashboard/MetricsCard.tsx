
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="shadow-sm h-full">
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {trend && (
              <div className={`flex items-center text-xs font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? (
                  <span className="flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    +{trend.value}%
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
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;

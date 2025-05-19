
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
      <CardContent className="p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-gray-500">{title}</h3>
            {trend && (
              <div className={`flex items-center text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {trend.positive ? '+' : ''}{trend.value}%
              </div>
            )}
          </div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;

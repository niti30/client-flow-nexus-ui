
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
    <Card className="border border-gray-200 rounded-xl shadow-none h-full p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-normal text-gray-900">{title}</h3>
          {trend && (
            <div className={`flex items-center text-sm ${trend.positive ? 'text-[#1D8560]' : 'text-[#CE4343]'}`}>
              {trend.positive ? (
                <span className="flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  {trend.value}%
                </span>
              ) : (
                <span className="flex items-center">
                  <TrendingDown size={12} className="mr-1" />
                  {trend.value}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-3xl font-normal text-gray-900">{value}</div>
      </div>
    </Card>
  );
};

export default MetricsCard;

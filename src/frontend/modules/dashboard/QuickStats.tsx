import React from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  CreditCard,
  DollarSign,
  PercentIcon,
  BarChart3,
  Info,
} from "lucide-react";

interface StatCardProps {
  title: string;
  titleAr: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  tooltip?: string;
  tooltipAr?: string;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  titleAr,
  value,
  change,
  icon,
  color,
  tooltip,
  tooltipAr,
  prefix,
  suffix,
}) => {
  const { direction } = useLanguage();
  const rtl = direction === "rtl";

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {rtl ? titleAr : title}
              </p>
              {(tooltip || tooltipAr) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{rtl && tooltipAr ? tooltipAr : tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <h3 className="text-2xl font-bold">
              {prefix}
              {value}
              {suffix}
            </h3>
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <Badge
                variant={change > 0 ? "default" : "destructive"}
                className="text-xs font-medium"
              >
                {change > 0 ? "+" : ""}
                {change}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                {rtl ? "من الشهر الماضي" : "from last month"}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickStats: React.FC = () => {
  const { direction } = useLanguage();
  const rtl = direction === "rtl";

  const stats = [
    {
      title: "Total Revenue",
      titleAr: "إجمالي الإيرادات",
      value: "24,532",
      prefix: "$",
      change: 12.5,
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      tooltip: "Total revenue from all sales channels",
      tooltipAr: "إجمالي الإيرادات من جميع قنوات المبيعات",
    },
    {
      title: "New Customers",
      titleAr: "عملاء جدد",
      value: 573,
      change: 8.2,
      icon: <Users className="h-6 w-6" />,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      tooltip: "New customer registrations this month",
      tooltipAr: "تسجيلات العملاء الجدد هذا الشهر",
    },
    {
      title: "Total Orders",
      titleAr: "إجمالي الطلبات",
      value: "1,284",
      change: -3.1,
      icon: <ShoppingCart className="h-6 w-6" />,
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      tooltip: "Total number of orders processed",
      tooltipAr: "إجمالي عدد الطلبات التي تمت معالجتها",
    },
    {
      title: "Conversion Rate",
      titleAr: "معدل التحويل",
      value: "3.6",
      suffix: "%",
      change: 4.3,
      icon: <PercentIcon className="h-6 w-6" />,
      color:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      tooltip: "Percentage of visitors who completed a purchase",
      tooltipAr: "نسبة الزوار الذين أكملوا عملية شراء",
    },
    {
      title: "Average Order Value",
      titleAr: "متوسط قيمة الطلب",
      value: "87.25",
      prefix: "$",
      change: 2.8,
      icon: <CreditCard className="h-6 w-6" />,
      color:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      tooltip: "Average value of each order",
      tooltipAr: "متوسط قيمة كل طلب",
    },
    {
      title: "Website Traffic",
      titleAr: "حركة الموقع",
      value: "12,845",
      change: 15.3,
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
      tooltip: "Total website visitors this month",
      tooltipAr: "إجمالي زوار الموقع هذا الشهر",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default QuickStats;

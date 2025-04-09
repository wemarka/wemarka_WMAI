import React from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Sparkles, Clock, ArrowRight, Download, Trash2 } from "lucide-react";
import { Badge } from "@/frontend/components/ui/badge";
import { cn } from "@/frontend/lib/utils";

interface HistoryItem {
  id: string;
  date: Date;
  topic: string;
  preview: string;
  module: string;
}

interface AIAssistantHistoryProps {
  onSelectConversation: (id: string) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
}

const AIAssistantHistory: React.FC<AIAssistantHistoryProps> = ({
  onSelectConversation,
  onClearHistory,
  onExportHistory,
}) => {
  const { direction, language } = useLanguage();
  const isRTL = direction === "rtl";

  // Sample history data (in a real app, this would come from a database or local storage)
  const historyItems: HistoryItem[] = [
    {
      id: "1",
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      topic: isRTL ? "تحليل المبيعات" : "Sales Analysis",
      preview: isRTL
        ? "تحليل أداء المبيعات وتوصيات لتحسين الأداء"
        : "Analysis of sales performance and recommendations for improvement",
      module: isRTL ? "المتجر" : "Store",
    },
    {
      id: "2",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      topic: isRTL ? "توقعات الإيرادات" : "Revenue Forecast",
      preview: isRTL
        ? "توقعات الإيرادات للربع القادم بناءً على البيانات الحالية"
        : "Revenue forecasts for the next quarter based on current data",
      module: isRTL ? "المحاسبة" : "Accounting",
    },
    {
      id: "3",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      topic: isRTL ? "تحسين حملات التسويق" : "Marketing Campaign Optimization",
      preview: isRTL
        ? "اقتراحات لتحسين أداء حملات التسويق وزيادة معدل التحويل"
        : "Suggestions for improving marketing campaign performance and increasing conversion rates",
      module: isRTL ? "التسويق" : "Marketing",
    },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return isRTL
        ? `منذ ${diffMins} ${diffMins === 1 ? "دقيقة" : "دقائق"}`
        : `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return isRTL
        ? `منذ ${diffHours} ${diffHours === 1 ? "ساعة" : "ساعات"}`
        : `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else {
      return isRTL
        ? `منذ ${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`
        : `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <Card className="w-full h-full bg-card rounded-lg shadow-sm border flex flex-col overflow-hidden">
      <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Clock
            className={cn("h-5 w-5 text-primary", isRTL ? "ml-2" : "mr-2")}
          />
          {isRTL ? "سجل المحادثات" : "Conversation History"}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportHistory}
            className="text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            {isRTL ? "تصدير" : "Export"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            className="text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            {isRTL ? "مسح" : "Clear"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {isRTL
                ? "لا توجد محادثات سابقة. ابدأ محادثة جديدة مع المساعد الذكي."
                : "No previous conversations. Start a new conversation with the AI assistant."}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectConversation(item.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm flex items-center">
                    <Sparkles
                      className={cn(
                        "h-4 w-4 text-primary",
                        isRTL ? "ml-1.5" : "mr-1.5",
                      )}
                    />
                    {item.topic}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    {item.module}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {item.preview}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-primary"
                  >
                    {isRTL ? "فتح المحادثة" : "Open Conversation"}
                    <ArrowRight
                      className={cn(
                        "h-3 w-3",
                        isRTL ? "mr-1 rotate-180" : "ml-1",
                      )}
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistantHistory;

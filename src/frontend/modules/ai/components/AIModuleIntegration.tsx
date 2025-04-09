import React from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Bot,
  Lightbulb,
  Zap,
  LineChart,
  FileText,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface AIModuleIntegrationProps {
  module: string;
  onPrompt: (prompt: string) => void;
}

const AIModuleIntegration: React.FC<AIModuleIntegrationProps> = ({
  module,
  onPrompt,
}) => {
  const { direction, language } = useLanguage();
  const { t } = useTranslation();
  const isRTL = direction === "rtl";

  // Define module-specific AI suggestions
  const getSuggestions = (): {
    icon: React.ReactNode;
    text: string;
    prompt: string;
  }[] => {
    switch (module) {
      case "Dashboard":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: isRTL ? "تحليل مؤشرات الأداء" : "Analyze KPIs",
            prompt: isRTL
              ? "تحليل مؤشرات الأداء الحالية واقتراح تحسينات"
              : "Analyze my current KPIs and suggest improvements",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "إنشاء تقرير" : "Generate report",
            prompt: isRTL
              ? "إنشاء تقرير أداء أسبوعي"
              : "Generate a weekly performance report",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "نصائح للتحسين" : "Optimization tips",
            prompt: isRTL
              ? "اقتراح طرق لتحسين عمليات الأعمال"
              : "Suggest ways to optimize my business operations",
          },
        ];
      case "Store":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: isRTL ? "تحليل المخزون" : "Inventory analysis",
            prompt: isRTL
              ? "تحليل المخزون واقتراح أولويات إعادة التخزين"
              : "Analyze my inventory and suggest restocking priorities",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "توقعات المبيعات" : "Sales forecast",
            prompt: isRTL
              ? "توقع المبيعات للشهر القادم بناءً على الاتجاهات الحالية"
              : "Forecast sales for the next month based on current trends",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "توصيات المنتجات" : "Product recommendations",
            prompt: isRTL
              ? "اقتراح منتجات جديدة بناءً على أنماط المبيعات الحالية"
              : "Suggest new products based on current sales patterns",
          },
        ];
      case "Accounting":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: isRTL ? "تحليل النفقات" : "Expense analysis",
            prompt: isRTL
              ? "تحليل النفقات واقتراح فرص توفير التكاليف"
              : "Analyze my expenses and suggest cost-saving opportunities",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "ملخص الفواتير" : "Invoice summary",
            prompt: isRTL
              ? "تلخيص الفواتير المستحقة واقتراح استراتيجيات التحصيل"
              : "Summarize outstanding invoices and suggest collection strategies",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "تحسين التدفق النقدي" : "Cash flow optimization",
            prompt: isRTL
              ? "اقتراح طرق لتحسين التدفق النقدي بناءً على البيانات المالية الحالية"
              : "Suggest ways to optimize cash flow based on current financials",
          },
        ];
      case "Marketing":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: isRTL ? "تحليل الحملات" : "Campaign analysis",
            prompt: isRTL
              ? "تحليل حملات التسويق واقتراح تحسينات"
              : "Analyze my marketing campaigns and suggest improvements",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "أفكار المحتوى" : "Content ideas",
            prompt: isRTL
              ? "توليد أفكار محتوى لقنوات التواصل الاجتماعي"
              : "Generate content ideas for my social media channels",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "رؤى الجمهور" : "Audience insights",
            prompt: isRTL
              ? "تقديم رؤى حول الجمهور المستهدف واستراتيجيات المشاركة"
              : "Provide insights about my target audience and engagement strategies",
          },
        ];
      case "Analytics":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: isRTL ? "تفسير البيانات" : "Data interpretation",
            prompt: isRTL
              ? "تفسير بيانات التحليلات الحالية وإبراز الرؤى الرئيسية"
              : "Interpret my current analytics data and highlight key insights",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "تقرير مخصص" : "Custom report",
            prompt: isRTL
              ? "إنشاء تقرير مخصص عن سلوك المستخدم ومعدلات التحويل"
              : "Generate a custom report on user behavior and conversion rates",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "فرص النمو" : "Growth opportunities",
            prompt: isRTL
              ? "تحديد فرص النمو بناءً على التحليلات الحالية"
              : "Identify growth opportunities based on current analytics",
          },
        ];
      case "Customers":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: isRTL ? "تحليل الشرائح" : "Segment analysis",
            prompt: isRTL
              ? "تحليل شرائح العملاء وتقديم استراتيجيات الاستهداف"
              : "Analyze my customer segments and provide targeting strategies",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "استراتيجيات الاحتفاظ" : "Retention strategies",
            prompt: isRTL
              ? "اقتراح استراتيجيات الاحتفاظ بالعملاء بناءً على البيانات الحالية"
              : "Suggest customer retention strategies based on current data",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "برنامج الولاء" : "Loyalty program",
            prompt: isRTL
              ? "تصميم برنامج ولاء للعملاء لعملي"
              : "Design a customer loyalty program for my business",
          },
        ];
      default:
        return [
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: isRTL ? "الحصول على اقتراحات" : "Get suggestions",
            prompt: isRTL
              ? `تقديم اقتراحات الذكاء الاصطناعي لوحدة ${module}`
              : `Provide AI suggestions for the ${module} module`,
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: isRTL ? "إنشاء تقرير" : "Generate report",
            prompt: isRTL
              ? `إنشاء تقرير لوحدة ${module}`
              : `Generate a report for the ${module} module`,
          },
          {
            icon: <Zap className="h-4 w-4" />,
            text: isRTL ? "إجراءات سريعة" : "Quick actions",
            prompt: isRTL
              ? `ما هي الإجراءات السريعة التي يمكنني اتخاذها في وحدة ${module}؟`
              : `What quick actions can I take in the ${module} module?`,
          },
        ];
    }
  };

  const suggestions = getSuggestions();

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Bot
            className={cn("h-5 w-5 text-primary", isRTL ? "ml-2" : "mr-2")}
          />
          <h3 className="text-sm font-medium">{t("ai.suggestions")}</h3>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-background hover:bg-primary/10"
              onClick={() => onPrompt(suggestion.prompt)}
            >
              <div className={cn("text-primary", isRTL ? "ml-2" : "mr-2")}>
                {suggestion.icon}
              </div>
              {suggestion.text}
              <Sparkles
                className={cn(
                  "h-3 w-3 text-primary",
                  isRTL ? "mr-auto" : "ml-auto",
                )}
              />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModuleIntegration;

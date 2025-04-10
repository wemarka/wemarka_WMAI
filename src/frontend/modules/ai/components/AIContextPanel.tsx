import React, { useState } from "react";
import { useAI } from "@/frontend/contexts/AIContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  ChevronRight,
  Lightbulb,
  BarChart,
  Sparkles,
  X,
  MessageSquare,
  FileText,
  Zap,
} from "lucide-react";
import { cn } from "@/frontend/lib/utils";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface AIContextPanelProps {
  moduleName: string;
  className?: string;
  onClose?: () => void;
}

type ModulePrompt = {
  title: string;
  prompt: string;
  icon: React.ReactNode;
};

const AIContextPanel: React.FC<AIContextPanelProps> = ({
  moduleName,
  className,
  onClose,
}) => {
  const { promptAIAssistant, toggleAIAssistant } = useAI();
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [isExpanded, setIsExpanded] = useState(true);

  // Module-specific prompts
  const getModulePrompts = (module: string): ModulePrompt[] => {
    const moduleMap: Record<string, ModulePrompt[]> = {
      Dashboard: [
        {
          title: isRTL ? "ملخص الأداء" : "Performance Summary",
          prompt: "Generate a summary of my business performance for today",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "المهام ذات الأولوية" : "Priority Tasks",
          prompt: "What tasks should I prioritize today based on my dashboard?",
          icon: <Zap className="h-4 w-4" />,
        },
        {
          title: isRTL ? "توقعات الأعمال" : "Business Forecast",
          prompt:
            "Predict my business trends for the next week based on current data",
          icon: <Lightbulb className="h-4 w-4" />,
        },
      ],
      Store: [
        {
          title: isRTL ? "تحليل المبيعات" : "Sales Analysis",
          prompt: "Analyze my store sales performance for the past week",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "اقتراحات المنتجات" : "Product Suggestions",
          prompt:
            "Suggest new products based on my current inventory and sales trends",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحسين المخزون" : "Inventory Optimization",
          prompt: "How can I optimize my current inventory levels?",
          icon: <Sparkles className="h-4 w-4" />,
        },
      ],
      Accounting: [
        {
          title: isRTL ? "ملخص مالي" : "Financial Summary",
          prompt: "Generate a summary of my financial position",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: isRTL ? "فرص خفض التكاليف" : "Cost-Cutting Opportunities",
          prompt: "Identify potential areas where I can reduce expenses",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "توقعات التدفق النقدي" : "Cash Flow Forecast",
          prompt:
            "Predict my cash flow for the next month based on current data",
          icon: <BarChart className="h-4 w-4" />,
        },
      ],
      Marketing: [
        {
          title: isRTL ? "أفكار للحملات" : "Campaign Ideas",
          prompt: "Suggest marketing campaign ideas for my business",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحليل أداء التسويق" : "Marketing Performance",
          prompt: "Analyze the performance of my recent marketing campaigns",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "إنشاء محتوى" : "Content Generation",
          prompt: "Generate social media content for my business",
          icon: <MessageSquare className="h-4 w-4" />,
        },
      ],
      Analytics: [
        {
          title: isRTL ? "تحليل الاتجاهات" : "Trend Analysis",
          prompt: "Identify key trends in my business data",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "توصيات تحسين الأداء" : "Performance Recommendations",
          prompt: "What actions should I take based on my analytics data?",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تقرير المقارنة" : "Comparative Report",
          prompt: "Compare my performance this month to last month",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
      "Customer Service": [
        {
          title: isRTL ? "تحليل رضا العملاء" : "Customer Satisfaction Analysis",
          prompt:
            "Analyze customer satisfaction trends from recent interactions",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "اقتراحات الرد" : "Response Suggestions",
          prompt: "Generate template responses for common customer inquiries",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحسين خدمة العملاء" : "Service Improvement",
          prompt:
            "How can I improve my customer service based on recent feedback?",
          icon: <Sparkles className="h-4 w-4" />,
        },
      ],
      Documents: [
        {
          title: isRTL ? "إنشاء مستند" : "Document Generation",
          prompt: "Generate a template for a business proposal",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحليل المستندات" : "Document Analysis",
          prompt: "Summarize the key points from my recent documents",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحسين المحتوى" : "Content Enhancement",
          prompt:
            "How can I improve the clarity and impact of my business documents?",
          icon: <Sparkles className="h-4 w-4" />,
        },
      ],
      Integrations: [
        {
          title: isRTL ? "توصيات التكامل" : "Integration Recommendations",
          prompt: "Suggest integrations that would benefit my business",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحليل أداء التكامل" : "Integration Performance",
          prompt: "Analyze the performance of my current integrations",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "استكشاف الأخطاء وإصلاحها" : "Troubleshooting",
          prompt: "Help me troubleshoot common integration issues",
          icon: <Zap className="h-4 w-4" />,
        },
      ],
      Developer: [
        {
          title: isRTL ? "توليد الكود" : "Code Generation",
          prompt: "Generate sample code for a common API integration",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: isRTL ? "تحليل الكود" : "Code Analysis",
          prompt: "Review my code for potential improvements",
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "استكشاف الأخطاء وإصلاحها" : "Troubleshooting",
          prompt: "Help me debug an issue with my code",
          icon: <Zap className="h-4 w-4" />,
        },
      ],
      Settings: [
        {
          title: isRTL ? "توصيات الإعدادات" : "Settings Recommendations",
          prompt: "Suggest optimal settings for my business needs",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "دليل الإعداد" : "Setup Guide",
          prompt: "Guide me through setting up a new feature",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: isRTL ? "استكشاف الأخطاء وإصلاحها" : "Troubleshooting",
          prompt: "Help me troubleshoot issues with my current settings",
          icon: <Zap className="h-4 w-4" />,
        },
      ],
      Documentation: [
        {
          title: isRTL ? "ملخص الوثائق" : "Documentation Summary",
          prompt: "Summarize the key points from the documentation",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: isRTL ? "أمثلة الاستخدام" : "Usage Examples",
          prompt: "Provide examples of how to use this feature",
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "استكشاف الأخطاء وإصلاحها" : "Troubleshooting",
          prompt: "Help me troubleshoot common issues with this feature",
          icon: <Zap className="h-4 w-4" />,
        },
      ],
    };

    // Return prompts for the specified module, or default prompts if not found
    return (
      moduleMap[module] || [
        {
          title: isRTL ? "تحليل عام" : "General Analysis",
          prompt: `Analyze my ${module} data and provide insights`,
          icon: <BarChart className="h-4 w-4" />,
        },
        {
          title: isRTL ? "توصيات" : "Recommendations",
          prompt: `Suggest improvements for my ${module}`,
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          title: isRTL ? "إنشاء محتوى" : "Generate Content",
          prompt: `Generate content related to ${module}`,
          icon: <MessageSquare className="h-4 w-4" />,
        },
      ]
    );
  };

  const modulePrompts = getModulePrompts(moduleName);

  // Action buttons
  const actionButtons = [
    {
      title: isRTL ? "إنشاء ملخص" : "Generate Summary",
      prompt: `Generate a comprehensive summary of my ${moduleName} data`,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: isRTL ? "الحصول على رؤى" : "Get Insights",
      prompt: `Analyze my ${moduleName} data and provide key insights`,
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      title: isRTL ? "اقتراح تلقائي" : "Auto-suggest",
      prompt: `Based on my ${moduleName} data, what actions should I take next?`,
      icon: <Sparkles className="h-4 w-4" />,
    },
  ];

  const handlePromptClick = (prompt: string) => {
    promptAIAssistant(prompt);
    toggleAIAssistant(true);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className={cn(
        "w-80 shadow-lg transition-all duration-300 bg-white dark:bg-gray-900",
        isExpanded ? "h-auto" : "h-12 overflow-hidden",
        className,
      )}
    >
      <div
        className="flex items-center justify-between p-3 cursor-pointer border-b"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">
            {isRTL ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
          </h3>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onClose && onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform",
              isExpanded ? "rotate-90" : isRTL ? "rotate-180" : "",
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {isRTL ? `مساعد ${moduleName}` : `${moduleName} Assistant`}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "اختر من الاقتراحات أدناه أو اطرح سؤالاً مخصصًا"
                : "Choose from suggestions below or ask a custom question"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {isRTL ? "اقتراحات السياق" : "Contextual Suggestions"}
              </h4>
              <div className="space-y-2">
                {modulePrompts.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handlePromptClick(item.prompt)}
                  >
                    <div className="mr-2 rtl:ml-2 rtl:mr-0 text-primary">
                      {item.icon}
                    </div>
                    <span className="truncate">{item.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {isRTL ? "إجراءات سريعة" : "Quick Actions"}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {actionButtons.map((action, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="flex flex-col items-center justify-center h-auto py-3 px-2 text-center"
                    onClick={() => handlePromptClick(action.prompt)}
                  >
                    <div className="mb-1 text-primary">{action.icon}</div>
                    <span className="text-xs">{action.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={() => toggleAIAssistant(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              {isRTL ? "فتح المساعد الكامل" : "Open Full Assistant"}
            </Button>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AIContextPanel;

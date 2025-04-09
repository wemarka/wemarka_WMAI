import React from "react";
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

interface AIModuleIntegrationProps {
  module: string;
  onPrompt: (prompt: string) => void;
}

const AIModuleIntegration: React.FC<AIModuleIntegrationProps> = ({
  module,
  onPrompt,
}) => {
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
            text: "Analyze KPIs",
            prompt: "Analyze my current KPIs and suggest improvements",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Generate report",
            prompt: "Generate a weekly performance report",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Optimization tips",
            prompt: "Suggest ways to optimize my business operations",
          },
        ];
      case "Store":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: "Inventory analysis",
            prompt: "Analyze my inventory and suggest restocking priorities",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Sales forecast",
            prompt: "Forecast sales for the next month based on current trends",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Product recommendations",
            prompt: "Suggest new products based on current sales patterns",
          },
        ];
      case "Accounting":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: "Expense analysis",
            prompt: "Analyze my expenses and suggest cost-saving opportunities",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Invoice summary",
            prompt:
              "Summarize outstanding invoices and suggest collection strategies",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Cash flow optimization",
            prompt:
              "Suggest ways to optimize cash flow based on current financials",
          },
        ];
      case "Marketing":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: "Campaign analysis",
            prompt: "Analyze my marketing campaigns and suggest improvements",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Content ideas",
            prompt: "Generate content ideas for my social media channels",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Audience insights",
            prompt:
              "Provide insights about my target audience and engagement strategies",
          },
        ];
      case "Analytics":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: "Data interpretation",
            prompt:
              "Interpret my current analytics data and highlight key insights",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Custom report",
            prompt:
              "Generate a custom report on user behavior and conversion rates",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Growth opportunities",
            prompt: "Identify growth opportunities based on current analytics",
          },
        ];
      case "Customers":
        return [
          {
            icon: <LineChart className="h-4 w-4" />,
            text: "Segment analysis",
            prompt:
              "Analyze my customer segments and provide targeting strategies",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Retention strategies",
            prompt:
              "Suggest customer retention strategies based on current data",
          },
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Loyalty program",
            prompt: "Design a customer loyalty program for my business",
          },
        ];
      default:
        return [
          {
            icon: <Lightbulb className="h-4 w-4" />,
            text: "Get suggestions",
            prompt: `Provide AI suggestions for the ${module} module`,
          },
          {
            icon: <FileText className="h-4 w-4" />,
            text: "Generate report",
            prompt: `Generate a report for the ${module} module`,
          },
          {
            icon: <Zap className="h-4 w-4" />,
            text: "Quick actions",
            prompt: `What quick actions can I take in the ${module} module?`,
          },
        ];
    }
  };

  const suggestions = getSuggestions();

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Bot className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-sm font-medium">AI Suggestions</h3>
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
              <div className="mr-2 text-primary">{suggestion.icon}</div>
              {suggestion.text}
              <Sparkles className="h-3 w-3 ml-auto text-primary" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModuleIntegration;

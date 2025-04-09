import React from "react";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIActionButton } from "@/frontend/modules/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  LineChart,
} from "lucide-react";

interface AIInsightsPanelProps {}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = () => {
  const { promptAIAssistant } = useAI();

  // Sample AI-generated insights (in a real app, these would come from an AI analysis service)
  const insights = [
    {
      id: 1,
      title: "Sales Trend Anomaly",
      description:
        "Unusual spike in product category 'Electronics' on weekends, suggesting opportunity for targeted promotions.",
      impact: "high",
      change: 24.5,
      increasing: true,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Customer Retention Risk",
      description:
        "15% of high-value customers haven't made a purchase in 60+ days, suggesting potential churn risk.",
      impact: "medium",
      change: 15.2,
      increasing: false,
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Marketing Channel Efficiency",
      description:
        "Instagram ads showing 32% higher ROI than Facebook ads for the 18-24 demographic.",
      impact: "high",
      change: 32.1,
      increasing: true,
      icon: <LineChart className="h-5 w-5" />,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            AI-Generated Insights
          </CardTitle>
          <AIActionButton
            onClick={() =>
              promptAIAssistant(
                "Analyze my business data and provide strategic insights and recommendations",
              )
            }
            label="Get More Insights"
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full ${getImpactColor(
                      insight.impact,
                    )} mr-3`}
                  >
                    {insight.icon}
                  </div>
                  <h3 className="font-medium">{insight.title}</h3>
                </div>
                <div
                  className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                    insight.increasing
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-red-600 bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  {insight.increasing ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {insight.change}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    promptAIAssistant(
                      `Tell me more about this insight: ${insight.title}. ${insight.description}`,
                    )
                  }
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Explore Further
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;

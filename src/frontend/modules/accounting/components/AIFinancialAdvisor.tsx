import React, { useState } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Sparkles,
  TrendingDown,
  DollarSign,
  PiggyBank,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface AIFinancialAdvisorProps {}

const AIFinancialAdvisor: React.FC<AIFinancialAdvisorProps> = () => {
  const { promptAIAssistant } = useAI();
  const [activeTab, setActiveTab] = useState("savings");

  // Sample AI-generated financial recommendations
  const recommendations = {
    savings: [
      {
        id: 1,
        title: "Optimize Subscription Services",
        description:
          "Consolidate multiple SaaS subscriptions to enterprise plans for a potential monthly saving of $450.",
        impact: "$5,400 annually",
        difficulty: "easy",
      },
      {
        id: 2,
        title: "Renegotiate Supplier Contracts",
        description:
          "Three major suppliers have contracts renewing next month. AI analysis suggests potential for 8-12% cost reduction.",
        impact: "$8,200 annually",
        difficulty: "medium",
      },
      {
        id: 3,
        title: "Energy Efficiency Improvements",
        description:
          "Implementing recommended office energy optimizations could reduce utility costs significantly.",
        impact: "$2,800 annually",
        difficulty: "medium",
      },
    ],
    cashflow: [
      {
        id: 1,
        title: "Implement Early Payment Discounts",
        description:
          "Offering 2% discount for payments within 10 days could improve cash flow timing.",
        impact: "15% faster payments",
        difficulty: "easy",
      },
      {
        id: 2,
        title: "Revise Invoice Payment Terms",
        description:
          "Shortening payment terms from Net 30 to Net 15 for new clients could improve cash flow.",
        impact: "Reduced DSO by 12 days",
        difficulty: "easy",
      },
      {
        id: 3,
        title: "Inventory Optimization",
        description:
          "Current inventory levels exceed optimal by 22%. Reducing stock of slow-moving items would free up capital.",
        impact: "$15,000 in freed capital",
        difficulty: "hard",
      },
    ],
    risks: [
      {
        id: 1,
        title: "Client Concentration Risk",
        description:
          "Top 3 clients represent 42% of revenue, creating vulnerability. Diversification recommended.",
        impact: "High risk",
        difficulty: "hard",
      },
      {
        id: 2,
        title: "Upcoming Regulatory Changes",
        description:
          "New financial regulations effective next quarter will require additional compliance measures.",
        impact: "Medium risk",
        difficulty: "medium",
      },
      {
        id: 3,
        title: "Currency Exchange Exposure",
        description:
          "International client payments expose business to currency fluctuations. Hedging strategies recommended.",
        impact: "Medium risk",
        difficulty: "medium",
      },
    ],
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Easy
          </span>
        );
      case "medium":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            Medium
          </span>
        );
      case "hard":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Complex
          </span>
        );
      default:
        return null;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "savings":
        return <PiggyBank className="h-4 w-4" />;
      case "cashflow":
        return <DollarSign className="h-4 w-4" />;
      case "risks":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card shadow-sm rounded-lg border">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center text-lg font-medium">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            AI Financial Advisor
          </h3>
          <AIActionButton
            onClick={() =>
              promptAIAssistant(
                "Analyze my financial data and provide recommendations for improving profitability and financial health",
              )
            }
            label="Custom Analysis"
            size="sm"
          />
        </div>
      </div>
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="savings" className="flex items-center">
              <PiggyBank className="h-4 w-4 mr-2" />
              Cost Savings
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Cash Flow
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Risk Alerts
            </TabsTrigger>
          </TabsList>

          {Object.keys(recommendations).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 space-y-4">
              {recommendations[tab as keyof typeof recommendations].map(
                (rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{rec.title}</h3>
                      {getDifficultyBadge(rec.difficulty)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-primary">
                        Impact: {rec.impact}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          promptAIAssistant(
                            `Tell me more about this financial recommendation: ${rec.title}. ${rec.description}`,
                          )
                        }
                      >
                        Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ),
              )}

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() =>
                  promptAIAssistant(
                    `Generate more ${activeTab} recommendations for my business`,
                  )
                }
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate More Recommendations
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AIFinancialAdvisor;

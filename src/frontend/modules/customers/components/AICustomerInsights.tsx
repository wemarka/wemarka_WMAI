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
import { Sparkles, Users, Target, TrendingUp, ArrowRight } from "lucide-react";

interface AICustomerInsightsProps {}

const AICustomerInsights: React.FC<AICustomerInsightsProps> = () => {
  const { promptAIAssistant } = useAI();
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Sample AI-generated customer segments
  const customerSegments = [
    {
      id: "high-value",
      name: "High-Value Regulars",
      percentage: 15,
      revenue: 40,
      avgOrderValue: "$210",
      purchaseFrequency: "2.3 per month",
      description: "Loyal customers who make frequent, high-value purchases.",
      recommendations: [
        "Implement VIP loyalty program",
        "Offer early access to new products",
        "Provide personalized recommendations",
      ],
    },
    {
      id: "occasional",
      name: "Occasional Big Spenders",
      percentage: 25,
      revenue: 30,
      avgOrderValue: "$175",
      purchaseFrequency: "0.8 per month",
      description: "Customers who make infrequent but large purchases.",
      recommendations: [
        "Create re-engagement email campaigns",
        "Offer limited-time promotions",
        "Implement cart abandonment reminders",
      ],
    },
    {
      id: "new-potential",
      name: "New Growth Potential",
      percentage: 35,
      revenue: 20,
      avgOrderValue: "$85",
      purchaseFrequency: "1.1 per month",
      description: "Recent customers with potential for increased engagement.",
      recommendations: [
        "Develop onboarding email sequence",
        "Offer first-time buyer discounts",
        "Request product feedback",
      ],
    },
    {
      id: "at-risk",
      name: "At-Risk Customers",
      percentage: 25,
      revenue: 10,
      avgOrderValue: "$95",
      purchaseFrequency: "0.3 per month",
      description: "Previously active customers showing declining engagement.",
      recommendations: [
        "Send win-back campaigns",
        "Offer special retention discounts",
        "Request feedback on potential improvements",
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            AI Customer Segmentation
          </CardTitle>
          <AIActionButton
            onClick={() =>
              promptAIAssistant(
                "Analyze my customer data and provide detailed segmentation with actionable insights",
              )
            }
            label="Refresh Analysis"
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {selectedSegment ? (
          <SegmentDetail
            segment={customerSegments.find((s) => s.id === selectedSegment)!}
            onBack={() => setSelectedSegment(null)}
            onPrompt={promptAIAssistant}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              AI has analyzed your customer data and identified these key
              segments. Click on a segment to see detailed insights and
              recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerSegments.map((segment) => (
                <div
                  key={segment.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all duration-200"
                  onClick={() => setSelectedSegment(segment.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{segment.name}</h3>
                    <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {segment.percentage}% of customers
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {segment.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>
                      <strong>{segment.revenue}%</strong> of revenue
                    </span>
                    <span>
                      AOV: <strong>{segment.avgOrderValue}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SegmentDetailProps {
  segment: {
    id: string;
    name: string;
    percentage: number;
    revenue: number;
    avgOrderValue: string;
    purchaseFrequency: string;
    description: string;
    recommendations: string[];
  };
  onBack: () => void;
  onPrompt: (prompt: string) => void;
}

const SegmentDetail: React.FC<SegmentDetailProps> = ({
  segment,
  onBack,
  onPrompt,
}) => {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        ← Back to all segments
      </Button>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{segment.name}</h3>
        <div className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
          {segment.percentage}% of customers
        </div>
      </div>

      <p className="text-muted-foreground">{segment.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Revenue Share
          </div>
          <div className="text-2xl font-bold">{segment.revenue}%</div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Avg Order Value
          </div>
          <div className="text-2xl font-bold">{segment.avgOrderValue}</div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Purchase Frequency
          </div>
          <div className="text-2xl font-bold">{segment.purchaseFrequency}</div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-3 flex items-center">
          <Target className="h-4 w-4 text-primary mr-2" />
          AI-Generated Recommendations
        </h4>
        <div className="space-y-2">
          {segment.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg flex justify-between items-center hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-xs font-medium">
                  {index + 1}
                </div>
                <span>{rec}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() =>
                  onPrompt(
                    `For my ${segment.name} customer segment, tell me more about how to implement this strategy: ${rec}`,
                  )
                }
              >
                Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={() =>
            onPrompt(
              `Create a detailed marketing strategy for my ${segment.name} customer segment (${segment.description})`,
            )
          }
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Full Strategy
        </Button>
      </div>
    </div>
  );
};

export default AICustomerInsights;

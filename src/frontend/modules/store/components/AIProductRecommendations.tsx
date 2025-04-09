import React from "react";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIModuleIntegration } from "@/frontend/modules/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Sparkles, TrendingUp, ShoppingCart } from "lucide-react";

interface AIProductRecommendationsProps {
  productCategory?: string;
}

const AIProductRecommendations: React.FC<AIProductRecommendationsProps> = ({
  productCategory = "all",
}) => {
  const { promptAIAssistant } = useAI();

  // Sample recommended products (in a real app, these would come from an AI recommendation engine)
  const recommendedProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 129.99,
      category: "Electronics",
      aiReason: "Based on your store's top sellers and current market trends",
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      price: 34.99,
      category: "Clothing",
      aiReason: "Matches your sustainable product line and seasonal inventory",
    },
    {
      id: 3,
      name: "Smart Home Hub",
      price: 89.99,
      category: "Electronics",
      aiReason: "Complements your existing smart device offerings",
    },
  ];

  // Filter products by category if specified
  const filteredProducts =
    productCategory === "all"
      ? recommendedProducts
      : recommendedProducts.filter((p) => p.category === productCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold">AI Product Recommendations</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-primary"
          onClick={() =>
            promptAIAssistant(
              "Generate more product recommendations for my store based on current trends and my inventory",
            )
          }
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get More Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} variant="hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">${product.price}</span>
                <div className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                <Sparkles className="h-3 w-3 inline mr-1 text-primary" />
                {product.aiReason}
              </p>
              <Button size="sm" className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Inventory
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <AIModuleIntegration module="Store" onPrompt={promptAIAssistant} />
      </div>
    </div>
  );
};

export default AIProductRecommendations;

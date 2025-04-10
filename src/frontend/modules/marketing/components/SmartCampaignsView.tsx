import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/frontend/components/ui/dialog";
import {
  Sparkles,
  Users,
  TrendingUp,
  Calendar,
  Edit,
  Eye,
  Download,
  Loader2,
  BarChart,
} from "lucide-react";
import WMAIEngine from "@/frontend/services/WMAIEngine";
import {
  AIGeneratedCampaign,
  CustomerBehaviorData,
  CampaignType,
} from "@/frontend/types/marketing";

interface SmartCampaignsViewProps {
  isRTL?: boolean;
}

// Sample customer behavior data for demonstration
const sampleCustomerData: CustomerBehaviorData = {
  segments: [
    {
      id: "seg-1",
      name: "High-Value Customers",
      size: 1250,
      averageOrderValue: 250,
      purchaseFrequency: 3.5,
      interests: ["Premium Products", "Exclusive Offers", "Early Access"],
    },
    {
      id: "seg-2",
      name: "New Customers",
      size: 3400,
      averageOrderValue: 85,
      purchaseFrequency: 1.2,
      interests: ["Discounts", "Free Shipping", "Product Tutorials"],
    },
    {
      id: "seg-3",
      name: "Inactive Customers",
      size: 5200,
      averageOrderValue: 120,
      purchaseFrequency: 0.5,
      interests: ["Special Offers", "Clearance", "Limited Time Deals"],
    },
  ],
  recentInteractions: [
    {
      type: "website_visit",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      details: {
        page: "product_category",
        category: "electronics",
        duration: 240,
      },
    },
    {
      type: "email_open",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      details: { campaign: "summer_sale", clickedLinks: true },
    },
    {
      type: "purchase",
      timestamp: new Date(Date.now() - 604800000).toISOString(),
      details: {
        amount: 120,
        products: ["smartphone_case", "screen_protector"],
      },
    },
  ],
  preferences: {
    preferredChannels: ["email", "social"],
    interests: ["Technology", "Home Goods", "Accessories"],
    productCategories: ["Electronics", "Home & Kitchen"],
    communicationFrequency: "weekly",
  },
  demographics: {
    ageGroups: {
      "18-24": 15,
      "25-34": 35,
      "35-44": 25,
      "45-54": 15,
      "55+": 10,
    },
    genders: { male: 45, female: 52, other: 3 },
    locations: {
      "New York": 20,
      California: 15,
      Texas: 12,
      Florida: 8,
      Other: 45,
    },
  },
};

const SmartCampaignsView: React.FC<SmartCampaignsViewProps> = ({
  isRTL = false,
}) => {
  const { user } = useAuth();
  const { promptAIAssistant } = useAI();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<CampaignType>("social");
  const [selectedCampaign, setSelectedCampaign] =
    useState<AIGeneratedCampaign | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch AI-generated campaigns based on customer behavior
  const {
    data: campaigns,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["aiGeneratedCampaigns", user?.id],
    queryFn: () => WMAIEngine.generateCustomCampaigns(sampleCustomerData),
    enabled: !!user?.id,
  });

  // Filter campaigns by type
  const filteredCampaigns =
    campaigns?.filter(
      (campaign) => activeTab === "all" || campaign.type === activeTab,
    ) || [];

  // Handle campaign selection
  const handleCampaignSelect = (campaign: AIGeneratedCampaign) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
  };

  // Send campaign to AI assistant for refinement
  const sendToAIAssistant = (campaign: AIGeneratedCampaign) => {
    const prompt = `Help me refine this ${campaign.type} marketing campaign titled "${campaign.title}". The campaign targets ${campaign.targetAudience} and currently includes the following content: "${campaign.content}". Please suggest improvements and provide a more detailed version.`;
    promptAIAssistant(prompt);
    setIsDialogOpen(false);
    toast({
      title: "Sent to AI Assistant",
      description:
        "Your campaign has been sent to the AI assistant for refinement.",
    });
  };

  // Get impact color based on estimated impact
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-green-600";
      case "Medium":
        return "text-amber-600";
      case "Low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              {isRTL ? "حملات ذكية" : "Smart Campaigns"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "حملات مخصصة مولدة بالذكاء الاصطناعي بناءً على سلوك العملاء"
                : "AI-generated custom campaigns based on customer behavior"}
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <Loader2
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isRTL ? "تحليل جديد" : "New Analysis"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {isRTL ? "شرائح العملاء: " : "Customer Segments: "}
              <span className="font-medium">
                {sampleCustomerData.segments.length}
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {isRTL ? "متوسط قيمة الطلب: " : "Avg. Order Value: "}
              <span className="font-medium">
                $
                {Math.round(
                  sampleCustomerData.segments.reduce(
                    (acc, seg) => acc + seg.averageOrderValue,
                    0,
                  ) / sampleCustomerData.segments.length,
                )}
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {isRTL ? "تاريخ التحليل: " : "Analysis Date: "}
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </span>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as CampaignType)}
        >
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">{isRTL ? "الكل" : "All"}</TabsTrigger>
            <TabsTrigger value="social">
              {isRTL ? "وسائل التواصل" : "Social"}
            </TabsTrigger>
            <TabsTrigger value="email">
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </TabsTrigger>
            <TabsTrigger value="content">
              {isRTL ? "المحتوى" : "Content"}
            </TabsTrigger>
            <TabsTrigger value="ads">{isRTL ? "الإعلانات" : "Ads"}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {renderCampaignsList(filteredCampaigns)}
          </TabsContent>
          <TabsContent value="social" className="space-y-4">
            {renderCampaignsList(filteredCampaigns)}
          </TabsContent>
          <TabsContent value="email" className="space-y-4">
            {renderCampaignsList(filteredCampaigns)}
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
            {renderCampaignsList(filteredCampaigns)}
          </TabsContent>
          <TabsContent value="ads" className="space-y-4">
            {renderCampaignsList(filteredCampaigns)}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Campaign Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedCampaign && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCampaign.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge>{selectedCampaign.type}</Badge>
                    <Badge variant="outline">
                      {selectedCampaign.targetAudience}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getImpactColor(
                        selectedCampaign.estimatedImpact,
                      )}
                    >
                      {selectedCampaign.estimatedImpact} Impact
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCampaign.description}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Campaign Content</h4>
                  <Card className="p-4 bg-muted/50">
                    <p className="whitespace-pre-line">
                      {selectedCampaign.content}
                    </p>
                  </Card>
                </div>
                {selectedCampaign.metrics && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <BarChart className="h-4 w-4 mr-1" />
                        Projected Metrics
                      </h4>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {Object.entries(selectedCampaign.metrics).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-muted/50 p-3 rounded-md"
                            >
                              <p className="text-xs text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <p className="text-lg font-medium">
                                {typeof value === "number" &&
                                key.includes("rate")
                                  ? `${value.toFixed(1)}%`
                                  : value}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {isRTL ? "إغلاق" : "Close"}
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  {isRTL ? "تحرير" : "Edit"}
                </Button>
                <Button onClick={() => sendToAIAssistant(selectedCampaign)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isRTL ? "تحسين بالذكاء الاصطناعي" : "Refine with AI"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );

  // Helper function to render campaigns list
  function renderCampaignsList(campaigns: AIGeneratedCampaign[]) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">
            {isRTL ? "تحليل سلوك العملاء..." : "Analyzing customer behavior..."}
          </span>
        </div>
      );
    }

    if (!campaigns.length) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {isRTL
              ? "لا توجد حملات مقترحة لهذه الفئة"
              : "No suggested campaigns for this category"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCampaignSelect(campaign)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{campaign.title}</CardTitle>
                <Badge>{campaign.type}</Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {campaign.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {campaign.content}
              </p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <div className="flex items-center">
                <Badge variant="outline">{campaign.targetAudience}</Badge>
                <Badge
                  variant="outline"
                  className={`ml-2 ${getImpactColor(campaign.estimatedImpact)}`}
                >
                  {campaign.estimatedImpact}
                </Badge>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
};

export default SmartCampaignsView;

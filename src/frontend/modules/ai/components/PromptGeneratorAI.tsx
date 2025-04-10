import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { Textarea } from "@/frontend/components/ui/textarea";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  Sparkles,
  History,
  Send,
  Copy,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";
import WMAIEngine from "@/frontend/services/WMAIEngine";
import { CampaignType, MarketingPrompt } from "@/frontend/types/marketing";

interface PromptGeneratorAIProps {
  isRTL?: boolean;
  initialCampaignType?: CampaignType;
  onPromptSelect?: (prompt: string) => void;
  onPromptGenerate?: (prompt: string, response: string) => void;
}

const PromptGeneratorAI: React.FC<PromptGeneratorAIProps> = ({
  isRTL = false,
  initialCampaignType = "content",
  onPromptSelect,
  onPromptGenerate,
}) => {
  const { user } = useAuth();
  const { promptAIAssistant } = useAI();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<CampaignType>(initialCampaignType);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch prompt history from Supabase
  const { data: promptHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["promptHistory", user?.id],
    queryFn: () => WMAIEngine.getPromptHistory(user?.id || "", 10),
    enabled: !!user?.id,
  });

  // Fetch AI-generated suggestions based on campaign type
  const {
    data: suggestions,
    isLoading: isSuggestionsLoading,
    refetch: refetchSuggestions,
  } = useQuery({
    queryKey: ["promptSuggestions", activeTab, user?.id],
    queryFn: () => WMAIEngine.generateSuggestions(activeTab, user?.id || ""),
    enabled: !!user?.id,
  });

  // Handle prompt submission
  const handleSubmitPrompt = async () => {
    if (!customPrompt.trim() && !selectedPrompt) return;

    const promptToSubmit = selectedPrompt || customPrompt;

    try {
      // Use the AI context to prompt the assistant
      promptAIAssistant(promptToSubmit);

      // Call the onPromptSelect callback if provided
      if (onPromptSelect) {
        onPromptSelect(promptToSubmit);
      }

      // Clear the input
      setCustomPrompt("");
      setSelectedPrompt(null);

      toast({
        title: "Prompt submitted",
        description: "Your prompt has been sent to the AI assistant.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setCustomPrompt("");
  };

  // Copy prompt to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          {isRTL ? "مولد الإشارات الذكي" : "AI Prompt Generator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as CampaignType)}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="social">
              {isRTL ? "وسائل التواصل" : "Social Media"}
            </TabsTrigger>
            <TabsTrigger value="email">
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </TabsTrigger>
            <TabsTrigger value="content">
              {isRTL ? "المحتوى" : "Content"}
            </TabsTrigger>
            <TabsTrigger value="ads">{isRTL ? "الإعلانات" : "Ads"}</TabsTrigger>
          </TabsList>

          {/* Content for each tab */}
          {(["social", "email", "content", "ads"] as CampaignType[]).map(
            (tabValue) => (
              <TabsContent
                key={tabValue}
                value={tabValue}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    {isRTL
                      ? "اقتراحات مولدة بالذكاء الاصطناعي"
                      : "AI-Generated Suggestions"}
                  </h3>
                  {isSuggestionsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => refetchSuggestions()}
                          className="h-8 px-2"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          {isRTL ? "تحديث" : "Refresh"}
                        </Button>
                      </div>
                      {suggestions?.map((suggestion, index) => (
                        <Card
                          key={index}
                          className={`p-3 cursor-pointer hover:bg-accent transition-colors ${selectedPrompt === suggestion ? "border-primary" : ""}`}
                          onClick={() => handlePromptSelect(suggestion)}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{suggestion}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(suggestion);
                              }}
                            >
                              {copied ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    {isRTL ? "إنشاء إشارة مخصصة" : "Create Custom Prompt"}
                  </h3>
                  <Textarea
                    placeholder={
                      isRTL
                        ? "اكتب إشارتك المخصصة هنا..."
                        : "Type your custom prompt here..."
                    }
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
            ),
          )}
        </Tabs>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-2" />
            {isRTL ? "سجل الإشارات" : "Prompt History"}
          </h3>
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {isHistoryLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : promptHistory?.length ? (
              <div className="space-y-2">
                {promptHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handlePromptSelect(item.prompt)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium truncate">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">{item.campaignType}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {isRTL ? "لا يوجد سجل للإشارات" : "No prompt history found"}
              </p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {selectedPrompt && (
            <Badge variant="outline" className="mr-2">
              {isRTL ? "تم اختيار الإشارة" : "Prompt Selected"}
            </Badge>
          )}
        </div>
        <Button
          onClick={handleSubmitPrompt}
          disabled={!customPrompt && !selectedPrompt}
        >
          <Send className="h-4 w-4 mr-2" />
          {isRTL ? "إرسال إلى المساعد" : "Send to Assistant"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptGeneratorAI;

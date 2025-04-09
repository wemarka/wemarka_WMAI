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
import { Textarea } from "@/frontend/components/ui/textarea";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Sparkles,
  Copy,
  Check,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

interface AIContentGeneratorProps {}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = () => {
  const { promptAIAssistant } = useAI();
  const [activeTab, setActiveTab] = useState("social");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("general");
  const [contentTone, setContentTone] = useState("professional");
  const [generatedContent, setGeneratedContent] = useState<
    Record<string, string>
  >({
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    email: "",
  });
  const [copied, setCopied] = useState<string | null>(null);

  // Simulate content generation
  const generateContent = () => {
    // In a real app, this would call an AI service
    const newContent = {
      instagram: `✨ Introducing ${productName}! ${productDescription.substring(0, 100)}... Perfect for ${targetAudience === "general" ? "everyone" : targetAudience}! #NewProduct #MustHave`,
      facebook: `We're excited to announce our newest product: ${productName}!\n\n${productDescription}\n\nPerfect for ${targetAudience === "general" ? "everyone" : targetAudience}. Check it out on our website!`,
      twitter: `Just launched: ${productName}! ${productDescription.substring(0, 70)}... Learn more on our website! #NewProduct`,
      linkedin: `Proud to announce the launch of ${productName}, our newest innovation.\n\n${productDescription}\n\nDesigned specifically for ${targetAudience === "general" ? "professionals across industries" : targetAudience}.\n\n#ProductLaunch #Innovation`,
      email: `Subject: Introducing ${productName} - Our Newest Addition!\n\nDear Valued Customer,\n\nWe're thrilled to introduce ${productName} to our product lineup!\n\n${productDescription}\n\nPerfect for ${targetAudience === "general" ? "all our customers" : targetAudience}, this new offering represents our commitment to quality and innovation.\n\nCheck out our website to learn more or place your order today!\n\nBest regards,\nThe Team`,
    };
    setGeneratedContent(newContent);
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Description</label>
              <Textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="general">General</option>
                  <option value="professionals">Professionals</option>
                  <option value="students">Students</option>
                  <option value="parents">Parents</option>
                  <option value="seniors">Seniors</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content Tone</label>
                <select
                  value={contentTone}
                  onChange={(e) => setContentTone(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="informative">Informative</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                onClick={generateContent}
                disabled={!productName || !productDescription}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
              <AIActionButton
                onClick={() =>
                  promptAIAssistant(
                    `Help me create marketing content for my product: ${productName}. ${productDescription}`,
                  )
                }
                label="Advanced Options"
                variant="outline"
              />
            </div>
          </div>

          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="instagram" className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </TabsTrigger>
                <TabsTrigger value="facebook" className="flex items-center">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </TabsTrigger>
                <TabsTrigger value="twitter" className="flex items-center">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
              </TabsList>

              {Object.keys(generatedContent).map((platform) => (
                <TabsContent key={platform} value={platform} className="mt-0">
                  <div className="relative">
                    <Textarea
                      value={generatedContent[platform]}
                      readOnly
                      rows={10}
                      className="resize-none"
                      placeholder={`Generated ${platform} content will appear here`}
                    />
                    {generatedContent[platform] && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                        onClick={() =>
                          copyToClipboard(generatedContent[platform], platform)
                        }
                      >
                        {copied === platform ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIContentGenerator;

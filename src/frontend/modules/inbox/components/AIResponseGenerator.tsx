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
import { Sparkles, Copy, Check, MessageSquare, Wand2 } from "lucide-react";

interface AIResponseGeneratorProps {
  initialMessage?: string;
}

const AIResponseGenerator: React.FC<AIResponseGeneratorProps> = ({
  initialMessage = "",
}) => {
  const { promptAIAssistant } = useAI();
  const [customerMessage, setCustomerMessage] = useState(initialMessage);
  const [responseType, setResponseType] = useState("helpful");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [copied, setCopied] = useState(false);

  // Sample response templates
  const responseTemplates = {
    helpful:
      "Thank you for reaching out! I'd be happy to help with your inquiry about [topic]. [Personalized response addressing their specific question]. Please let me know if you need any further assistance!",
    apologetic:
      "I sincerely apologize for the inconvenience you've experienced with [issue]. We take this matter very seriously and I'd like to resolve this for you right away. [Solution or next steps]. Thank you for your patience and understanding.",
    informative:
      "Thank you for your question about [topic]. Here's what you need to know: [Detailed information with facts and figures]. If you have any other questions, please don't hesitate to ask.",
    followUp:
      "I'm following up on your recent inquiry about [topic]. I wanted to check if the information I provided was helpful and if there's anything else you need assistance with. We value your business and are here to help!",
  };

  // Simulate response generation
  const generateResponse = () => {
    // In a real app, this would call an AI service
    let response =
      responseTemplates[responseType as keyof typeof responseTemplates];

    // Replace placeholders with context-specific content
    if (customerMessage.toLowerCase().includes("order")) {
      response = response.replace("[topic]", "your order status");
      if (responseType === "helpful") {
        response = response.replace(
          "[Personalized response addressing their specific question]",
          "I've checked your order #12345 and can confirm it has been shipped and is expected to arrive within 2-3 business days. You can track your package using the link sent to your email.",
        );
      }
    } else if (customerMessage.toLowerCase().includes("return")) {
      response = response.replace("[topic]", "your return request");
      if (responseType === "helpful") {
        response = response.replace(
          "[Personalized response addressing their specific question]",
          "I've processed your return request for the [product]. You should receive a return shipping label in your email within the next hour. Once we receive the returned item, a refund will be issued to your original payment method within 5-7 business days.",
        );
      }
    } else if (
      customerMessage.toLowerCase().includes("price") ||
      customerMessage.toLowerCase().includes("discount")
    ) {
      response = response.replace("[topic]", "pricing and discounts");
      if (responseType === "helpful") {
        response = response.replace(
          "[Personalized response addressing their specific question]",
          "I'm happy to inform you that we currently have a 15% discount promotion running until the end of the month. You can use code SUMMER15 at checkout to apply this discount to your purchase.",
        );
      }
    } else {
      response = response.replace("[topic]", "your inquiry");
      if (responseType === "helpful") {
        response = response.replace(
          "[Personalized response addressing their specific question]",
          "I've reviewed your message and would like to provide you with the most accurate information. Could you please provide a few more details about your specific needs so I can better assist you?",
        );
      }
    }

    // Replace other placeholders based on response type
    if (responseType === "apologetic") {
      response = response.replace(
        "[issue]",
        customerMessage.toLowerCase().includes("order")
          ? "your delayed order"
          : "this situation",
      );
      response = response.replace(
        "[Solution or next steps]",
        "I've escalated this to our priority team and they will be addressing this immediately. You can expect a resolution within 24 hours.",
      );
    } else if (responseType === "informative") {
      response = response.replace(
        "[Detailed information with facts and figures]",
        "Our standard processing time is 1-2 business days, with shipping typically taking an additional 3-5 business days depending on your location. 95% of our orders arrive within this timeframe.",
      );
    }

    setGeneratedResponse(response);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          AI Response Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Message</label>
            <Textarea
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Paste customer message here..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Response Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={responseType === "helpful" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setResponseType("helpful")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Helpful
              </Button>
              <Button
                variant={responseType === "apologetic" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setResponseType("apologetic")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Apologetic
              </Button>
              <Button
                variant={responseType === "informative" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setResponseType("informative")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Informative
              </Button>
              <Button
                variant={responseType === "followUp" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setResponseType("followUp")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Follow-up
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={generateResponse}
              disabled={!customerMessage.trim()}
              className="flex-1"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Response
            </Button>
            <AIActionButton
              onClick={() =>
                promptAIAssistant(
                  `Help me craft a professional response to this customer message: "${customerMessage}". The tone should be ${responseType}.`,
                )
              }
              label="Advanced Options"
              variant="outline"
            />
          </div>

          {generatedResponse && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Generated Response
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-primary"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <Textarea
                value={generatedResponse}
                onChange={(e) => setGeneratedResponse(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponseGenerator;

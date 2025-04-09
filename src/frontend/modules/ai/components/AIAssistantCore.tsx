import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/frontend/lib/utils";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Sparkles,
  Send,
  X,
  Loader2,
  Bot,
  User,
  Clipboard,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantCoreProps {
  currentModule?: string;
  onClose?: () => void;
  initialPrompt?: string;
}

const AIAssistantCore: React.FC<AIAssistantCoreProps> = ({
  currentModule = "Dashboard",
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    const initialMessage: Message = {
      id: "system-greeting",
      role: "assistant",
      content: `Hello! I'm your Wemarka AI assistant. I can help you with the ${currentModule} module. How can I assist you today?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [currentModule]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, currentModule);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Copy message to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-96 h-[600px] bg-card rounded-xl border shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary-600 to-secondary flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-white">
            WMAI - {currentModule} Assistant
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-xl p-3 flex",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-10"
                  : "bg-muted text-foreground mr-10",
              )}
            >
              <div className="mr-2 mt-0.5">
                {message.role === "user" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                      onClick={() =>
                        copyToClipboard(message.content, message.id)
                      }
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Clipboard className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-xl p-3 flex items-center max-w-[80%] mr-10">
              <Bot className="h-5 w-5 mr-2" />
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="ml-2 rounded-full"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Helper function to generate AI responses based on the module
function generateAIResponse(input: string, module: string): string {
  const lowerInput = input.toLowerCase();

  // Generic responses
  if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
    return `Hello! I'm your Wemarka AI assistant for the ${module} module. How can I help you today?`;
  }

  if (lowerInput.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  // Module-specific responses
  switch (module) {
    case "Dashboard":
      if (lowerInput.includes("kpi") || lowerInput.includes("metrics")) {
        return "I can help you analyze your key performance indicators. Your sales are up 12% this month, and customer engagement has increased by 8%. Would you like me to generate a detailed report?";
      }
      if (lowerInput.includes("summary") || lowerInput.includes("overview")) {
        return "Here's a quick summary of your business performance:\n\n• Revenue: $24,500 (+15%)\n• New Customers: 142 (+8%)\n• Active Orders: 37\n• Support Tickets: 12 (3 high priority)\n\nWould you like more details on any of these areas?";
      }
      break;

    case "Store":
      if (lowerInput.includes("product") || lowerInput.includes("inventory")) {
        return "I can help you manage your product inventory. You currently have 5 products with low stock levels that need attention. Would you like me to generate a purchase order for these items?";
      }
      if (lowerInput.includes("order") || lowerInput.includes("sales")) {
        return "You have 37 active orders, with 5 requiring immediate attention due to shipping delays. I can help you prioritize these orders and suggest solutions for the delays.";
      }
      break;

    case "Accounting":
      if (lowerInput.includes("invoice") || lowerInput.includes("payment")) {
        return "I can help you manage invoices and payments. You have 8 overdue invoices totaling $12,450. Would you like me to generate payment reminder emails for these clients?";
      }
      if (lowerInput.includes("expense") || lowerInput.includes("budget")) {
        return "I've analyzed your expenses and found potential savings of $1,200 monthly by optimizing your subscription services. Would you like to see a detailed breakdown?";
      }
      break;

    case "Marketing":
      if (lowerInput.includes("campaign") || lowerInput.includes("ad")) {
        return "I can help you optimize your marketing campaigns. Your Facebook campaign is performing 15% better than last month, while your Google Ads have seen a slight decrease. I recommend reallocating 20% of your Google Ads budget to Facebook.";
      }
      if (lowerInput.includes("content") || lowerInput.includes("post")) {
        return "I can help you create engaging content for your marketing channels. Based on your audience demographics, posts about product tutorials and industry insights perform best. Would you like me to generate some content ideas?";
      }
      break;

    case "Analytics":
      if (lowerInput.includes("report") || lowerInput.includes("data")) {
        return "I can generate custom reports based on your business data. Your customer acquisition cost has decreased by 12% this quarter, and your customer lifetime value has increased by 8%. This indicates your marketing efforts are becoming more efficient.";
      }
      if (lowerInput.includes("predict") || lowerInput.includes("forecast")) {
        return "Based on historical data and current trends, I predict a 15-20% increase in sales for the next quarter. The holiday season and your planned marketing campaigns should contribute significantly to this growth.";
      }
      break;

    case "Customers":
      if (lowerInput.includes("segment") || lowerInput.includes("group")) {
        return "I've analyzed your customer data and identified 3 key segments:\n\n1. High-value regulars (15% of customers, 40% of revenue)\n2. Occasional big spenders (25% of customers, 30% of revenue)\n3. New customers with growth potential (35% of customers, 20% of revenue)\n\nWould you like personalized marketing strategies for each segment?";
      }
      if (lowerInput.includes("retention") || lowerInput.includes("churn")) {
        return "Your customer retention rate is currently 78%, which is 5% above industry average. I've identified that customers who engage with your email newsletter have 35% lower churn. Would you like me to suggest ways to increase newsletter engagement?";
      }
      break;

    case "Inbox":
      if (lowerInput.includes("email") || lowerInput.includes("message")) {
        return "I can help you manage your communications. You have 24 unread messages, with 5 marked as high priority. Would you like me to draft responses to the most urgent inquiries?";
      }
      if (lowerInput.includes("template") || lowerInput.includes("response")) {
        return "I can create response templates for common inquiries. Based on your message history, I recommend templates for: product information, shipping updates, and return policies. Would you like me to generate these templates?";
      }
      break;

    default:
      return (
        "I'm here to help with your business needs. Could you provide more details about what you're looking for in the " +
        module +
        " module?"
      );
  }

  // Fallback response if no specific match
  return `I understand you're asking about ${input} in the ${module} module. I can help you analyze data, generate reports, and provide recommendations to optimize your business operations. Could you provide more specific details about what you need?`;
}

export default AIAssistantCore;

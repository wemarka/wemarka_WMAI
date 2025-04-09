import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface AIAssistantPanelProps {
  onClose: () => void;
  currentSystem?: string;
}

const AIAssistantPanel = ({
  onClose,
  currentSystem = "Dashboard",
}: AIAssistantPanelProps) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "assistant",
      content: isRTL
        ? `مرحباً! أنا مساعدك الذكي لوحدة ${currentSystem}. كيف يمكنني مساعدتك اليوم؟`
        : `Hello! I'm your AI assistant for the ${currentSystem} module. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isRTL
            ? `لقد تلقيت رسالتك حول "${input}". هذه استجابة مؤقتة لوحدة ${currentSystem}. في التطبيق الفعلي، سيتم الاتصال بخدمة الذكاء الاصطناعي.`
            : `I received your message about "${input}". This is a placeholder response for the ${currentSystem} module. In a real implementation, this would connect to an AI service.`,
        },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div
      className="w-96 h-[500px] bg-card rounded-lg shadow-elevated border flex flex-col overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="p-4 border-b flex items-center justify-between bg-primary/5">
        <h3 className="font-medium">
          {isRTL
            ? `المساعد الذكي - ${currentSystem}`
            : `AI Assistant - ${currentSystem}`}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div
          className={cn(
            "flex items-center",
            isRTL ? "space-x-reverse space-x-2" : "space-x-2",
          )}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={isRTL ? "اسأل شيئًا..." : "Ask something..."}
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;

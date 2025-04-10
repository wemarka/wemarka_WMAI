import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Badge } from "@/frontend/components/ui/badge";
import { Send, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { askAI } from "@/frontend/services/aiService";

interface SmartAssistantChatProps {
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  feedback?: "positive" | "negative" | null;
}

const SmartAssistantChat: React.FC<SmartAssistantChatProps> = ({
  initialQuery = "",
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { currentModule } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const suggestedQuestions = [
    isRTL ? "كيف أضيف منتجًا جديدًا؟" : "How do I add a new product?",
    isRTL ? "كيف أنشئ حملة تسويقية؟" : "How do I create a marketing campaign?",
    isRTL
      ? "كيف أستخدم مساعد الذكاء الاصطناعي؟"
      : "How do I use the AI assistant?",
    isRTL
      ? "كيف أدير صندوق الوارد الموحد؟"
      : "How do I manage the unified inbox?",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process initial query if provided
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call the AI service
      const response = await askAI(content, currentModule);

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: isRTL
          ? "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً."
          : "Sorry, an error occurred while processing your request. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: "positive" | "negative",
  ) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)),
    );
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {isRTL ? "المساعد الذكي" : "Smart Assistant"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isRTL
                  ? "مرحبًا بك في المساعد الذكي"
                  : "Welcome to Smart Assistant"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isRTL
                  ? "اسأل أي سؤال حول كيفية استخدام Wemarka WMAI"
                  : "Ask any question about how to use Wemarka WMAI"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.sender === "assistant" && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              handleFeedback(message.id, "positive")
                            }
                          >
                            <ThumbsUp
                              className={`h-4 w-4 ${message.feedback === "positive" ? "text-green-500 fill-green-500" : ""}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              handleFeedback(message.id, "negative")
                            }
                          >
                            <ThumbsDown
                              className={`h-4 w-4 ${message.feedback === "negative" ? "text-red-500 fill-red-500" : ""}`}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder={
              isRTL ? "اكتب سؤالك هنا..." : "Type your question here..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SmartAssistantChat;

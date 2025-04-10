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
import { askAI } from "@/frontend/services/aiService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
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
  const [streamedText, setStreamedText] = useState("");
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

  // Process initial prompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSubmit(new Event("submit") as any, initialPrompt);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, overrideInput?: string) => {
    e.preventDefault();
    const userInput = overrideInput || input;
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamedText("");

    // Add placeholder for assistant message with streaming indicator
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Call the AI service with module context
      const response = await askAI(userInput, currentModule);

      // Simulate streaming effect for the response
      const fullResponse = response.response;
      let displayedResponse = "";

      // Update the assistant message with the streaming content
      for (let i = 0; i < fullResponse.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15)); // Adjust speed as needed
        displayedResponse += fullResponse[i];
        setStreamedText(displayedResponse);

        // Update the message content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: displayedResponse }
              : msg,
          ),
        );
      }

      // Final update to remove streaming indicator
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: fullResponse, isStreaming: false }
            : msg,
        ),
      );
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Update the message with an error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error while processing your request. Please try again.",
                isStreaming: false,
              }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
      setStreamedText("");
    }
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
                  {message.isStreaming && (
                    <span className="inline-block ml-1 animate-pulse">▋</span>
                  )}
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" && !message.isStreaming && (
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
        {isLoading && !messages.some((m) => m.isStreaming) && (
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
            disabled={isLoading}
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

export default AIAssistantCore;

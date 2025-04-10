import React, { useState } from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import {
  MessageSquare,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Send,
  Paperclip,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MessageCenter = () => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeTab, setActiveTab] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [messageInput, setMessageInput] = useState("");

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: "Ahmed Hassan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      lastMessage:
        "I need help with my recent order. Can you check the shipping status?",
      time: "10:30 AM",
      unread: 2,
      channel: "whatsapp",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      lastMessage: "When will my order be delivered?",
      time: "Yesterday",
      unread: 0,
      channel: "email",
      status: "active",
    },
    {
      id: 3,
      name: "Mohammed Ali",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
      lastMessage: "Thank you for your quick response!",
      time: "Yesterday",
      unread: 0,
      channel: "facebook",
      status: "closed",
    },
    {
      id: 4,
      name: "Fatima Zahra",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      lastMessage: "Is the blue version of the product in stock?",
      time: "Monday",
      unread: 1,
      channel: "instagram",
      status: "active",
    },
  ];

  // Mock data for messages in the selected conversation
  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: "user",
      content:
        "Hello, I ordered product #12345 last week and I haven't received any shipping updates.",
      time: "10:15 AM",
    },
    {
      id: 2,
      conversationId: 1,
      sender: "agent",
      content:
        "Hi Ahmed, thank you for reaching out. Let me check the status of your order right away.",
      time: "10:20 AM",
    },
    {
      id: 3,
      conversationId: 1,
      sender: "agent",
      content:
        "I can see that your order has been processed and is currently being prepared for shipping. It should be dispatched within the next 24 hours.",
      time: "10:22 AM",
    },
    {
      id: 4,
      conversationId: 1,
      sender: "user",
      content:
        "I need help with my recent order. Can you check the shipping status?",
      time: "10:30 AM",
    },
  ];

  const filteredMessages = messages.filter(
    (message) => message.conversationId === selectedConversation,
  );

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            WhatsApp
          </Badge>
        );
      case "email":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            Email
          </Badge>
        );
      case "facebook":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-100 text-indigo-800 border-indigo-200"
          >
            Facebook
          </Badge>
        );
      case "instagram":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-200"
          >
            Instagram
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            {channel}
          </Badge>
        );
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    // In a real app, this would send the message to the backend
    setMessageInput("");
  };

  return (
    <div className="flex-1 bg-background">
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden">
        {/* Conversations List */}
        <div
          className={`w-1/3 border-r ${isRTL ? "border-l" : "border-r"} flex flex-col`}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">
              {isRTL ? "صندوق الوارد الموحد" : "Unified Inbox"}
            </h2>
            <div className="relative">
              <Search
                className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`}
              />
              <Input
                placeholder={
                  isRTL ? "البحث في الرسائل..." : "Search messages..."
                }
                className={`${isRTL ? "pr-10" : "pl-10"} bg-background`}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  {isRTL ? "الكل" : "All"}
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  onClick={() => setActiveTab("unread")}
                >
                  {isRTL ? "غير مقروءة" : "Unread"}
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  onClick={() => setActiveTab("active")}
                >
                  {isRTL ? "نشطة" : "Active"}
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  onClick={() => setActiveTab("closed")}
                >
                  {isRTL ? "مغلقة" : "Closed"}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {isRTL ? "4 محادثات" : "4 conversations"}
              </span>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                {isRTL ? "تصفية" : "Filter"}
              </Button>
            </div>

            <TabsContent value="all" className="flex-1 overflow-y-auto p-0 m-0">
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedConversation === conversation.id ? "bg-muted" : ""}`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="h-10 w-10 rounded-full"
                        />
                        {conversation.status === "active" && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex justify-between items-center">
                          {getChannelBadge(conversation.channel)}
                          {conversation.unread > 0 && (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="unread"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="divide-y">
                {conversations
                  .filter((c) => c.unread > 0)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedConversation === conversation.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="h-10 w-10 rounded-full"
                          />
                          {conversation.status === "active" && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {conversation.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex justify-between items-center">
                            {getChannelBadge(conversation.channel)}
                            {conversation.unread > 0 && (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent
              value="active"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="divide-y">
                {conversations
                  .filter((c) => c.status === "active")
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedConversation === conversation.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {conversation.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex justify-between items-center">
                            {getChannelBadge(conversation.channel)}
                            {conversation.unread > 0 && (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent
              value="closed"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="divide-y">
                {conversations
                  .filter((c) => c.status === "closed")
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedConversation === conversation.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {conversation.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex justify-between items-center">
                            {getChannelBadge(conversation.channel)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Conversation Detail */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      conversations.find((c) => c.id === selectedConversation)
                        ?.avatar
                    }
                    alt={
                      conversations.find((c) => c.id === selectedConversation)
                        ?.name
                    }
                    className="h-10 w-10 rounded-full"
                  />
                  {conversations.find((c) => c.id === selectedConversation)
                    ?.status === "active" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {
                      conversations.find((c) => c.id === selectedConversation)
                        ?.name
                    }
                  </h3>
                  <div className="flex items-center gap-2">
                    {getChannelBadge(
                      conversations.find((c) => c.id === selectedConversation)
                        ?.channel || "",
                    )}
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? "آخر نشاط:" : "Last active:"}{" "}
                      {
                        conversations.find((c) => c.id === selectedConversation)
                          ?.time
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs mt-1 text-right text-muted-foreground">
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder={
                    isRTL ? "اكتب رسالتك هنا..." : "Type your message here..."
                  }
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isRTL ? "اختر محادثة" : "Select a conversation"}
              </h3>
              <p className="text-muted-foreground">
                {isRTL
                  ? "اختر محادثة من القائمة لعرض الرسائل"
                  : "Choose a conversation from the list to view messages"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;

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
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Search,
  Filter,
  Plus,
  User,
  Clock,
  Tag,
  MessageSquare,
  MoreVertical,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface SupportTicketProps {
  // Props can be added as needed
}

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  tags: string[];
  messages: TicketMessage[];
}

interface TicketMessage {
  id: number;
  ticketId: number;
  sender: "customer" | "agent";
  content: string;
  timestamp: string;
  agentName?: string;
}

const SupportTicket: React.FC<SupportTicketProps> = () => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for tickets
  const tickets: Ticket[] = [
    {
      id: 1,
      subject: "Cannot login to my account",
      description:
        "I've been trying to login but keep getting an error message.",
      status: "open",
      priority: "high",
      createdAt: "2023-06-15T10:30:00",
      updatedAt: "2023-06-15T10:30:00",
      customerName: "Ahmed Hassan",
      customerEmail: "ahmed.hassan@example.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      tags: ["account", "login"],
      messages: [
        {
          id: 1,
          ticketId: 1,
          sender: "customer",
          content:
            "I've been trying to login but keep getting an error message saying 'Invalid credentials'. I'm sure my password is correct.",
          timestamp: "2023-06-15T10:30:00",
        },
        {
          id: 2,
          ticketId: 1,
          sender: "agent",
          content:
            "Hello Ahmed, I'm sorry you're having trouble logging in. Could you please try resetting your password using the 'Forgot Password' link?",
          timestamp: "2023-06-15T10:45:00",
          agentName: "Sarah Johnson",
        },
      ],
    },
    {
      id: 2,
      subject: "Order #12345 not delivered",
      description:
        "My order was supposed to arrive yesterday but I haven't received it yet.",
      status: "in_progress",
      priority: "medium",
      createdAt: "2023-06-14T15:20:00",
      updatedAt: "2023-06-15T09:10:00",
      assignedTo: "Mohammed Ali",
      customerName: "Fatima Zahra",
      customerEmail: "fatima.zahra@example.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      tags: ["order", "delivery"],
      messages: [
        {
          id: 3,
          ticketId: 2,
          sender: "customer",
          content:
            "My order #12345 was supposed to arrive yesterday but I haven't received it yet. Can you check the status?",
          timestamp: "2023-06-14T15:20:00",
        },
        {
          id: 4,
          ticketId: 2,
          sender: "agent",
          content:
            "Hello Fatima, I'm checking the status of your order now. It appears there was a delay with the shipping carrier. Let me get more information for you.",
          timestamp: "2023-06-14T16:05:00",
          agentName: "Mohammed Ali",
        },
        {
          id: 5,
          ticketId: 2,
          sender: "customer",
          content:
            "Thank you for checking. Please let me know when it will be delivered.",
          timestamp: "2023-06-14T16:30:00",
        },
      ],
    },
    {
      id: 3,
      subject: "Refund request for damaged product",
      description: "I received a damaged product and would like a refund.",
      status: "resolved",
      priority: "medium",
      createdAt: "2023-06-13T11:15:00",
      updatedAt: "2023-06-14T14:20:00",
      assignedTo: "Sarah Johnson",
      customerName: "Omar Farooq",
      customerEmail: "omar.farooq@example.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
      tags: ["refund", "product"],
      messages: [
        {
          id: 6,
          ticketId: 3,
          sender: "customer",
          content:
            "I received my order but the product is damaged. I'd like to request a refund.",
          timestamp: "2023-06-13T11:15:00",
        },
      ],
    },
  ];

  // Filter tickets based on search term and active tab
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchTerm === "" ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || ticket.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            {isRTL ? "مفتوح" : "Open"}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            {isRTL ? "قيد التنفيذ" : "In Progress"}
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            {isRTL ? "تم الحل" : "Resolved"}
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            {isRTL ? "مغلق" : "Closed"}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            {isRTL ? "عالية" : "High"}
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-800 border-orange-200"
          >
            {isRTL ? "متوسطة" : "Medium"}
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            {isRTL ? "منخفضة" : "Low"}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            {priority}
          </Badge>
        );
    }
  };

  return (
    <div className="flex-1 bg-background">
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden">
        {/* Tickets List */}
        <div
          className={`w-1/3 ${isRTL ? "border-l" : "border-r"} flex flex-col`}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">
              {isRTL ? "تذاكر الدعم" : "Support Tickets"}
            </h2>
            <div className="relative">
              <Search
                className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`}
              />
              <Input
                placeholder={
                  isRTL ? "البحث في التذاكر..." : "Search tickets..."
                }
                className={`${isRTL ? "pr-10" : "pl-10"} bg-background`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  {isRTL ? "الكل" : "All"}
                </TabsTrigger>
                <TabsTrigger value="open" onClick={() => setActiveTab("open")}>
                  {isRTL ? "مفتوح" : "Open"}
                </TabsTrigger>
                <TabsTrigger
                  value="in_progress"
                  onClick={() => setActiveTab("in_progress")}
                >
                  {isRTL ? "قيد التنفيذ" : "In Progress"}
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  onClick={() => setActiveTab("resolved")}
                >
                  {isRTL ? "تم الحل" : "Resolved"}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {isRTL
                  ? `${filteredTickets.length} تذاكر`
                  : `${filteredTickets.length} tickets`}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  {isRTL ? "تصفية" : "Filter"}
                </Button>
                <Dialog
                  open={isCreateTicketOpen}
                  onOpenChange={setIsCreateTicketOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      {isRTL ? "تذكرة جديدة" : "New Ticket"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {isRTL ? "إنشاء تذكرة جديدة" : "Create New Ticket"}
                      </DialogTitle>
                      <DialogDescription>
                        {isRTL
                          ? "أدخل تفاصيل التذكرة الجديدة أدناه."
                          : "Enter the details for the new support ticket below."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium"
                        >
                          {isRTL ? "الموضوع" : "Subject"}
                        </label>
                        <Input
                          id="subject"
                          placeholder={
                            isRTL
                              ? "أدخل موضوع التذكرة"
                              : "Enter ticket subject"
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          {isRTL ? "الوصف" : "Description"}
                        </label>
                        <Textarea
                          id="description"
                          placeholder={
                            isRTL
                              ? "أدخل وصف المشكلة"
                              : "Enter problem description"
                          }
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label
                            htmlFor="priority"
                            className="text-sm font-medium"
                          >
                            {isRTL ? "الأولوية" : "Priority"}
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isRTL ? "اختر الأولوية" : "Select priority"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">
                                {isRTL ? "منخفضة" : "Low"}
                              </SelectItem>
                              <SelectItem value="medium">
                                {isRTL ? "متوسطة" : "Medium"}
                              </SelectItem>
                              <SelectItem value="high">
                                {isRTL ? "عالية" : "High"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="assignTo"
                            className="text-sm font-medium"
                          >
                            {isRTL ? "تعيين إلى" : "Assign To"}
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isRTL ? "اختر وكيل" : "Select agent"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sarah">
                                Sarah Johnson
                              </SelectItem>
                              <SelectItem value="mohammed">
                                Mohammed Ali
                              </SelectItem>
                              <SelectItem value="john">John Doe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateTicketOpen(false)}
                      >
                        {isRTL ? "إلغاء" : "Cancel"}
                      </Button>
                      <Button onClick={() => setIsCreateTicketOpen(false)}>
                        {isRTL ? "إنشاء" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all" className="flex-1 overflow-y-auto p-0 m-0">
              <div className="divide-y">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedTicket === ticket.id ? "bg-muted" : ""}`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={ticket.customerAvatar}
                          alt={ticket.customerName}
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium truncate">
                            {`#${ticket.id} - ${ticket.subject}`}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(ticket.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {ticket.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {ticket.assignedTo
                              ? `${isRTL ? "معين إلى" : "Assigned to"}: ${ticket.assignedTo}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Additional TabsContent for filtered views */}
            <TabsContent
              value="open"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="divide-y">
                {filteredTickets
                  .filter((t) => t.status === "open")
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedTicket === ticket.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      {/* Same content as in the "all" tab */}
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={ticket.customerAvatar}
                            alt={ticket.customerName}
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium truncate">
                              {`#${ticket.id} - ${ticket.subject}`}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ticket.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {ticket.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {ticket.assignedTo
                                ? `${isRTL ? "معين إلى" : "Assigned to"}: ${ticket.assignedTo}`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            {/* Similar TabsContent for in_progress and resolved */}
          </Tabs>
        </div>

        {/* Ticket Detail */}
        {selectedTicket ? (
          <div className="flex-1 flex flex-col">
            {/* Ticket Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      tickets.find((t) => t.id === selectedTicket)
                        ?.customerAvatar
                    }
                    alt={
                      tickets.find((t) => t.id === selectedTicket)?.customerName
                    }
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    {tickets.find((t) => t.id === selectedTicket)?.customerName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {
                        tickets.find((t) => t.id === selectedTicket)
                          ?.customerEmail
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  {isRTL ? "تحديث الحالة" : "Update Status"}
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">
                {`#${selectedTicket} - ${tickets.find((t) => t.id === selectedTicket)?.subject}`}
              </h2>
              <div className="flex gap-2 mt-2">
                {getStatusBadge(
                  tickets.find((t) => t.id === selectedTicket)?.status || "",
                )}
                {getPriorityBadge(
                  tickets.find((t) => t.id === selectedTicket)?.priority || "",
                )}
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "تم إنشاؤه في" : "Created on"}{" "}
                  {new Date(
                    tickets.find((t) => t.id === selectedTicket)?.createdAt ||
                      "",
                  ).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-4 text-muted-foreground">
                {tickets.find((t) => t.id === selectedTicket)?.description}
              </p>
            </div>

            {/* Ticket Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tickets
                .find((t) => t.id === selectedTicket)
                ?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${message.sender === "customer" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                    >
                      {message.sender === "agent" && message.agentName && (
                        <div className="text-xs mb-1 font-medium">
                          {message.agentName}
                        </div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs mt-1 text-right text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t">
              <Textarea
                placeholder={
                  isRTL ? "اكتب ردك هنا..." : "Type your reply here..."
                }
                rows={3}
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  {isRTL ? "إرفاق ملف" : "Attach File"}
                </Button>
                <Button>{isRTL ? "إرسال" : "Send"}</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isRTL ? "اختر تذكرة" : "Select a ticket"}
              </h3>
              <p className="text-muted-foreground">
                {isRTL
                  ? "اختر تذكرة من القائمة لعرض التفاصيل"
                  : "Choose a ticket from the list to view details"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicket;

import React, { useState } from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/frontend/components/ui/avatar";
import {
  ShoppingCart,
  CreditCard,
  MessageSquare,
  User,
  Bell,
  Package,
  Truck,
  Calendar,
  Filter,
  ChevronRight,
} from "lucide-react";

interface ActivityItem {
  id: number;
  type: "order" | "payment" | "message" | "user" | "notification" | "shipment";
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  time: string;
  timeAr?: string;
  avatar?: string;
  status?: "pending" | "completed" | "failed" | "processing" | "delivered";
  priority?: "low" | "medium" | "high";
  module?: string;
}

const RecentActivity: React.FC = () => {
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAll, setShowAll] = useState<boolean>(false);

  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "order",
      title: "New Order",
      titleAr: "طلب جديد",
      description: "Order #12345 has been placed for $189.99",
      descriptionAr: "تم وضع الطلب #12345 بقيمة 189.99$",
      time: "5 minutes ago",
      timeAr: "منذ 5 دقائق",
      status: "pending",
      priority: "medium",
      module: "store",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      titleAr: "تم استلام الدفعة",
      description: "Payment of $250.00 received for order #12344",
      descriptionAr: "تم استلام دفعة بقيمة 250.00$ للطلب #12344",
      time: "15 minutes ago",
      timeAr: "منذ 15 دقيقة",
      status: "completed",
      priority: "low",
      module: "accounting",
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      titleAr: "رسالة جديدة",
      description: "You have a new message from John Doe about order #12340",
      descriptionAr: "لديك رسالة جديدة من جون دو حول الطلب #12340",
      time: "30 minutes ago",
      timeAr: "منذ 30 دقيقة",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      priority: "high",
      module: "inbox",
    },
    {
      id: 4,
      type: "user",
      title: "New User",
      titleAr: "مستخدم جديد",
      description: "Sarah Smith has registered and verified their email",
      descriptionAr: "سارة سميث قامت بالتسجيل وتأكيد بريدها الإلكتروني",
      time: "1 hour ago",
      timeAr: "منذ ساعة",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      priority: "low",
      module: "customers",
    },
    {
      id: 5,
      type: "shipment",
      title: "Order Shipped",
      titleAr: "تم شحن الطلب",
      description: "Order #12343 has been shipped via Express Delivery",
      descriptionAr: "تم شحن الطلب #12343 عبر التوصيل السريع",
      time: "2 hours ago",
      timeAr: "منذ ساعتين",
      status: "completed",
      priority: "medium",
      module: "store",
    },
    {
      id: 6,
      type: "notification",
      title: "Inventory Alert",
      titleAr: "تنبيه المخزون",
      description:
        "Product 'Premium Headphones' is running low on stock (3 remaining)",
      descriptionAr:
        "المنتج 'سماعات رأس متميزة' على وشك النفاد من المخزون (3 متبقية)",
      time: "3 hours ago",
      timeAr: "منذ 3 ساعات",
      status: "pending",
      priority: "high",
      module: "store",
    },
    {
      id: 7,
      type: "order",
      title: "Order Updated",
      titleAr: "تم تحديث الطلب",
      description: "Customer requested changes to order #12342",
      descriptionAr: "طلب العميل تغييرات على الطلب #12342",
      time: "4 hours ago",
      timeAr: "منذ 4 ساعات",
      status: "processing",
      priority: "medium",
      module: "store",
    },
    {
      id: 8,
      type: "shipment",
      title: "Order Delivered",
      titleAr: "تم تسليم الطلب",
      description: "Order #12339 has been delivered successfully",
      descriptionAr: "تم تسليم الطلب #12339 بنجاح",
      time: "5 hours ago",
      timeAr: "منذ 5 ساعات",
      status: "delivered",
      priority: "low",
      module: "store",
    },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (activeTab === "all") return true;
    if (activeTab === "high") return activity.priority === "high";
    return activity.type === activeTab;
  });

  const displayedActivities = showAll
    ? filteredActivities
    : filteredActivities.slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "notification":
        return <Bell className="h-4 w-4" />;
      case "shipment":
        return <Truck className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "payment":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "message":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "user":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400";
      case "notification":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case "shipment":
        return "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400";
      default:
        return "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            {rtl ? "قيد الانتظار" : "Pending"}
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            {rtl ? "قيد المعالجة" : "Processing"}
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            {rtl ? "مكتمل" : "Completed"}
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
          >
            {rtl ? "تم التسليم" : "Delivered"}
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            {rtl ? "فشل" : "Failed"}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityIndicator = (priority?: string) => {
    if (!priority) return null;

    switch (priority) {
      case "high":
        return (
          <div className="w-2 h-2 rounded-full bg-red-500 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" />
        );
      case "medium":
        return (
          <div className="w-2 h-2 rounded-full bg-amber-500 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" />
        );
      case "low":
        return (
          <div className="w-2 h-2 rounded-full bg-green-500 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{rtl ? "النشاط الأخير" : "Recent Activity"}</CardTitle>
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="all" className="text-xs">
              {rtl ? "الكل" : "All"}
            </TabsTrigger>
            <TabsTrigger value="order" className="text-xs">
              {rtl ? "الطلبات" : "Orders"}
            </TabsTrigger>
            <TabsTrigger value="message" className="text-xs">
              {rtl ? "الرسائل" : "Messages"}
            </TabsTrigger>
            <TabsTrigger value="shipment" className="text-xs">
              {rtl ? "الشحنات" : "Shipments"}
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs">
              {rtl ? "عالي الأهمية" : "High Priority"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 rtl:space-x-reverse"
            >
              {activity.avatar ? (
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar} alt="Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  {getPriorityIndicator(activity.priority)}
                </div>
              ) : (
                <div
                  className={`p-2 rounded-full ${getIconColor(activity.type)} relative`}
                >
                  {getActivityIcon(activity.type)}
                  {getPriorityIndicator(activity.priority)}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {rtl ? activity.titleAr : activity.title}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {rtl ? activity.descriptionAr : activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rtl && activity.timeAr ? activity.timeAr : activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-primary"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? rtl
              ? "عرض أقل"
              : "Show Less"
            : rtl
              ? "عرض المزيد"
              : "Show More"}
          <ChevronRight
            className={`h-4 w-4 ml-1 ${showAll ? "rotate-90" : ""}`}
          />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;

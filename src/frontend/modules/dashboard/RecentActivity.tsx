import React from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/frontend/components/ui/avatar";
import { ShoppingCart, CreditCard, MessageSquare, User } from "lucide-react";

interface ActivityItem {
  id: number;
  type: "order" | "payment" | "message" | "user";
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  time: string;
  avatar?: string;
  status?: "pending" | "completed" | "failed";
}

const RecentActivity: React.FC = () => {
  const { direction } = useLanguage();
  const rtl = direction === "rtl";

  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "order",
      title: "New Order",
      titleAr: "طلب جديد",
      description: "Order #12345 has been placed",
      descriptionAr: "تم وضع الطلب #12345",
      time: "5 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      titleAr: "تم استلام الدفعة",
      description: "Payment of $250.00 received for order #12344",
      descriptionAr: "تم استلام دفعة بقيمة 250.00$ للطلب #12344",
      time: "15 minutes ago",
      status: "completed",
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      titleAr: "رسالة جديدة",
      description: "You have a new message from John Doe",
      descriptionAr: "لديك رسالة جديدة من جون دو",
      time: "30 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: 4,
      type: "user",
      title: "New User",
      titleAr: "مستخدم جديد",
      description: "Sarah Smith has registered",
      descriptionAr: "سارة سميث قامت بالتسجيل",
      time: "1 hour ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: 5,
      type: "order",
      title: "Order Shipped",
      titleAr: "تم شحن الطلب",
      description: "Order #12343 has been shipped",
      descriptionAr: "تم شحن الطلب #12343",
      time: "2 hours ago",
      status: "completed",
    },
  ];

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
      default:
        return <ShoppingCart className="h-4 w-4" />;
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
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            {rtl ? "مكتمل" : "Completed"}
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

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle>{rtl ? "النشاط الأخير" : "Recent Activity"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              {activity.avatar ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar} alt="Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <div className="p-2 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                  {getActivityIcon(activity.type)}
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
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

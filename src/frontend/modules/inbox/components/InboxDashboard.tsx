import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleNavigationBar from "@/frontend/modules/layout/ModuleNavigationBar";
import { MessageSquare, MessagesSquare, HeadphonesIcon } from "lucide-react";

interface InboxDashboardProps {
  isRTL?: boolean;
}

const InboxDashboard = ({ isRTL = false }: InboxDashboardProps) => {
  const inboxNavigationItems = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: isRTL ? "مركز الرسائل" : "Message Center",
      href: "/inbox/messages",
      isActive: true,
    },
    {
      icon: <MessagesSquare className="h-5 w-5" />,
      label: isRTL ? "المحادثات" : "Conversations",
      href: "/inbox/conversations",
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      label: isRTL ? "خدمة العملاء" : "Customer Service",
      href: "/inbox/customer-service",
    },
  ];

  return (
    <div className="flex h-full">
      <ModuleNavigationBar
        moduleName={isRTL ? "صندوق الوارد" : "Inbox"}
        isRTL={isRTL}
        items={inboxNavigationItems}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "مركز الرسائل" : "Message Center"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL
                  ? "إدارة الرسائل من جميع القنوات"
                  : "Manage messages from all channels"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "المحادثات" : "Conversations"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "إدارة المحادثات" : "Manage conversations"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "خدمة العملاء" : "Customer Service"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL
                  ? "إدارة طلبات خدمة العملاء"
                  : "Manage customer service requests"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InboxDashboard;

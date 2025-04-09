import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { MessageSquare, MessagesSquare, HeadphonesIcon } from "lucide-react";

interface InboxDashboardProps {
  isRTL?: boolean;
}

const InboxDashboard = ({ isRTL = false }: InboxDashboardProps) => {
  return (
    <div className="h-full bg-background">
      <div className="p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "صندوق الوارد" : "Inbox Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في صندوق الوارد. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Inbox Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </div>
  );
};

export default InboxDashboard;

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { MessageSquare, MessagesSquare, HeadphonesIcon } from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface InboxDashboardProps {
  isRTL?: boolean;
}

const InboxDashboard = ({ isRTL = false }: InboxDashboardProps) => {
  const { direction } = useLanguage();
  const rtl = isRTL || direction === "rtl";

  return (
    <ModuleLayout moduleName={rtl ? "صندوق الوارد" : "Inbox"}>
      <div className="h-full bg-background">
        <div className="overflow-auto">
          <h1 className="text-2xl font-bold mb-4">
            {rtl ? "صندوق الوارد" : "Inbox Dashboard"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {rtl
              ? "مرحبًا بك في صندوق الوارد. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
              : "Welcome to the Inbox Dashboard. Use the sidebar to navigate between different sections."}
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default InboxDashboard;

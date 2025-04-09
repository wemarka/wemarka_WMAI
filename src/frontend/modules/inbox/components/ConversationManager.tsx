import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ConversationManagerProps {
  isRTL?: boolean;
}

const ConversationManager = ({ isRTL = false }: ConversationManagerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إدارة المحادثات" : "Conversation Manager"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "جميع المحادثات" : "All Conversations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع المحادثات" : "View all conversations"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تعيين المحادثات" : "Assign Conversations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "تعيين المحادثات للوكلاء"
                : "Assign conversations to agents"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "الردود التلقائية" : "Automated Responses"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إعداد الردود التلقائية" : "Set up automated responses"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConversationManager;

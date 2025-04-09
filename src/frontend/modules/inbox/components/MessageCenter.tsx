import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface MessageCenterProps {
  isRTL?: boolean;
}

const MessageCenter = ({ isRTL = false }: MessageCenterProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isRTL ? "مركز الرسائل الموحد" : "Unified Message Center"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {isRTL
            ? "ستظهر الرسائل من جميع القنوات هنا"
            : "Messages from all channels will be displayed here"}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessageCenter;

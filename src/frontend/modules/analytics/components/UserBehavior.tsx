import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface UserBehaviorProps {
  isRTL?: boolean;
}

const UserBehavior = ({ isRTL = false }: UserBehaviorProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "سلوك المستخدم" : "User Behavior"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تحليل الزيارات" : "Visit Analysis"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تحليل زيارات المستخدمين" : "Analyze user visits"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "مسارات التحويل" : "Conversion Paths"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "تحليل مسارات تحويل المستخدمين"
                : "Analyze user conversion paths"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تفاعل المستخدم" : "User Engagement"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "قياس تفاعل المستخدمين" : "Measure user engagement"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserBehavior;

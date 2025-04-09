import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ContentCreatorProps {
  isRTL?: boolean;
}

const ContentCreator = ({ isRTL = false }: ContentCreatorProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إنشاء المحتوى" : "Content Creator"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "منشئ المحتوى الذكي" : "AI Content Generator"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "إنشاء محتوى باستخدام الذكاء الاصطناعي"
                : "Generate content using AI"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "جدولة المحتوى" : "Content Scheduling"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "جدولة نشر المحتوى" : "Schedule content publishing"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "مكتبة الوسائط" : "Media Library"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة مكتبة الوسائط" : "Manage media library"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentCreator;

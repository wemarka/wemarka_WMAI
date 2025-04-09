import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ChangelogViewerProps {
  isRTL?: boolean;
}

const ChangelogViewer = ({ isRTL = false }: ChangelogViewerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "عارض سجل التغييرات" : "Changelog Viewer"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جميع التغييرات" : "All Changes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع التغييرات" : "View all changes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "إصدارات النظام" : "System Versions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض إصدارات النظام" : "View system versions"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تغييرات الميزات" : "Feature Changes"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض تغييرات الميزات" : "View feature changes"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangelogViewer;

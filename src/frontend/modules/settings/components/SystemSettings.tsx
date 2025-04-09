import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface SystemSettingsProps {
  isRTL?: boolean;
}

const SystemSettings = ({ isRTL = false }: SystemSettingsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إعدادات النظام" : "System Settings"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إعدادات عامة" : "General Settings"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إعدادات النظام العامة" : "General system settings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "إعدادات اللغة" : "Language Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة إعدادات اللغة" : "Manage language settings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "النسخ الاحتياطي" : "Backup & Restore"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "إدارة النسخ الاحتياطي واستعادة البيانات"
                : "Manage backup and data restoration"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;

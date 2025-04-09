import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface SettingsDashboardProps {
  isRTL?: boolean;
}

const SettingsDashboard = ({ isRTL = false }: SettingsDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "إعدادات المستخدم" : "User Settings"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة إعدادات المستخدم" : "Manage user settings"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "إعدادات النظام" : "System Settings"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة إعدادات النظام" : "Manage system settings"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "الأذونات" : "Permissions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة أذونات المستخدمين" : "Manage user permissions"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsDashboard;

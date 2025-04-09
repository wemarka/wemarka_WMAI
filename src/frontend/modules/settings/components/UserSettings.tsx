import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface UserSettingsProps {
  isRTL?: boolean;
}

const UserSettings = ({ isRTL = false }: UserSettingsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إعدادات المستخدم" : "User Settings"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "الملف الشخصي" : "Profile"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "تحديث معلومات الملف الشخصي"
                : "Update profile information"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "الأمان" : "Security"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة إعدادات الأمان" : "Manage security settings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "التفضيلات" : "Preferences"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تخصيص تفضيلات المستخدم" : "Customize user preferences"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;

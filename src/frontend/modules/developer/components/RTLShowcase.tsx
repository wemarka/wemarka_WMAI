import React from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/frontend/components/ui/tabs";
import { Globe, MessageSquare, Users, Settings } from "lucide-react";

interface RTLShowcaseProps {
  className?: string;
}

const RTLShowcase: React.FC<RTLShowcaseProps> = ({ className }) => {
  const { language, direction, toggleDirection } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <div className={`p-6 bg-background ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isRTL ? "عرض تخطيط RTL" : "RTL Layout Showcase"}
        </h2>
        <Button onClick={toggleDirection}>
          {isRTL ? "Switch to LTR" : "Switch to RTL"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buttons Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "أزرار" : "Buttons"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">
                {isRTL ? "زر أساسي" : "Default Button"}
              </Button>
              <Button variant="secondary">
                {isRTL ? "زر ثانوي" : "Secondary Button"}
              </Button>
              <Button variant="outline">
                {isRTL ? "زر مخطط" : "Outline Button"}
              </Button>
              <Button variant="ghost">
                {isRTL ? "زر شبح" : "Ghost Button"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="destructive">
                {isRTL ? "زر تدميري" : "Destructive Button"}
              </Button>
              <Button variant="link">
                {isRTL ? "زر رابط" : "Link Button"}
              </Button>
              <Button variant="success">
                {isRTL ? "زر نجاح" : "Success Button"}
              </Button>
              <Button variant="warning">
                {isRTL ? "زر تحذير" : "Warning Button"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "علامات التبويب" : "Tabs"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList className="w-full">
                <TabsTrigger value="general">
                  <Globe className="h-4 w-4 mr-2" />
                  {isRTL ? "عام" : "General"}
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isRTL ? "الرسائل" : "Messages"}
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-2" />
                  {isRTL ? "المستخدمين" : "Users"}
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  {isRTL ? "الإعدادات" : "Settings"}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="general"
                className="p-4 border rounded-md mt-2"
              >
                {isRTL
                  ? "محتوى علامة التبويب العامة. يظهر هذا عند تحديد علامة التبويب العامة."
                  : "General tab content. This shows when the general tab is selected."}
              </TabsContent>
              <TabsContent
                value="messages"
                className="p-4 border rounded-md mt-2"
              >
                {isRTL
                  ? "محتوى علامة تبويب الرسائل. يظهر هذا عند تحديد علامة تبويب الرسائل."
                  : "Messages tab content. This shows when the messages tab is selected."}
              </TabsContent>
              <TabsContent value="users" className="p-4 border rounded-md mt-2">
                {isRTL
                  ? "محتوى علامة تبويب المستخدمين. يظهر هذا عند تحديد علامة تبويب المستخدمين."
                  : "Users tab content. This shows when the users tab is selected."}
              </TabsContent>
              <TabsContent
                value="settings"
                className="p-4 border rounded-md mt-2"
              >
                {isRTL
                  ? "محتوى علامة تبويب الإعدادات. يظهر هذا عند تحديد علامة تبويب الإعدادات."
                  : "Settings tab content. This shows when the settings tab is selected."}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RTLShowcase;

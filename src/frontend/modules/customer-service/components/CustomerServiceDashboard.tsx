import React from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import {
  MessageSquare,
  Users,
  Clock,
  BarChart,
  HeadphonesIcon,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";

interface CustomerServiceDashboardProps {}

export const CustomerServiceDashboard = ({}: CustomerServiceDashboardProps) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <ModuleLayout moduleName={isRTL ? "خدمة العملاء" : "Customer Service"}>
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-heading mb-2">
              {isRTL ? "خدمة العملاء" : "Customer Service Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL
                ? "مرحبًا بك في لوحة خدمة العملاء. هنا يمكنك إدارة صندوق الوارد الموحد والرسائل وتذاكر الدعم."
                : "Welcome to the Customer Service Dashboard. Here you can manage unified inbox, messages, and support tickets."}
            </p>
          </div>
          <Button variant="gradient" rounded="lg">
            <PlusCircle className="h-4 w-4 mr-2" />
            {isRTL ? "إنشاء تذكرة" : "Create Ticket"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="hover" padding="tight">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "الرسائل الجديدة" : "New Messages"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">24</div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium">
                +12% {isRTL ? "من الأسبوع الماضي" : "from last week"}
              </div>
            </CardContent>
          </Card>

          <Card variant="hover" padding="tight">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "التذاكر المفتوحة" : "Open Tickets"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">18</div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <HeadphonesIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600 font-medium">
                +5% {isRTL ? "من الأسبوع الماضي" : "from last week"}
              </div>
            </CardContent>
          </Card>

          <Card variant="hover" padding="tight">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "متوسط وقت الاستجابة" : "Avg. Response Time"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">14m</div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium">
                -2m {isRTL ? "من الأسبوع الماضي" : "from last week"}
              </div>
            </CardContent>
          </Card>

          <Card variant="hover" padding="tight">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "رضا العملاء" : "Customer Satisfaction"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">92%</div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium">
                +2% {isRTL ? "من الأسبوع الماضي" : "from last week"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" variant="hover">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle gradient>
                  {isRTL ? "الرسائل الأخيرة" : "Recent Messages"}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  {isRTL ? "عرض الكل" : "View All"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white shadow-sm">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">
                          {isRTL ? `عميل ${i}` : `Customer ${i}`}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {`${i * 10}m ago`}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isRTL
                          ? "أحتاج مساعدة بخصوص طلبي الأخير. هل يمكنكم التحقق من حالة الشحن؟"
                          : "I need help with my recent order. Can you check the shipping status?"}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {isRTL ? "واتساب" : "WhatsApp"}
                        </span>
                        <Button variant="outline" size="sm" rounded="lg">
                          {isRTL ? "الرد" : "Reply"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="hover">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle gradient>
                  {isRTL ? "تذاكر الدعم" : "Support Tickets"}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  {isRTL ? "عرض الكل" : "View All"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border bg-card shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">
                        {isRTL ? `تذكرة #${i}00${i}` : `Ticket #${i}00${i}`}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${i === 1 ? "bg-destructive/10 text-destructive" : i === 2 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"} font-medium`}
                      >
                        {i === 1
                          ? isRTL
                            ? "عالية"
                            : "High"
                          : i === 2
                            ? isRTL
                              ? "متوسطة"
                              : "Medium"
                            : isRTL
                              ? "منخفضة"
                              : "Low"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {isRTL
                        ? "مشكلة في تسجيل الدخول إلى الحساب"
                        : "Issue with logging into account"}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">
                        {`${i * 2}h ago`}
                      </span>
                      <Button variant="outline" size="sm" rounded="lg">
                        {isRTL ? "عرض" : "View"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default CustomerServiceDashboard;

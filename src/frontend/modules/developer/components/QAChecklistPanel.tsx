import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/frontend/components/ui/card";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Save,
  RotateCcw,
} from "lucide-react";

type ChecklistItemStatus =
  | "completed"
  | "in-progress"
  | "not-started"
  | "needs-attention";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: ChecklistItemStatus;
  link: string;
  linkText: string;
}

interface QAChecklistPanelProps {
  isRTL?: boolean;
}

const QAChecklistPanel: React.FC<QAChecklistPanelProps> = ({
  isRTL = false,
}) => {
  // Initial checklist items
  const initialChecklistItems: ChecklistItem[] = [
    {
      id: "auth-flow",
      title: isRTL ? "تدفق المصادقة" : "Authentication Flow",
      description: isRTL
        ? "التحقق من تسجيل الدخول وتسجيل المستخدم واستعادة كلمة المرور"
        : "Verify login, registration, and password recovery",
      status: "in-progress",
      link: "/dashboard/developer/test-coverage",
      linkText: isRTL ? "عرض اختبارات المصادقة" : "View Auth Tests",
    },
    {
      id: "rbac",
      title: isRTL
        ? "التحكم في الوصول المستند إلى الأدوار"
        : "Role-Based Access Control",
      description: isRTL
        ? "التحقق من أذونات المستخدم وقيود الوصول"
        : "Verify user permissions and access restrictions",
      status: "completed",
      link: "/dashboard/settings/roles",
      linkText: isRTL ? "عرض إدارة الأدوار" : "View Role Management",
    },
    {
      id: "navigation",
      title: isRTL ? "التنقل بين الوحدات" : "Navigation Between Modules",
      description: isRTL
        ? "التحقق من التنقل السلس بين جميع وحدات النظام"
        : "Verify smooth navigation between all system modules",
      status: "completed",
      link: "/dashboard",
      linkText: isRTL ? "اختبار التنقل" : "Test Navigation",
    },
    {
      id: "test-coverage",
      title: isRTL ? "حالة تغطية الاختبار" : "Test Coverage Status",
      description: isRTL
        ? "مراجعة تغطية الاختبار لجميع الوحدات والمكونات"
        : "Review test coverage for all modules and components",
      status: "in-progress",
      link: "/dashboard/developer/test-coverage",
      linkText: isRTL ? "عرض تغطية الاختبار" : "View Test Coverage",
    },
    {
      id: "responsiveness",
      title: isRTL
        ? "الاستجابة على الجوال/الجهاز اللوحي"
        : "Responsiveness on Mobile/Tablet",
      description: isRTL
        ? "التحقق من تجربة المستخدم على أحجام الشاشات المختلفة"
        : "Verify user experience on different screen sizes",
      status: "needs-attention",
      link: "/dashboard/developer/responsive-test",
      linkText: isRTL ? "اختبار الاستجابة" : "Test Responsiveness",
    },
    {
      id: "rtl-language",
      title: isRTL ? "RTL وتبديل اللغة" : "RTL and Language Switching",
      description: isRTL
        ? "التحقق من دعم RTL وتبديل اللغة في جميع الوحدات"
        : "Verify RTL support and language switching across all modules",
      status: "completed",
      link: "/dashboard/developer/rtl-showcase",
      linkText: isRTL ? "عرض RTL" : "View RTL Showcase",
    },
    {
      id: "ai-assistant",
      title: isRTL
        ? "وظائف مساعد الذكاء الاصطناعي"
        : "AI Assistant Functionality",
      description: isRTL
        ? "التحقق من تكامل مساعد الذكاء الاصطناعي في كل وحدة"
        : "Verify AI Assistant integration in each module",
      status: "in-progress",
      link: "/dashboard/developer/ai-test",
      linkText: isRTL ? "اختبار مساعد الذكاء الاصطناعي" : "Test AI Assistant",
    },
  ];

  // State for checklist items and checked state
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initialChecklistItems,
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    initialChecklistItems.reduce(
      (acc, item) => {
        acc[item.id] = item.status === "completed";
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));

    // Update status based on checkbox
    setChecklistItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: checked ? "completed" : "in-progress",
          };
        }
        return item;
      }),
    );
  };

  // Reset checklist to initial state
  const handleReset = () => {
    setChecklistItems(initialChecklistItems);
    setCheckedItems(
      initialChecklistItems.reduce(
        (acc, item) => {
          acc[item.id] = item.status === "completed";
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    );
  };

  // Save checklist (in a real app, this would save to a database)
  const handleSave = () => {
    // Simulate saving
    alert(isRTL ? "تم حفظ قائمة التحقق" : "Checklist saved successfully");
  };

  // Get badge for status
  const getStatusBadge = (status: ChecklistItemStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
            {isRTL ? "مكتمل" : "Completed"}
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
          >
            <Clock className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
            {isRTL ? "قيد التقدم" : "In Progress"}
          </Badge>
        );
      case "needs-attention":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
            {isRTL ? "يحتاج اهتمام" : "Needs Attention"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{isRTL ? "لم يبدأ" : "Not Started"}</Badge>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة قائمة التحقق من ضمان الجودة" : "QA Checklist Panel"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "إعادة تعيين" : "Reset"}
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "حفظ التقدم" : "Save Progress"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL
              ? "قائمة التحقق من ضمان الجودة"
              : "Quality Assurance Checklist"}
          </CardTitle>
          <CardDescription>
            {isRTL
              ? "تتبع حالة اختبار وتحقق من ميزات النظام الرئيسية"
              : "Track the testing and verification status of key system features"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center h-5 mt-1">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems[item.id]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item.id, !!checked)
                    }
                  />
                </div>
                <div className="ms-3 flex-1">
                  <label
                    htmlFor={item.id}
                    className="font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                  >
                    {item.title}
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {getStatusBadge(item.status)}
                    <Link to={item.link}>
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        {item.linkText}
                        <ExternalLink className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {isRTL ? "ملخص التقدم" : "Progress Summary"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {Object.values(checkedItems).filter(Boolean).length} /{" "}
                  {checklistItems.length} {isRTL ? "مكتمل" : "completed"}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs">
                    {
                      checklistItems.filter(
                        (item) => item.status === "completed",
                      ).length
                    }{" "}
                    {isRTL ? "مكتمل" : "Completed"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs">
                    {
                      checklistItems.filter(
                        (item) => item.status === "in-progress",
                      ).length
                    }{" "}
                    {isRTL ? "قيد التقدم" : "In Progress"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs">
                    {
                      checklistItems.filter(
                        (item) => item.status === "needs-attention",
                      ).length
                    }{" "}
                    {isRTL ? "يحتاج اهتمام" : "Needs Attention"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QAChecklistPanel;

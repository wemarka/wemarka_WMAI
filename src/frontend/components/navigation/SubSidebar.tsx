import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/frontend/lib/utils";
import {
  ChevronLeft,
  Package,
  BarChart3,
  ShoppingCart,
  Receipt,
  BadgeDollarSign,
  FileBarChart,
  TrendingUp,
  FileText,
  BarChart,
  Users,
  UsersRound,
  MessageSquare,
  MessagesSquare,
  HeadphonesIcon,
  Target,
  Code,
  Settings,
  Layers,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useSidebar } from "@/frontend/contexts/SidebarContext";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface SubSidebarProps {
  collapsed?: boolean;
}

interface SubItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  isActive?: boolean;
}

interface ModuleNavItems {
  [key: string]: SubItem[];
}

const SubSidebar: React.FC<SubSidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const { direction } = useLanguage();
  const { selectedModule, closeSubSidebar } = useSidebar();
  const isRTL = direction === "rtl";

  // Define navigation items for each module
  const moduleNavItems: ModuleNavItems = {
    Store: [
      {
        icon: <Package />,
        name: isRTL ? "المنتجات" : "Products",
        path: "/dashboard/store/products",
        isActive: true,
      },
      {
        icon: <BarChart3 />,
        name: isRTL ? "المخزون" : "Inventory",
        path: "/dashboard/store/inventory",
      },
      {
        icon: <ShoppingCart />,
        name: isRTL ? "الطلبات" : "Orders",
        path: "/dashboard/store/orders",
      },
    ],
    Accounting: [
      {
        icon: <Receipt />,
        name: isRTL ? "الفواتير" : "Invoices",
        path: "/dashboard/accounting/invoices",
        isActive: true,
      },
      {
        icon: <BadgeDollarSign />,
        name: isRTL ? "المصروفات" : "Expenses",
        path: "/dashboard/accounting/expenses",
      },
      {
        icon: <FileBarChart />,
        name: isRTL ? "التقارير المالية" : "Financial Reports",
        path: "/dashboard/accounting/reports",
      },
    ],
    Marketing: [
      {
        icon: <TrendingUp />,
        name: isRTL ? "الحملات" : "Campaigns",
        path: "/dashboard/marketing/campaigns",
        isActive: true,
      },
      {
        icon: <FileText />,
        name: isRTL ? "إنشاء المحتوى" : "Content Creation",
        path: "/dashboard/marketing/content",
      },
      {
        icon: <BarChart />,
        name: isRTL ? "تحليل الأداء" : "Performance Analytics",
        path: "/dashboard/marketing/analytics",
      },
    ],
    Analytics: [
      {
        icon: <TrendingUp />,
        name: isRTL ? "اتجاهات المبيعات" : "Sales Trends",
        path: "/dashboard/analytics/sales",
        isActive: true,
      },
      {
        icon: <Users />,
        name: isRTL ? "سلوك المستخدم" : "User Behavior",
        path: "/dashboard/analytics/users",
      },
      {
        icon: <Target />,
        name: isRTL ? "عائد الاستثمار التسويقي" : "Marketing ROI",
        path: "/dashboard/analytics/marketing",
      },
    ],
    Customers: [
      {
        icon: <Users />,
        name: isRTL ? "قائمة العملاء" : "Customer List",
        path: "/dashboard/customers/list",
        isActive: true,
      },
      {
        icon: <UsersRound />,
        name: isRTL ? "مجموعات العملاء" : "Customer Groups",
        path: "/dashboard/customers/groups",
      },
      {
        icon: <BarChart />,
        name: isRTL ? "تحليلات العملاء" : "Customer Analytics",
        path: "/dashboard/customers/analytics",
      },
    ],
    Inbox: [
      {
        icon: <MessageSquare />,
        name: isRTL ? "مركز الرسائل" : "Message Center",
        path: "/dashboard/inbox/messages",
        isActive: true,
      },
      {
        icon: <MessagesSquare />,
        name: isRTL ? "المحادثات" : "Conversations",
        path: "/dashboard/inbox/conversations",
      },
      {
        icon: <HeadphonesIcon />,
        name: isRTL ? "خدمة العملاء" : "Customer Service",
        path: "/dashboard/inbox/customer-service",
      },
    ],
    Documents: [
      {
        icon: <FileText />,
        name: isRTL ? "قائمة المستندات" : "Document List",
        path: "/dashboard/documents/list",
        isActive: true,
      },
      {
        icon: <FileText />,
        name: isRTL ? "عارض المستندات" : "Document Viewer",
        path: "/dashboard/documents/viewer",
      },
      {
        icon: <FileText />,
        name: isRTL ? "قوالب المستندات" : "Document Templates",
        path: "/dashboard/documents/templates",
      },
    ],
    Integrations: [
      {
        icon: <Layers />,
        name: isRTL ? "بوابات الدفع" : "Payment Gateways",
        path: "/dashboard/integrations/payment",
        isActive: true,
      },
      {
        icon: <Layers />,
        name: isRTL ? "واجهات برمجة خارجية" : "External APIs",
        path: "/dashboard/integrations/apis",
      },
      {
        icon: <Layers />,
        name: isRTL ? "منصات الأتمتة" : "Automation Platforms",
        path: "/dashboard/integrations/automation",
      },
    ],
    Developer: [
      {
        icon: <Code />,
        name: isRTL ? "اختبار API" : "API Testing",
        path: "/dashboard/developer/api",
        isActive: true,
      },
      {
        icon: <Code />,
        name: isRTL ? "سجل التغييرات" : "Changelog",
        path: "/dashboard/developer/changelog",
      },
      {
        icon: <Code />,
        name: isRTL ? "سجلات التطوير" : "Development Logs",
        path: "/dashboard/developer/logs",
      },
    ],
    Settings: [
      {
        icon: <Settings />,
        name: isRTL ? "إعدادات المستخدم" : "User Settings",
        path: "/dashboard/settings/user",
        isActive: true,
      },
      {
        icon: <Settings />,
        name: isRTL ? "إعدادات النظام" : "System Settings",
        path: "/dashboard/settings/system",
      },
      {
        icon: <Settings />,
        name: isRTL ? "الأذونات" : "Permissions",
        path: "/dashboard/settings/permissions",
      },
    ],
  };

  // Get the navigation items for the selected module
  const navItems = selectedModule ? moduleNavItems[selectedModule] || [] : [];

  if (!selectedModule) return null;

  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="wemarka-module-nav-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={closeSubSidebar}
          className="wemarka-module-nav-back"
        >
          <ChevronLeft className={cn("h-4 w-4 mr-1", isRTL && "rotate-180")} />
          <span>{isRTL ? "رجوع" : "Back"}</span>
        </Button>
        <h2 className="wemarka-module-nav-title">
          {isRTL ? getArabicModuleName(selectedModule) : selectedModule}
        </h2>
      </div>

      <div className="wemarka-module-nav-items">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={cn(
                  "wemarka-sidebar-item",
                  item.isActive
                    ? "wemarka-sidebar-item-active"
                    : "wemarka-sidebar-item-inactive",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                <div className="flex-shrink-0 w-5 h-5 mr-2">{item.icon}</div>
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Helper function to get Arabic module names
function getArabicModuleName(moduleName: string): string {
  const arabicNames: Record<string, string> = {
    Dashboard: "لوحة القيادة",
    Store: "المتجر",
    Accounting: "المحاسبة",
    Marketing: "التسويق",
    Analytics: "التحليلات",
    Customers: "العملاء",
    Documents: "المستندات",
    Integrations: "التكاملات",
    Developer: "المطور",
    Settings: "الإعدادات",
    Inbox: "صندوق الوارد",
  };

  return arabicNames[moduleName] || moduleName;
}

export default SubSidebar;

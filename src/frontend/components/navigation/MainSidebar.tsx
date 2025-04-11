import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/frontend/lib/utils";
import {
  LayoutDashboard,
  Store,
  Wallet,
  Megaphone,
  FileBarChart,
  Users,
  FileText,
  Layers,
  Code,
  Settings,
  ChevronRight,
  ShoppingBag,
  HeadphonesIcon,
  Moon,
  Sun,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  BarChart3,
  MessageSquare,
  Inbox,
  Sparkles,
  LogOut,
  ChevronDown,
  Home,
  Gauge,
  Boxes,
  Truck,
  CreditCard,
  PieChart,
  LineChart,
  UserCog,
  Cog,
  Globe,
  Zap,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { useSidebar } from "@/frontend/contexts/SidebarContext";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useRole } from "@/frontend/contexts/RoleContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/frontend/components/ui/collapsible";

interface MainSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

interface NavigationItem {
  name: string;
  nameAr?: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeColor?: string;
  children?: NavigationItem[];
}

const MainSidebar: React.FC<MainSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  isDarkMode = false,
  toggleDarkMode,
}) => {
  const navigate = useNavigate();
  const { direction } = useLanguage();
  const { selectedModule, openSubSidebar } = useSidebar();
  const { canAccessModule, userRoles } = useRole();
  const isRTL = direction === "rtl";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    store: false,
    analytics: false,
    customers: false,
  });

  const toggleSection = (section: string) => {
    if (collapsed) return;
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigationItems: NavigationItem[] = [
    {
      name: "Dashboard",
      nameAr: "لوحة التحكم",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      name: "Store",
      nameAr: "المتجر",
      icon: <Store className="h-5 w-5" />,
      path: "/dashboard/store",
      badge: "3",
      badgeColor: "bg-blue-500",
      children: [
        {
          name: "Products",
          nameAr: "المنتجات",
          icon: <Boxes className="h-4 w-4" />,
          path: "/dashboard/store/products",
        },
        {
          name: "Orders",
          nameAr: "الطلبات",
          icon: <ShoppingBag className="h-4 w-4" />,
          path: "/dashboard/store/orders",
          badge: "3",
          badgeColor: "bg-blue-500",
        },
        {
          name: "Inventory",
          nameAr: "المخزون",
          icon: <Boxes className="h-4 w-4" />,
          path: "/dashboard/store/inventory",
        },
        {
          name: "Shipping",
          nameAr: "الشحن",
          icon: <Truck className="h-4 w-4" />,
          path: "/dashboard/store/shipping",
        },
      ],
    },
    {
      name: "Storefront",
      nameAr: "واجهة المتجر",
      icon: <Globe className="h-5 w-5" />,
      path: "/dashboard/storefront",
    },
    {
      name: "Accounting",
      nameAr: "المحاسبة",
      icon: <Wallet className="h-5 w-5" />,
      path: "/dashboard/accounting",
      children: [
        {
          name: "Invoices",
          nameAr: "الفواتير",
          icon: <FileText className="h-4 w-4" />,
          path: "/dashboard/accounting/invoices",
        },
        {
          name: "Expenses",
          nameAr: "المصروفات",
          icon: <CreditCard className="h-4 w-4" />,
          path: "/dashboard/accounting/expenses",
        },
        {
          name: "Reports",
          nameAr: "التقارير",
          icon: <PieChart className="h-4 w-4" />,
          path: "/dashboard/accounting/reports",
        },
      ],
    },
    {
      name: "Marketing",
      nameAr: "التسويق",
      icon: <Megaphone className="h-5 w-5" />,
      path: "/dashboard/marketing",
    },
    {
      name: "Inbox",
      nameAr: "البريد الوارد",
      icon: <Inbox className="h-5 w-5" />,
      path: "/dashboard/inbox",
      badge: "5",
      badgeColor: "bg-red-500",
    },
    {
      name: "Customer Service",
      nameAr: "خدمة العملاء",
      icon: <HeadphonesIcon className="h-5 w-5" />,
      path: "/dashboard/customer-service",
    },
    {
      name: "Analytics",
      nameAr: "التحليلات",
      icon: <FileBarChart className="h-5 w-5" />,
      path: "/dashboard/analytics",
      children: [
        {
          name: "Sales",
          nameAr: "المبيعات",
          icon: <LineChart className="h-4 w-4" />,
          path: "/dashboard/analytics/sales",
        },
        {
          name: "Traffic",
          nameAr: "الزيارات",
          icon: <BarChart3 className="h-4 w-4" />,
          path: "/dashboard/analytics/traffic",
        },
        {
          name: "User Behavior",
          nameAr: "سلوك المستخدم",
          icon: <UserCog className="h-4 w-4" />,
          path: "/dashboard/analytics/user-behavior",
        },
      ],
    },
    {
      name: "Customers",
      nameAr: "العملاء",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/customers",
    },
    {
      name: "Documents",
      nameAr: "المستندات",
      icon: <FileText className="h-5 w-5" />,
      path: "/dashboard/documents",
    },
    {
      name: "Integrations",
      nameAr: "التكاملات",
      icon: <Zap className="h-5 w-5" />,
      path: "/dashboard/integrations",
    },
    {
      name: "Developer",
      nameAr: "المطور",
      icon: <Code className="h-5 w-5" />,
      path: "/dashboard/developer",
    },
    {
      name: "Settings",
      nameAr: "الإعدادات",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
    },
  ];

  // Filter navigation items based on user roles
  const filteredNavigationItems = navigationItems.filter((item) =>
    canAccessModule(item.name),
  );

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const isActive = selectedModule === item.name;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections[item.name.toLowerCase()];

    return (
      <li key={item.path}>
        {hasChildren && !collapsed ? (
          <Collapsible
            open={isOpen}
            onOpenChange={() => toggleSection(item.name.toLowerCase())}
          >
            <CollapsibleTrigger asChild>
              <a
                href="#"
                className={cn(
                  "flex items-center p-2.5 rounded-xl group transition-all justify-between",
                  isActive
                    ? "bg-primary text-white font-medium shadow-sm"
                    : "text-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20",
                  isChild ? "ml-2 p-2" : "",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSection(item.name.toLowerCase());
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className={isRTL ? "mr-3" : "ml-3"}>
                    {isRTL && item.nameAr ? item.nameAr : item.name}
                  </span>
                </div>
                <div className="flex items-center">
                  {item.badge && (
                    <Badge
                      className={`${item.badgeColor} text-white mr-2 h-5 min-w-5 flex items-center justify-center`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen ? "transform rotate-180" : "",
                    )}
                  />
                </div>
              </a>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              {item.children?.map((child) => renderNavigationItem(child, true))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className={cn(
                    "flex items-center p-2.5 rounded-xl group transition-all",
                    isActive
                      ? "bg-primary text-white font-medium shadow-sm"
                      : "text-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20",
                    collapsed ? "justify-center" : "justify-between",
                    isChild ? "ml-2 p-2" : "",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasChildren && !collapsed) {
                      toggleSection(item.name.toLowerCase());
                    } else if (item.name === "Dashboard") {
                      navigate(item.path);
                    } else {
                      openSubSidebar(item.name as any);
                      navigate(item.path);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      collapsed ? "" : "w-full",
                    )}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center relative">
                      {item.icon}
                      {collapsed && item.badge && (
                        <span
                          className={`absolute -top-1 -right-1 ${item.badgeColor} text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <span className={isRTL ? "mr-3" : "ml-3"}>
                        {isRTL && item.nameAr ? item.nameAr : item.name}
                      </span>
                    )}
                  </div>
                  {!collapsed && item.badge && !hasChildren && (
                    <Badge
                      className={`${item.badgeColor} text-white h-5 min-w-5 flex items-center justify-center`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </a>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side={isRTL ? "left" : "right"}>
                  <p>{isRTL && item.nameAr ? item.nameAr : item.name}</p>
                  {item.badge && (
                    <Badge className={`${item.badgeColor} text-white ml-2`}>
                      {item.badge}
                    </Badge>
                  )}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64",
        isRTL ? "border-l border-r-0" : "",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          {!collapsed && (
            <span className="text-xl font-bold text-primary">
              {isRTL ? "ويماركا" : "Wemarka"}
            </span>
          )}
          {collapsed && (
            <span className="text-xl font-bold text-primary">W</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed ? "" : "rotate-180",
              isRTL ? "rotate-180" : "",
              isRTL && !collapsed ? "rotate-0" : "",
            )}
          />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {filteredNavigationItems.map((item) => renderNavigationItem(item))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              {!collapsed && (
                <span>{isRTL ? "الوضع النهاري" : "Light Mode"}</span>
              )}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              {!collapsed && (
                <span>{isRTL ? "الوضع الليلي" : "Dark Mode"}</span>
              )}
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default MainSidebar;

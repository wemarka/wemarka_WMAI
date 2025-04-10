import React from "react";
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
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useSidebar } from "@/frontend/contexts/SidebarContext";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface MainSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
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
  const isRTL = direction === "rtl";

  const navigationItems: NavigationItem[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      name: "Store",
      icon: <Store className="h-5 w-5" />,
      path: "/dashboard/store",
    },
    {
      name: "Storefront",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/dashboard/storefront",
    },
    {
      name: "Accounting",
      icon: <Wallet className="h-5 w-5" />,
      path: "/dashboard/accounting",
    },
    {
      name: "Marketing",
      icon: <Megaphone className="h-5 w-5" />,
      path: "/dashboard/marketing",
    },
    {
      name: "Customer Service",
      icon: <HeadphonesIcon className="h-5 w-5" />,
      path: "/dashboard/customer-service",
    },
    {
      name: "Analytics",
      icon: <FileBarChart className="h-5 w-5" />,
      path: "/dashboard/analytics",
    },
    {
      name: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/customers",
    },
    {
      name: "Documents",
      icon: <FileText className="h-5 w-5" />,
      path: "/dashboard/documents",
    },
    {
      name: "Documentation",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/dashboard/documentation",
    },
    {
      name: "Help Center",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/dashboard/help-center",
    },
    {
      name: "Integrations",
      icon: <Layers className="h-5 w-5" />,
      path: "/dashboard/integrations",
    },
    {
      name: "Developer",
      icon: <Code className="h-5 w-5" />,
      path: "/dashboard/developer",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-card shadow-sm flex flex-col transition-all duration-300 relative z-30",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center h-16 border-b bg-gradient-to-r from-primary-600 to-secondary justify-between px-4">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-primary font-bold shadow-sm">
              W
            </div>
            <h1 className="text-lg font-bold text-white ml-2">Wemarka</h1>
          </div>
        ) : (
          <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-primary font-bold mx-auto shadow-sm">
            W
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon-sm"
            rounded="full"
            onClick={onToggleCollapse}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <ul className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigationItems.map((item) => {
            const isActive = selectedModule === item.name;

            return (
              <li key={item.name}>
                <a
                  href="#"
                  className={cn(
                    "flex items-center p-2.5 rounded-xl group transition-all",
                    isActive
                      ? "bg-primary text-white font-medium shadow-sm"
                      : "text-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20",
                    collapsed ? "justify-center" : "justify-between",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.name === "Dashboard") {
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
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {item.icon}
                    </div>
                    {!collapsed && (
                      <span className={isRTL ? "mr-3" : "ml-3"}>
                        {item.name}
                      </span>
                    )}
                  </div>
                  {!collapsed && item.name !== "Dashboard" && (
                    <ChevronRight
                      className={cn("h-4 w-4", isRTL ? "rotate-180" : "")}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="p-3 border-t">
          {!collapsed ? (
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                size="sm"
                rounded="lg"
                className="w-full justify-start"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    {isRTL ? "الوضع الفاتح" : "Light Mode"}
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    {isRTL ? "الوضع الداكن" : "Dark Mode"}
                  </>
                )}
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                <p className="font-medium">Wemarka WMAI v1.0.0</p>
                <p>© 2024 Wemarka</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 items-center">
              <Button
                variant="outline"
                size="icon-sm"
                rounded="full"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                rounded="full"
                onClick={onToggleCollapse}
              >
                <ChevronRight
                  className={cn("h-4 w-4", isRTL ? "" : "rotate-180")}
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSidebar;

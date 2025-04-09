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
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useSidebar } from "@/frontend/contexts/SidebarContext";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface MainSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const MainSidebar: React.FC<MainSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
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
        "h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center h-16 border-b bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 justify-between px-4">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              W
            </div>
            <h1 className="text-lg font-bold text-primary ml-2">Wemarka</h1>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold mx-auto">
            W
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-primary hover:bg-primary-50 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = selectedModule === item.name;

            return (
              <li key={item.name}>
                <a
                  href="#"
                  className={cn(
                    "flex items-center p-2 rounded-lg group transition-all",
                    isActive
                      ? "bg-primary-50 text-primary font-medium dark:bg-primary-900/20 dark:text-primary-300"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
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
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-primary-600 dark:text-primary-400">
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
                      className={cn(
                        "h-4 w-4 text-gray-500",
                        isRTL ? "rotate-180" : "",
                      )}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20">
        {!collapsed ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium text-primary-600 dark:text-primary-400">
              Wemarka WMAI v1.0.0
            </p>
            <p>© 2024 Wemarka</p>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-primary hover:bg-primary-50 rounded-full mx-auto flex"
          >
            <ChevronRight
              className={cn("h-5 w-5", isRTL ? "" : "rotate-180")}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainSidebar;

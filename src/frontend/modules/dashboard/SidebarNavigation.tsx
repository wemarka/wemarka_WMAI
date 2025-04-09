import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

interface SidebarNavigationProps {
  collapsed?: boolean;
  isRTL?: boolean;
  activeItem?: string;
  onModuleSelect?: (moduleName: string) => void;
  onToggleCollapse?: () => void;
}

interface SubItem {
  name: string;
  path: string;
  isSeparator?: boolean;
  icon?: React.ReactNode;
}

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  subItems?: SubItem[];
  isStoryboard?: boolean;
}

const SidebarNavigation = ({
  collapsed = false,
  isRTL = false,
  activeItem = "Dashboard",
  onModuleSelect,
  onToggleCollapse,
}: SidebarNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName],
    );
  };

  const navigationItems: NavigationItem[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
      subItems: [],
    },
    {
      name: "Store",
      icon: <Store className="h-5 w-5" />,
      path: "/dashboard/store",
      subItems: [],
    },
    {
      name: "Accounting",
      icon: <Wallet className="h-5 w-5" />,
      path: "/dashboard/accounting",
      subItems: [],
    },
    {
      name: "Marketing",
      icon: <Megaphone className="h-5 w-5" />,
      path: "/dashboard/marketing",
      subItems: [],
    },
    {
      name: "Analytics",
      icon: <FileBarChart className="h-5 w-5" />,
      path: "/dashboard/analytics",
      subItems: [],
    },
    {
      name: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/customers",
      subItems: [],
    },
    {
      name: "Documents",
      icon: <FileText className="h-5 w-5" />,
      path: "/dashboard/documents",
      subItems: [],
    },
    {
      name: "Integrations",
      icon: <Layers className="h-5 w-5" />,
      path: "/dashboard/integrations",
      subItems: [],
    },
    {
      name: "Developer",
      icon: <Code className="h-5 w-5" />,
      path: "/dashboard/developer",
      subItems: [],
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
      subItems: [],
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
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {navigationItems
            .filter(
              (item) =>
                !item.isStoryboard || import.meta.env.VITE_TEMPO === "true",
            )
            .map((item) => {
              const isActive =
                activeItem === item.name ||
                location.pathname.startsWith(item.path);
              const isExpanded = expandedItems.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

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
                      if (onModuleSelect) {
                        onModuleSelect(item.name);
                      } else {
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
                    {!collapsed && hasSubItems && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(item.name);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    )}
                  </a>

                  {!collapsed && isExpanded && hasSubItems && (
                    <ul className="mt-2 space-y-1 pl-8 border-l-2 border-primary-100 dark:border-primary-800">
                      {item.subItems.map((subItem) =>
                        subItem.isSeparator ? (
                          <li
                            key={subItem.name}
                            className="text-xs font-medium text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-800"
                          >
                            {subItem.name}
                          </li>
                        ) : (
                          <li key={subItem.name}>
                            <a
                              href="#"
                              className={cn(
                                "flex items-center py-1.5 px-3 text-sm rounded-md transition-colors",
                                location.pathname === subItem.path
                                  ? "text-primary font-medium bg-primary-50/50 dark:bg-primary-900/10"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(subItem.path);
                              }}
                            >
                              {subItem.icon ? (
                                <div className="mr-2 text-primary-600 dark:text-primary-400">
                                  {subItem.icon}
                                </div>
                              ) : (
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-200 dark:bg-primary-700 mr-2"></div>
                              )}
                              <span>{subItem.name}</span>
                            </a>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
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
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarNavigation;

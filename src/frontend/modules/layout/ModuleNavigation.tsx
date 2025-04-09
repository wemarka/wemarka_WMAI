import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/frontend/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface ModuleNavigationProps {
  currentModule?: string;
  isRTL?: boolean;
  onBackToDashboard?: () => void;
  children?: React.ReactNode;
  items?: NavigationItem[];
}

const ModuleNavigation = ({
  currentModule,
  isRTL = false,
  onBackToDashboard,
  children,
  items,
}: ModuleNavigationProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 h-full flex flex-col">
      <div className="h-16 border-b flex items-center justify-between px-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20">
        <h3 className="font-semibold text-primary">{currentModule}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-full"
          onClick={handleBackClick}
        >
          {isRTL ? (
            <div className="flex items-center">
              <span className="mr-1 text-xs">
                {isRTL ? "الرئيسية" : "Dashboard"}
              </span>
              <ChevronRight className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center">
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1 text-xs">Dashboard</span>
            </div>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {items ? (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href || "#"}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.href) {
                      navigate(item.href);
                    }
                  }}
                  className={cn(
                    "flex items-center p-2 rounded-lg group transition-all",
                    item.isActive
                      ? "bg-primary-50 text-primary font-medium dark:bg-primary-900/20 dark:text-primary-300"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                >
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {item.icon}
                  </div>
                  <span className={isRTL ? "mr-3" : "ml-3"}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ModuleNavigation;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface ContextualHelpButtonProps {
  currentModule?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
  variant?: "icon" | "text" | "minimal";
  size?: "sm" | "md" | "lg";
}

const ContextualHelpButton: React.FC<ContextualHelpButtonProps> = ({
  currentModule = "Dashboard",
  position = "top-right",
  className = "",
  variant = "icon",
  size = "md",
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Adjust position based on RTL setting
  const effectivePosition = isRTL
    ? position === "top-right"
      ? "top-left"
      : position === "top-left"
        ? "top-right"
        : position === "bottom-right"
          ? "bottom-left"
          : "bottom-right"
    : position;

  // Get contextual help links based on current module
  const getContextualLinks = () => {
    const moduleMap: Record<string, { title: string; path: string }[]> = {
      Dashboard: [
        {
          title: isRTL ? "نظرة عامة على لوحة القيادة" : "Dashboard Overview",
          path: "/dashboard/help-center?tab=docs&docId=doc-1",
        },
        {
          title: isRTL ? "استخدام الأدوات" : "Using Widgets",
          path: "/dashboard/help-center?tab=faqs&search=widgets",
        },
      ],
      Store: [
        {
          title: isRTL ? "إدارة المنتجات" : "Managing Products",
          path: "/dashboard/help-center?tab=docs&docId=doc-3",
        },
        {
          title: isRTL ? "إدارة المخزون" : "Inventory Management",
          path: "/dashboard/help-center?tab=faqs&search=inventory",
        },
      ],
      Marketing: [
        {
          title: isRTL ? "إنشاء حملة تسويقية" : "Creating a Marketing Campaign",
          path: "/dashboard/help-center?tab=docs&docId=doc-4",
        },
        {
          title: isRTL ? "تحليلات التسويق" : "Marketing Analytics",
          path: "/dashboard/help-center?tab=faqs&search=marketing",
        },
      ],
      Accounting: [
        {
          title: isRTL ? "إنشاء فاتورة" : "Creating an Invoice",
          path: "/dashboard/help-center?tab=faqs&search=invoice",
        },
        {
          title: isRTL ? "التقارير المالية" : "Financial Reports",
          path: "/dashboard/help-center?tab=faqs&search=financial",
        },
      ],
      "Customer Service": [
        {
          title: isRTL
            ? "إدارة صندوق الوارد الموحد"
            : "Managing the Unified Inbox",
          path: "/dashboard/help-center?tab=docs&docId=doc-6",
        },
        {
          title: isRTL
            ? "الرد على رسائل العملاء"
            : "Responding to Customer Messages",
          path: "/dashboard/help-center?tab=faqs&search=customer",
        },
      ],
    };

    return (
      moduleMap[currentModule] || [
        {
          title: isRTL ? "مركز المساعدة" : "Help Center",
          path: "/dashboard/help-center",
        },
      ]
    );
  };

  const contextualLinks = getContextualLinks();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsPopoverOpen(false);
  };

  const handleOpenHelpCenter = () => {
    navigate("/dashboard/help-center");
    setIsPopoverOpen(false);
  };

  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "md":
      default:
        return "h-10 w-10";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-6 w-6";
      case "md":
      default:
        return "h-5 w-5";
    }
  };

  if (variant === "minimal") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`text-muted-foreground hover:text-foreground ${className}`}
              onClick={handleOpenHelpCenter}
            >
              <HelpCircle className={getIconSize()} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isRTL ? "مركز المساعدة" : "Help Center"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "text") {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 ${className}`}
        onClick={handleOpenHelpCenter}
      >
        <HelpCircle className="h-4 w-4" />
        {isRTL ? "المساعدة" : "Help"}
      </Button>
    );
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className={`fixed ${effectivePosition.replace("-", " ")} z-40 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105 ${getButtonSize()} ${className}`}
          size="icon"
        >
          <HelpCircle className={getIconSize()} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align={effectivePosition.includes("right") ? "end" : "start"}
        side={effectivePosition.includes("top") ? "bottom" : "top"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">
              {isRTL ? "مساعدة حول" : "Help with"} {currentModule}
            </h4>
            <div className="grid gap-2">
              {contextualLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-2"
                  onClick={() => handleNavigate(link.path)}
                >
                  {link.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <Button className="w-full" onClick={handleOpenHelpCenter}>
              {isRTL ? "فتح مركز المساعدة" : "Open Help Center"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ContextualHelpButton;

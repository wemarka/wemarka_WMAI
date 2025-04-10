import React, { useState } from "react";
import Breadcrumb, {
  BreadcrumbItem,
} from "@/frontend/components/navigation/Breadcrumb";
import PageTransitionWrapper, { TransitionType } from "./PageTransitionWrapper";
import { AIContextPanel } from "@/frontend/modules/ai";
import { Button } from "@/frontend/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/frontend/lib/utils";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface ModuleLayoutProps {
  children: React.ReactNode;
  moduleName: string;
  currentView?: string;
  breadcrumbItems?: BreadcrumbItem[];
  transitionType?: TransitionType;
  transitionDuration?: number;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  children,
  moduleName,
  currentView,
  breadcrumbItems,
  transitionType = "fade",
  transitionDuration = 0.3,
}) => {
  const [isAIContextPanelVisible, setIsAIContextPanelVisible] = useState(false);
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // If custom breadcrumb items are provided, use those
  // Otherwise, create default breadcrumb items based on module name and current view
  const items = breadcrumbItems || [
    {
      label: moduleName,
      path: `/dashboard/${moduleName.toLowerCase().replace(/ /g, "-")}`,
    },
    ...(currentView
      ? [
          {
            label: currentView,
            path: `/dashboard/${moduleName.toLowerCase().replace(/ /g, "-")}/${currentView
              .toLowerCase()
              .replace(/ /g, "-")}`,
          },
        ]
      : []),
  ];

  // Create a unique key for the transition based on the module name and current view
  const transitionKey = `${moduleName}${currentView ? `-${currentView}` : ""}`;

  const toggleAIContextPanel = () => {
    setIsAIContextPanelVisible(!isAIContextPanelVisible);
  };

  return (
    <div className="p-6 relative">
      <Breadcrumb items={items} />
      <PageTransitionWrapper
        transitionKey={transitionKey}
        type={transitionType}
        duration={transitionDuration}
      >
        <div className="flex">
          <div className={cn("flex-1", isAIContextPanelVisible ? "mr-80" : "")}>
            {children}
          </div>

          {isAIContextPanelVisible && (
            <div
              className={cn("absolute top-16", isRTL ? "left-6" : "right-6")}
            >
              <AIContextPanel
                moduleName={moduleName}
                onClose={toggleAIContextPanel}
              />
            </div>
          )}
        </div>
      </PageTransitionWrapper>

      {/* AI Context Panel Toggle Button */}
      <Button
        className={cn(
          "fixed z-10 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105",
          isRTL ? "left-24" : "right-24",
          "bottom-4",
        )}
        size="icon"
        onClick={toggleAIContextPanel}
      >
        {isAIContextPanelVisible ? (
          <X className="h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default ModuleLayout;

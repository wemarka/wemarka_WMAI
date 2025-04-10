import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import FeedbackModal from "./FeedbackModal";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";

interface FeedbackButtonProps {
  currentModule?: string;
  position?: "bottom-left" | "bottom-right";
  className?: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  currentModule,
  position = "bottom-left",
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Adjust position based on RTL setting
  const effectivePosition = isRTL
    ? position === "bottom-left"
      ? "bottom-right"
      : "bottom-left"
    : position;

  const positionClasses = {
    "bottom-left": "left-4 bottom-20",
    "bottom-right": "right-4 bottom-20",
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "fixed z-40 rounded-full h-12 w-12 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-200 hover:scale-105",
                positionClasses[effectivePosition],
                className,
              )}
              onClick={() => setIsModalOpen(true)}
              size="icon"
              variant="secondary"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isRTL ? "تقديم ملاحظات" : "Provide Feedback"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentModule={currentModule}
      />
    </>
  );
};

export default FeedbackButton;

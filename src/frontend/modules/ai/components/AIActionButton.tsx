import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";

interface AIActionButtonProps {
  onClick: () => void;
  label?: string;
  tooltipText?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const AIActionButton: React.FC<AIActionButtonProps> = ({
  onClick,
  label = "",
  tooltipText = "AI Assistant",
  variant = "primary",
  size = "sm",
}) => {
  const getVariant = () => {
    switch (variant) {
      case "primary":
        return "gradient";
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      case "ghost":
        return "ghost";
      default:
        return "gradient";
    }
  };

  const getSize = () => {
    switch (size) {
      case "sm":
        return "sm";
      case "md":
        return "default";
      case "lg":
        return "lg";
      case "icon":
        return "icon";
      default:
        return "sm";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getVariant()}
            size={getSize()}
            onClick={onClick}
            className="group"
          >
            <Sparkles className="h-4 w-4 mr-1.5 group-hover:animate-pulse" />
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIActionButton;

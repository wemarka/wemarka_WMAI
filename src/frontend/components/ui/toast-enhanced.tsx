import { useToast } from "./use-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import React from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface EnhancedToastOptions {
  title: string;
  description?: string;
  duration?: number;
  onAction?: () => void;
  actionLabel?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  animated?: boolean;
}

// Define the return type for the hook to help with HMR compatibility
export interface EnhancedToastHook {
  success: (options: EnhancedToastOptions) => void;
  error: (options: EnhancedToastOptions) => void;
  info: (options: EnhancedToastOptions) => void;
  warning: (options: EnhancedToastOptions) => void;
}

/**
 * Enhanced toast hook that provides styled toast notifications with icons
 * @returns Object with methods for different toast types (success, error, info, warning)
 */
export const useEnhancedToast = (): EnhancedToastHook => {
  const { toast } = useToast();

  const showToast = (type: ToastType, options: EnhancedToastOptions) => {
    const {
      title,
      description,
      duration,
      onAction,
      actionLabel,
      animated = true,
    } = options;

    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    };

    const variants = {
      success: "default",
      error: "destructive",
      info: "default",
      warning: "default",
    };

    const titleContent = (
      <div className="flex items-center gap-2">
        {icons[type]}
        <span>{title}</span>
      </div>
    ) as unknown as string;

    const descriptionContent = description
      ? onAction && actionLabel
        ? ((
            <div className="flex flex-col space-y-2">
              <div>{description}</div>
              <button
                onClick={onAction}
                className="self-end px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {actionLabel}
              </button>
            </div>
          ) as unknown as string)
        : description
      : undefined;

    // Add metadata for the enhanced animated toaster
    const metadata: Record<string, any> = {
      type,
      actionLabel,
      onAction,
    };

    toast({
      title: titleContent,
      description: descriptionContent,
      variant: variants[type] as "default" | "destructive",
      duration: duration,
      ...metadata,
    });
  };

  return {
    success: (options: EnhancedToastOptions) => showToast("success", options),
    error: (options: EnhancedToastOptions) => showToast("error", options),
    info: (options: EnhancedToastOptions) => showToast("info", options),
    warning: (options: EnhancedToastOptions) => showToast("warning", options),
  };
};

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast, Toast } from "./use-toast";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface AnimatedEnhancedToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

/**
 * AnimatedEnhancedToaster component that adds animations to enhanced toast notifications
 * with icons and improved styling using Framer Motion
 */
export function AnimatedEnhancedToaster({
  position = "bottom-right",
  className = "",
}: AnimatedEnhancedToasterProps) {
  const { toasts, dismiss } = useToast();
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Determine position classes
  const positionClasses = {
    "top-right": "fixed top-0 right-0 p-4 space-y-3 z-50",
    "top-left": "fixed top-0 left-0 p-4 space-y-3 z-50",
    "bottom-right": "fixed bottom-0 right-0 p-4 space-y-3 z-50",
    "bottom-left": "fixed bottom-0 left-0 p-4 space-y-3 z-50",
  };

  // Adjust position for RTL if needed
  const effectivePosition = isRTL
    ? position === "top-right"
      ? "top-left"
      : position === "top-left"
        ? "top-right"
        : position === "bottom-right"
          ? "bottom-left"
          : "bottom-right"
    : position;

  // Custom animation variants based on position
  const getAnimationVariants = (pos: string) => {
    const isTop = pos.includes("top");
    const isRight = pos.includes("right");

    // Adjust for RTL
    const xDirection = isRTL ? (isRight ? -1 : 1) : isRight ? 1 : -1;

    return {
      initial: {
        opacity: 0,
        y: isTop ? -20 : 20,
        x: xDirection * 10,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1], // Custom ease curve
        },
      },
      exit: {
        opacity: 0,
        y: isTop ? -10 : 10,
        x: xDirection * 5,
        scale: 0.9,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      },
    };
  };

  // Get icon based on toast metadata
  const getToastIcon = (toast: Toast) => {
    // Check if toast has metadata for type
    const type = (toast as any).type;

    if (type === "success")
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (type === "error")
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (type === "info") return <Info className="h-5 w-5 text-blue-500" />;
    if (type === "warning")
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;

    // Default icon based on variant
    return toast.variant === "destructive" ? (
      <AlertCircle className="h-5 w-5 text-red-500" />
    ) : (
      <Info className="h-5 w-5 text-blue-500" />
    );
  };

  return (
    <div
      className={`${positionClasses[effectivePosition]} ${className}`}
      dir={direction}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => {
          const icon = getToastIcon(toast);
          const hasAction =
            (toast as any).actionLabel && (toast as any).onAction;

          return (
            <motion.div
              key={toast.id}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={getAnimationVariants(effectivePosition)}
              className={`p-4 rounded-md shadow-lg backdrop-blur-sm ${toast.variant === "destructive" ? "bg-destructive/95 text-destructive-foreground" : "bg-background/95 border"}`}
              style={{
                maxWidth: "380px",
                willChange: "transform, opacity",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{toast.title}</div>
                  {toast.description && (
                    <div className="text-sm opacity-90 mb-2">
                      {toast.description}
                    </div>
                  )}
                  {hasAction && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          (toast as any).onAction();
                          dismiss(toast.id);
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        {(toast as any).actionLabel}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

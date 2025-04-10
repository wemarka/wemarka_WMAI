import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast, Toast } from "./use-toast";
import { fadeInVariants } from "@/frontend/lib/animation";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface AnimatedToastProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

/**
 * AnimatedToast component that adds animations to toast notifications
 * using Framer Motion for smooth enter/exit transitions
 */
export function AnimatedToaster({
  position = "bottom-right",
  className = "",
}: AnimatedToastProps) {
  const { toasts, dismiss } = useToast();
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Determine position classes
  const positionClasses = {
    "top-right": "fixed top-0 right-0 p-4 space-y-2 z-50",
    "top-left": "fixed top-0 left-0 p-4 space-y-2 z-50",
    "bottom-right": "fixed bottom-0 right-0 p-4 space-y-2 z-50",
    "bottom-left": "fixed bottom-0 left-0 p-4 space-y-2 z-50",
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

  return (
    <div
      className={`${positionClasses[effectivePosition]} ${className}`}
      dir={direction}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={getAnimationVariants(effectivePosition)}
            className={`p-4 rounded-md shadow-md ${toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"}`}
            onClick={() => dismiss(toast.id)}
          >
            <div className="font-medium">{toast.title}</div>
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

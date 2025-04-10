import React from "react";
import { ToastProvider as BaseToastProvider } from "./use-toast";
import { EnhancedToastProvider } from "./enhanced-toast-provider";
import { AnimatedToaster, EnhancedAnimatedToasterComponent } from "./toast";

interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  enhanced?: boolean;
}

/**
 * Unified Toast Provider that combines all toast functionality
 * Provides both basic and enhanced toast capabilities with animations
 */
export function UnifiedToastProvider({
  children,
  position = "bottom-right",
  enhanced = true,
}: ToastProviderProps) {
  return (
    <EnhancedToastProvider>
      <BaseToastProvider>
        {children}
        {enhanced ? (
          <EnhancedAnimatedToasterComponent position={position} />
        ) : (
          <AnimatedToaster position={position} />
        )}
      </BaseToastProvider>
    </EnhancedToastProvider>
  );
}

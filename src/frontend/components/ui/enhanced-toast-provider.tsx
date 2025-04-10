import React from "react";
import { ToastProvider } from "./use-toast";
import { useEnhancedToast } from "./toast-enhanced";

/**
 * Enhanced Toast Provider Context
 * Provides a global context for the enhanced toast functionality
 * with icons and better styling
 */
export const EnhancedToastContext = React.createContext<
  ReturnType<typeof useEnhancedToast> | undefined
>(undefined);

export function EnhancedToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the enhanced toast instance
  const enhancedToast = useEnhancedToast();

  return (
    <EnhancedToastContext.Provider value={enhancedToast}>
      <ToastProvider>{children}</ToastProvider>
    </EnhancedToastContext.Provider>
  );
}

/**
 * Hook to use the enhanced toast functionality
 * Provides success, error, info, and warning toast variants with icons
 */
export function useGlobalEnhancedToast() {
  const context = React.useContext(EnhancedToastContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalEnhancedToast must be used within an EnhancedToastProvider",
    );
  }
  return context;
}

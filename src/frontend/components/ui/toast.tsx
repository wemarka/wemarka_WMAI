import { useToast } from "./use-toast";

// Re-export the ToastProvider from use-toast.tsx
export { ToastProvider } from "./use-toast";

// Re-export the animated toaster components
export { AnimatedToaster } from "./animated-toast";
export { AnimatedEnhancedToaster } from "./animated-toast-enhanced";

// Export AnimatedEnhancedToaster as EnhancedAnimatedToasterComponent for compatibility
export { AnimatedEnhancedToaster as EnhancedAnimatedToasterComponent } from "./animated-toast-enhanced";

/**
 * Basic Toaster component without animations
 * Kept for backward compatibility
 */
export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md transition-all transform translate-y-0 opacity-100 ${toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"}`}
          onClick={() => dismiss(toast.id)}
        >
          <div className="font-medium">{toast.title}</div>
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

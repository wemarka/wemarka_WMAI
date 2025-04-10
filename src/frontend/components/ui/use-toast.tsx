import { createContext, useContext, useState } from "react";

export type ToastVariant = "default" | "destructive";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastContextType = {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider component that manages toast notifications
 * @param children React children
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 3000,
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant, duration };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after specified duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast functionality
 * @returns Toast context with toast methods
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

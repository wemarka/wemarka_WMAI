import { useState, createContext, useContext } from "react";
import React from "react";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastState = {
  toasts: Toast[];
};

type ToastContextType = ReturnType<typeof useToastProvider>;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function useToastProvider() {
  const [state, setState] = useState<ToastState>({
    toasts: [],
  });

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setState((prev) => ({
      ...prev,
      toasts: [...prev.toasts, { id, ...props }],
    }));
    return id;
  };

  const dismiss = (id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((toast) => toast.id !== id),
    }));
  };

  const dismissAll = () => {
    setState((prev) => ({
      ...prev,
      toasts: [],
    }));
  };

  return {
    ...state,
    toast,
    dismiss,
    dismissAll,
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const context = useToastProvider();

  return (
    <ToastContext.Provider value={context}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

// Create a standalone toast function that can be imported directly
export const toast = (props: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substring(2, 9);
  // This is a simplified version that doesn't update state
  // It's meant for direct imports outside of React components
  console.log(`Toast created: ${props.title}`);
  return id;
};

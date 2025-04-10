import { useToast } from "./use-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface EnhancedToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export function useEnhancedToast() {
  const { toast } = useToast();

  const showToast = (type: ToastType, options: EnhancedToastOptions) => {
    const { title, description, duration } = options;

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

    toast({
      title: (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span>{title}</span>
        </div>
      ) as unknown as string,
      description,
      variant: variants[type] as "default" | "destructive",
    });
  };

  return {
    success: (options: EnhancedToastOptions) => showToast("success", options),
    error: (options: EnhancedToastOptions) => showToast("error", options),
    info: (options: EnhancedToastOptions) => showToast("info", options),
    warning: (options: EnhancedToastOptions) => showToast("warning", options),
  };
}

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";

type AutoSaveOptions = {
  key: string;
  initialData?: any;
  debounceTime?: number;
  onSave?: (data: any) => Promise<void> | void;
  saveToLocalStorage?: boolean;
  showToast?: boolean;
  toastMessages?: {
    success?: string;
    error?: string;
  };
};

/**
 * Hook for auto-saving form data with debounce
 * @param options Configuration options for auto-save
 * @returns Object with data, setData, isSaving, and lastSaved
 */
export function useAutoSave<T>({
  key,
  initialData = {},
  debounceTime = 1000,
  onSave,
  saveToLocalStorage = true,
  showToast = true,
  toastMessages = {
    success: "Changes saved automatically",
    error: "Failed to save changes",
  },
}: AutoSaveOptions) {
  const { toast } = useToast();
  const [data, setData] = useState<T>(() => {
    // Try to load from localStorage first
    if (typeof window !== "undefined" && saveToLocalStorage) {
      const saved = localStorage.getItem(`autosave:${key}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing saved data:", e);
        }
      }
    }
    return initialData as T;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);

  // Save data with debounce
  useEffect(() => {
    // Skip the initial render
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    previousDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        // Save to localStorage if enabled
        if (saveToLocalStorage) {
          localStorage.setItem(`autosave:${key}`, JSON.stringify(data));
        }

        // Call custom save function if provided
        if (onSave) {
          await onSave(data);
        }

        setLastSaved(new Date());

        // Show success toast if enabled
        if (showToast) {
          toast({
            title: toastMessages.success,
            description: `Last saved at ${new Date().toLocaleTimeString()}`,
          });
        }
      } catch (error) {
        console.error("Error saving data:", error);

        // Show error toast if enabled
        if (showToast) {
          toast({
            title: toastMessages.error,
            description:
              error instanceof Error ? error.message : "Unknown error",
            variant: "destructive",
          });
        }
      } finally {
        setIsSaving(false);
      }
    }, debounceTime);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    data,
    key,
    debounceTime,
    onSave,
    saveToLocalStorage,
    showToast,
    toast,
    toastMessages,
  ]);

  // Clear saved data
  const clearSavedData = () => {
    if (saveToLocalStorage) {
      localStorage.removeItem(`autosave:${key}`);
    }
    setData(initialData as T);
    setLastSaved(null);
  };

  return { data, setData, isSaving, lastSaved, clearSavedData };
}

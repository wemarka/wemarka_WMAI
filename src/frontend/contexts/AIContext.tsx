import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { userAnalyticsTracker } from "@/frontend/services/userAnalyticsTracker";

interface AIContextType {
  isAIAssistantOpen: boolean;
  currentPrompt: string | null;
  currentModule: string;
  openAIAssistant: (prompt?: string) => void;
  closeAIAssistant: () => void;
  toggleAIAssistant: () => void;
  promptAIAssistant: (prompt: string) => void;
  setCurrentModule: (module: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
  initialModule?: string;
}

export const AIProvider: React.FC<AIProviderProps> = ({
  children,
  initialModule = "Dashboard",
}) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState(initialModule);

  // Initialize analytics tracking
  useEffect(() => {
    userAnalyticsTracker.init();
    return () => {
      userAnalyticsTracker.endSession();
    };
  }, []);

  // Track module changes for analytics
  useEffect(() => {
    userAnalyticsTracker.trackModuleEnter(currentModule);
    return () => {
      userAnalyticsTracker.trackModuleExit();
    };
  }, [currentModule]);

  const openAIAssistant = useCallback((prompt?: string) => {
    setIsAIAssistantOpen(true);
    if (prompt) setCurrentPrompt(prompt);
    // Track AI Assistant usage
    userAnalyticsTracker.trackFeatureUsage("AI", "Open Assistant");
  }, []);

  const closeAIAssistant = useCallback(() => {
    setIsAIAssistantOpen(false);
    setCurrentPrompt(null);
  }, []);

  const toggleAIAssistant = useCallback(() => {
    setIsAIAssistantOpen((prev) => !prev);
    if (!isAIAssistantOpen) {
      setCurrentPrompt(null);
      // Track AI Assistant usage
      userAnalyticsTracker.trackFeatureUsage("AI", "Toggle Assistant");
    }
  }, [isAIAssistantOpen]);

  const promptAIAssistant = useCallback((prompt: string) => {
    setCurrentPrompt(prompt);
    setIsAIAssistantOpen(true);
    // Track AI Assistant usage with prompt
    userAnalyticsTracker.trackFeatureUsage("AI", "Prompt Assistant");
  }, []);

  const value = {
    isAIAssistantOpen,
    currentPrompt,
    currentModule,
    openAIAssistant,
    closeAIAssistant,
    toggleAIAssistant,
    promptAIAssistant,
    setCurrentModule,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

import { useState, useCallback } from "react";

interface UseAIAssistantProps {
  module?: string;
}

interface AIAssistantState {
  isOpen: boolean;
  currentPrompt: string | null;
  currentModule: string;
}

export function useAIAssistant({
  module = "Dashboard",
}: UseAIAssistantProps = {}) {
  const [state, setState] = useState<AIAssistantState>({
    isOpen: false,
    currentPrompt: null,
    currentModule: module,
  });

  const openAssistant = useCallback((prompt?: string) => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      currentPrompt: prompt || null,
    }));
  }, []);

  const closeAssistant = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      currentPrompt: null,
    }));
  }, []);

  const setModule = useCallback((newModule: string) => {
    setState((prev) => ({
      ...prev,
      currentModule: newModule,
    }));
  }, []);

  const toggleAssistant = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      currentPrompt: null,
    }));
  }, []);

  const promptAssistant = useCallback((prompt: string) => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      currentPrompt: prompt,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    currentPrompt: state.currentPrompt,
    currentModule: state.currentModule,
    openAssistant,
    closeAssistant,
    toggleAssistant,
    promptAssistant,
    setModule,
  };
}

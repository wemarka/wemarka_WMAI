import { useState, useCallback } from "react";
import { useAI } from "@/frontend/contexts/AIContext";

export const useAIContextPanel = (moduleName: string) => {
  const [isVisible, setIsVisible] = useState(false);
  const { promptAIAssistant, toggleAIAssistant } = useAI();

  const togglePanel = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setIsVisible(false);
  }, []);

  const openPanel = useCallback(() => {
    setIsVisible(true);
  }, []);

  const generateSummary = useCallback(() => {
    const prompt = `Generate a comprehensive summary of my ${moduleName} data`;
    promptAIAssistant(prompt);
    toggleAIAssistant(true);
  }, [moduleName, promptAIAssistant, toggleAIAssistant]);

  const getInsights = useCallback(() => {
    const prompt = `Analyze my ${moduleName} data and provide key insights`;
    promptAIAssistant(prompt);
    toggleAIAssistant(true);
  }, [moduleName, promptAIAssistant, toggleAIAssistant]);

  const autoSuggest = useCallback(() => {
    const prompt = `Based on my ${moduleName} data, what actions should I take next?`;
    promptAIAssistant(prompt);
    toggleAIAssistant(true);
  }, [moduleName, promptAIAssistant, toggleAIAssistant]);

  return {
    isVisible,
    togglePanel,
    closePanel,
    openPanel,
    generateSummary,
    getInsights,
    autoSuggest,
  };
};

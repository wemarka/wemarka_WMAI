import React, { useState } from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/frontend/components/ui/tabs";
import { MessageSquare, Clock, Settings } from "lucide-react";
import AIAssistantPanel from "@/frontend/modules/ai/AIAssistantPanel";
import AIAssistantHistory from "@/frontend/modules/ai/components/AIAssistantHistory";
import AIAssistantSettings from "@/frontend/modules/ai/components/AIAssistantSettings";

interface AIAssistantTabsProps {
  onClose: () => void;
  currentSystem?: string;
  initialPrompt?: string;
}

const AIAssistantTabs: React.FC<AIAssistantTabsProps> = ({
  onClose,
  currentSystem = "Dashboard",
  initialPrompt,
}) => {
  const { direction, language } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeTab, setActiveTab] = useState("chat");

  const handleSelectConversation = (id: string) => {
    // In a real app, this would load the conversation with the given ID
    console.log(`Loading conversation with ID: ${id}`);
    setActiveTab("chat");
  };

  const handleClearHistory = () => {
    // In a real app, this would clear the conversation history
    console.log("Clearing conversation history");
  };

  const handleExportHistory = () => {
    // In a real app, this would export the conversation history
    console.log("Exporting conversation history");
  };

  const handleSaveSettings = (settings: any) => {
    // In a real app, this would save the settings
    console.log("Saving settings:", settings);
  };

  const handleResetSettings = () => {
    // In a real app, this would reset the settings to defaults
    console.log("Resetting settings to defaults");
  };

  return (
    <div
      className="w-[400px] h-[600px] bg-card rounded-lg shadow-elevated border flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        fontFamily: isRTL ? "'Tajawal', sans-serif" : "inherit",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <Tabs
        defaultValue="chat"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <div className="border-b px-2 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              {isRTL ? "المحادثة" : "Chat"}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {isRTL ? "السجل" : "History"}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              {isRTL ? "الإعدادات" : "Settings"}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0">
          <AIAssistantPanel
            onClose={onClose}
            currentSystem={currentSystem}
            initialPrompt={initialPrompt}
          />
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-hidden m-0 p-0">
          <AIAssistantHistory
            onSelectConversation={handleSelectConversation}
            onClearHistory={handleClearHistory}
            onExportHistory={handleExportHistory}
          />
        </TabsContent>

        <TabsContent
          value="settings"
          className="flex-1 overflow-hidden m-0 p-0"
        >
          <AIAssistantSettings
            onSaveSettings={handleSaveSettings}
            onResetSettings={handleResetSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistantTabs;

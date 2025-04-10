import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Input } from "@/frontend/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import FAQs from "./FAQs";
import GettingStarted from "./GettingStarted";
import APIReference from "./APIReference";
import { useAI } from "@/frontend/contexts/AIContext";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";

interface DocumentationCenterDashboardProps {
  isRTL?: boolean;
}

const DocumentationCenterDashboard: React.FC<
  DocumentationCenterDashboardProps
> = ({ isRTL = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { promptAIAssistant } = useAI();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAskAI = () => {
    if (searchQuery.trim()) {
      promptAIAssistant(`Documentation question: ${searchQuery}`);
    }
  };

  return (
    <ModuleLayout
      moduleName="Documentation"
      breadcrumbItems={[
        {
          label: "Documentation",
          path: "/dashboard/documentation",
          icon: <BookOpen className="h-3.5 w-3.5" />,
        },
      ]}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documentation Center</h1>
          <p className="text-muted-foreground">
            Find guides, tutorials, and reference materials for Wemarka WMAI
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <button
            onClick={handleAskAI}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Ask AI
          </button>
        </div>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="api-reference">API Reference</TabsTrigger>
          </TabsList>
          <TabsContent value="getting-started">
            <GettingStarted searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="faqs">
            <FAQs searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="api-reference">
            <APIReference searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
};

export default DocumentationCenterDashboard;

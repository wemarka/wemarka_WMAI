import React, { useState } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Database,
  Github,
  FileText,
  History,
  Settings,
  Code,
  Globe,
  Languages,
  Search,
  Server,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import MigrationRunner from "./MigrationRunner";
import GitHubMigrationImporter from "./GitHubMigrationImporter";
import GitHubMigrationLogs from "./GitHubMigrationLogs";
import DiagnosticPanel from "./DiagnosticPanel";
import { Input } from "@/frontend/components/ui/input";

const MigrationDashboard: React.FC = () => {
  const { toast } = useToast();
  const { direction, language } = useLanguage();
  const rtl = direction === "rtl";
  const [activeTab, setActiveTab] = useState<string>("runner");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Translations
  const translations = {
    title: rtl ? "لوحة تحكم الترحيل" : "Migration Dashboard",
    description: rtl
      ? "أداة شاملة لإدارة ترحيلات قاعدة البيانات"
      : "Comprehensive tool for managing database migrations",
    runner: rtl ? "منفذ SQL" : "SQL Runner",
    github: rtl ? "مستورد GitHub" : "GitHub Importer",
    logs: rtl ? "سجلات الترحيل" : "Migration Logs",
    diagnostics: rtl ? "التشخيص" : "Diagnostics",
    settings: rtl ? "الإعدادات" : "Settings",
    search: rtl ? "بحث..." : "Search...",
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Database className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="text-2xl">{translations.title}</CardTitle>
          </div>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={translations.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs
            defaultValue="runner"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 lg:grid-cols-4 mb-8">
              <TabsTrigger value="runner" className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                {translations.runner}
              </TabsTrigger>
              <TabsTrigger value="github" className="flex items-center">
                <Github className="h-4 w-4 mr-2" />
                {translations.github}
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                {translations.logs}
              </TabsTrigger>
              <TabsTrigger value="diagnostics" className="flex items-center">
                <Server className="h-4 w-4 mr-2" />
                {translations.diagnostics}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="runner" className="mt-0">
              <MigrationRunner />
            </TabsContent>

            <TabsContent value="github" className="mt-0">
              <GitHubMigrationImporter />
            </TabsContent>

            <TabsContent value="logs" className="mt-0">
              <GitHubMigrationLogs searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="diagnostics" className="mt-0">
              <DiagnosticPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationDashboard;

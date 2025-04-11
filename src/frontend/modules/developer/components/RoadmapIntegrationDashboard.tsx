import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIActionButton } from "@/frontend/modules/ai";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { useToast } from "@/frontend/components/ui/use-toast";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";
import {
  Search,
  GitBranch,
  GitMerge,
  Link,
  Link2Off,
  Plus,
  Loader2,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
} from "lucide-react";
import { roadmapHistoryService } from "@/frontend/services/roadmapHistoryService";
import { roadmapAnalyticsService } from "@/frontend/services/roadmapAnalyticsService";
import { moduleIntegrationService } from "@/frontend/services/moduleIntegrationService";

interface RoadmapIntegrationDashboardProps {
  isRTL?: boolean;
}

const RoadmapIntegrationDashboard: React.FC<
  RoadmapIntegrationDashboardProps
> = ({ isRTL = false }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { promptAIAssistant } = useAI();

  const [activeTab, setActiveTab] = useState("roadmaps");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Load roadmaps and integrations
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load roadmaps
        const roadmapsData = await roadmapHistoryService.getSavedRoadmaps();
        setRoadmaps(roadmapsData);

        // Load integrations
        const integrationsResponse =
          await moduleIntegrationService.getAllIntegrations();
        if (!integrationsResponse.error) {
          setIntegrations(integrationsResponse.data);
        }

        // Load statistics
        const statsResponse =
          await moduleIntegrationService.getIntegrationStatistics();
        if (!statsResponse.error) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load roadmaps and integrations"),
          variant: "destructive",
        });

        // Fallback to mock data
        setRoadmaps([
          {
            id: "1",
            name: "Q3 Development Roadmap",
            description: "Development plan for Q3 2023",
            createdAt: "2023-06-15T10:00:00Z",
            status: "active",
          },
          {
            id: "2",
            name: "Marketing Module Roadmap",
            description: "Feature roadmap for the Marketing module",
            createdAt: "2023-07-01T14:30:00Z",
            status: "active",
          },
        ]);

        setIntegrations([
          {
            id: "1",
            sourceModuleName: "Developer",
            targetModuleName: "Dashboard",
            integrationType: "navigation",
            status: "active",
          },
          {
            id: "2",
            sourceModuleName: "Store",
            targetModuleName: "Accounting",
            integrationType: "data",
            status: "active",
          },
        ]);

        setStats({
          totalIntegrations: 2,
          activeIntegrations: 2,
          inactiveIntegrations: 0,
          pendingIntegrations: 0,
          integrationTypes: { navigation: 1, data: 1 },
          moduleConnections: {
            Developer: 1,
            Dashboard: 1,
            Store: 1,
            Accounting: 1,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [t, toast]);

  // Filter roadmaps based on search query
  const filteredRoadmaps = roadmaps.filter(
    (roadmap) =>
      roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter integrations based on search query
  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.sourceModuleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      integration.targetModuleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const getIntegrationTypeColor = (type: string) => {
    switch (type) {
      case "navigation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "data":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "workflow":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "notification":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg" dir="auto">
          {t("Loading roadmap integration dashboard...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t("Roadmap Integration Dashboard")}
          </h1>
          <p className="text-muted-foreground">
            {t("Visualize and manage connections between roadmaps and modules")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <AIActionButton
            onClick={() => {
              promptAIAssistant(
                "Analyze the current roadmap integrations and suggest improvements for better system connectivity and development planning.",
              );
            }}
            label={t("AI Analysis")}
            variant="outline"
            size="sm"
            tooltipText={t("Get AI recommendations for roadmap integrations")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("Search roadmaps and integrations...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Total Integrations")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.totalIntegrations}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Active Integrations")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.activeIntegrations}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <GitBranch className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Connected Modules")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {Object.keys(stats.moduleConnections).length}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <GitMerge className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Roadmaps")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{roadmaps.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="roadmaps">
            <FileText className="mr-2 h-4 w-4" />
            {t("Roadmaps")}
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link className="mr-2 h-4 w-4" />
            {t("Integrations")}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t("Analytics")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roadmaps" className="mt-6">
          {filteredRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoadmaps.map((roadmap) => (
                <Card
                  key={roadmap.id}
                  className="hover:shadow-sm transition-all"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{roadmap.name}</CardTitle>
                      <Badge variant="outline">
                        {new Date(roadmap.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {roadmap.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("Created")}:{" "}
                      {new Date(roadmap.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Badge
                        variant={
                          roadmap.status === "active" ? "default" : "outline"
                        }
                      >
                        {roadmap.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        {t("View Details")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <FallbackMessage
              title={t("No Roadmaps Found")}
              message={
                searchQuery
                  ? t("No roadmaps match your search criteria")
                  : t("No roadmaps have been created yet")
              }
              icon={
                <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
              }
              dir="auto"
            />
          )}
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card
                  key={integration.id}
                  className="hover:shadow-sm transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getIntegrationTypeColor(
                            integration.integrationType,
                          )}
                        >
                          {t(integration.integrationType)}
                        </Badge>
                        <Badge
                          variant={
                            integration.status === "active"
                              ? "default"
                              : integration.status === "inactive"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {t(integration.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-center my-4">
                      <div className="text-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="font-medium">
                          {integration.sourceModuleName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Source")}
                        </p>
                      </div>

                      <div className="mx-4 flex items-center">
                        {isRTL ? (
                          <ArrowLeft className="h-5 w-5 text-primary" />
                        ) : (
                          <ArrowRight className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      <div className="text-center px-4 py-2 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                        <p className="font-medium">
                          {integration.targetModuleName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Target")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <FallbackMessage
              title={t("No Integrations Found")}
              message={
                searchQuery
                  ? t("No integrations match your search criteria")
                  : t("No integrations have been created yet")
              }
              icon={
                <Link2Off className="h-12 w-12 text-muted-foreground opacity-50" />
              }
              dir="auto"
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Integration Analytics")}</CardTitle>
              <CardDescription>
                {t("Overview of module and roadmap integration statistics")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {t("Integration Types")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(stats.integrationTypes).map(
                        ([type, count]) => (
                          <Card key={type}>
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center">
                                <Badge
                                  className={getIntegrationTypeColor(type)}
                                >
                                  {t(type)}
                                </Badge>
                                <p className="text-2xl font-bold mt-2">
                                  {count}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {t("Module Connections")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(stats.moduleConnections)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 8)
                        .map(([module, count]) => (
                          <Card key={module}>
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center">
                                <p className="font-medium text-center">
                                  {module}
                                </p>
                                <p className="text-2xl font-bold mt-2">
                                  {count}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <FallbackMessage
                  title={t("No Analytics Data")}
                  message={t("Analytics data is not available yet")}
                  icon={
                    <BarChart3 className="h-12 w-12 text-muted-foreground opacity-50" />
                  }
                  dir="auto"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoadmapIntegrationDashboard;

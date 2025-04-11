import React, { useState, useEffect, useRef } from "react";
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
  Link,
  Link2Off,
  Plus,
  Loader2,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
  Network,
  GitBranch,
  GitMerge,
  Share2,
  Workflow,
  Bell,
} from "lucide-react";
import { moduleIntegrationService } from "@/frontend/services/moduleIntegrationService";

interface ModuleIntegrationVisualizationProps {
  isRTL?: boolean;
}

const ModuleIntegrationVisualization: React.FC<
  ModuleIntegrationVisualizationProps
> = ({ isRTL = false }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { promptAIAssistant } = useAI();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeView, setActiveView] = useState("force-directed");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");

  // Load integrations
  useEffect(() => {
    const loadIntegrations = async () => {
      setIsLoading(true);
      try {
        const response = await moduleIntegrationService.getAllIntegrations();

        if (response.error) {
          throw response.error;
        }

        setIntegrations(response.data);

        // Extract unique modules
        const uniqueModules = new Set<string>();
        response.data.forEach((integration) => {
          uniqueModules.add(integration.sourceModuleName);
          uniqueModules.add(integration.targetModuleName);
        });

        setModules(Array.from(uniqueModules));
      } catch (error) {
        console.error("Error loading integrations:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load module integrations"),
          variant: "destructive",
        });

        // Fallback to mock data for demonstration
        const mockData = [
          {
            id: "1",
            sourceModuleId: "dashboard",
            sourceModuleName: "Dashboard",
            targetModuleId: "analytics",
            targetModuleName: "Analytics",
            integrationType: "data",
            integrationDetails: { dataPoints: ["sales", "users", "revenue"] },
            status: "active",
          },
          {
            id: "2",
            sourceModuleId: "store",
            sourceModuleName: "Store",
            targetModuleId: "accounting",
            targetModuleName: "Accounting",
            integrationType: "workflow",
            integrationDetails: {
              triggers: ["order.created", "payment.received"],
            },
            status: "active",
          },
          {
            id: "3",
            sourceModuleId: "marketing",
            sourceModuleName: "Marketing",
            targetModuleId: "analytics",
            targetModuleName: "Analytics",
            integrationType: "data",
            integrationDetails: {
              metrics: ["campaign.performance", "ad.clicks"],
            },
            status: "active",
          },
          {
            id: "4",
            sourceModuleId: "developer",
            sourceModuleName: "Developer",
            targetModuleId: "dashboard",
            targetModuleName: "Dashboard",
            integrationType: "navigation",
            integrationDetails: { routes: ["/dashboard/developer/roadmap"] },
            status: "active",
          },
          {
            id: "5",
            sourceModuleId: "inbox",
            sourceModuleName: "Inbox",
            targetModuleId: "customers",
            targetModuleName: "Customers",
            integrationType: "data",
            integrationDetails: { dataPoints: ["messages", "conversations"] },
            status: "active",
          },
          {
            id: "6",
            sourceModuleId: "customers",
            sourceModuleName: "Customers",
            targetModuleId: "marketing",
            targetModuleName: "Marketing",
            integrationType: "workflow",
            integrationDetails: {
              triggers: ["customer.created", "customer.updated"],
            },
            status: "active",
          },
          {
            id: "7",
            sourceModuleId: "accounting",
            sourceModuleName: "Accounting",
            targetModuleId: "dashboard",
            targetModuleName: "Dashboard",
            integrationType: "data",
            integrationDetails: { dataPoints: ["invoices", "expenses"] },
            status: "active",
          },
        ];
        setIntegrations(mockData);

        // Extract unique modules from mock data
        const uniqueModules = new Set<string>();
        mockData.forEach((integration) => {
          uniqueModules.add(integration.sourceModuleName);
          uniqueModules.add(integration.targetModuleName);
        });

        setModules(Array.from(uniqueModules));
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();
  }, [t, toast]);

  // Filter integrations based on search query and selected module
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = searchQuery
      ? integration.sourceModuleName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        integration.targetModuleName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const matchesModule = selectedModule
      ? integration.sourceModuleName === selectedModule ||
        integration.targetModuleName === selectedModule
      : true;

    return matchesSearch && matchesModule;
  });

  const getIntegrationTypeIcon = (type: string) => {
    switch (type) {
      case "navigation":
        return <GitBranch className="h-4 w-4" />;
      case "data":
        return <BarChart3 className="h-4 w-4" />;
      case "workflow":
        return <Workflow className="h-4 w-4" />;
      case "notification":
        return <Bell className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

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

  // Render force-directed graph visualization
  const renderForceDirectedGraph = () => {
    return (
      <div className="relative h-[500px] border rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <Network className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {t("Force-Directed Graph Visualization")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                "This visualization shows module connections using a force-directed layout algorithm.",
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(
                "Note: This is a placeholder. In a production environment, this would be implemented using D3.js or a similar library.",
              )}
            </p>
          </div>
        </div>

        {/* Placeholder visualization */}
        <div className="absolute inset-0 pointer-events-none">
          {modules.map((module, index) => {
            const angle = (index / modules.length) * Math.PI * 2;
            const radius = 180;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <div
                key={module}
                className="absolute w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border-2 border-primary/30"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <div className="text-center">
                  <div className="font-medium text-xs">{module}</div>
                </div>
              </div>
            );
          })}

          {/* Draw lines between connected modules */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: -1 }}
          >
            {filteredIntegrations.map((integration) => {
              const sourceIndex = modules.indexOf(integration.sourceModuleName);
              const targetIndex = modules.indexOf(integration.targetModuleName);

              if (sourceIndex === -1 || targetIndex === -1) return null;

              const sourceAngle = (sourceIndex / modules.length) * Math.PI * 2;
              const targetAngle = (targetIndex / modules.length) * Math.PI * 2;
              const radius = 180;

              const sourceX = 50 + radius * Math.cos(sourceAngle);
              const sourceY = 50 + radius * Math.sin(sourceAngle);
              const targetX = 50 + radius * Math.cos(targetAngle);
              const targetY = 50 + radius * Math.sin(targetAngle);

              let strokeColor;
              switch (integration.integrationType) {
                case "navigation":
                  strokeColor = "rgba(59, 130, 246, 0.6)";
                  break;
                case "data":
                  strokeColor = "rgba(16, 185, 129, 0.6)";
                  break;
                case "workflow":
                  strokeColor = "rgba(139, 92, 246, 0.6)";
                  break;
                case "notification":
                  strokeColor = "rgba(245, 158, 11, 0.6)";
                  break;
                default:
                  strokeColor = "rgba(156, 163, 175, 0.6)";
              }

              return (
                <line
                  key={`${integration.id}-line`}
                  x1={`calc(50% + ${sourceX}px)`}
                  y1={`calc(50% + ${sourceY}px)`}
                  x2={`calc(50% + ${targetX}px)`}
                  y2={`calc(50% + ${targetY}px)`}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // Render radial view visualization
  const renderRadialView = () => {
    return (
      <div className="relative h-[500px] border rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <Share2 className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {t("Radial View Visualization")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                "This visualization arranges modules in a radial layout with the selected module at the center.",
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(
                "Note: This is a placeholder. In a production environment, this would be implemented using D3.js or a similar library.",
              )}
            </p>
          </div>
        </div>

        {/* Placeholder visualization */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center module */}
          <div
            className="absolute w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border-2 border-primary"
            style={{ left: "50%", top: "50%" }}
          >
            <div className="text-center">
              <div className="font-medium">
                {selectedModule || t("All Modules")}
              </div>
            </div>
          </div>

          {/* Connected modules */}
          {modules
            .filter((module) => module !== selectedModule)
            .map((module, index, filteredModules) => {
              const angle = (index / filteredModules.length) * Math.PI * 2;
              const radius = 200;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              // Find integrations related to this module
              const relatedIntegrations = filteredIntegrations.filter(
                (integration) =>
                  integration.sourceModuleName === module ||
                  integration.targetModuleName === module,
              );

              return (
                <div
                  key={module}
                  className="absolute w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border-2 border-secondary/30"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  <div className="text-center">
                    <div className="font-medium text-xs">{module}</div>
                    <div className="text-xs text-muted-foreground">
                      {relatedIntegrations.length} {t("connections")}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Draw lines between connected modules */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: -1 }}
          >
            {filteredIntegrations.map((integration) => {
              // If no module is selected, draw lines between all connected modules
              // If a module is selected, only draw lines connected to that module
              if (
                selectedModule &&
                integration.sourceModuleName !== selectedModule &&
                integration.targetModuleName !== selectedModule
              ) {
                return null;
              }

              const isSourceCenter =
                selectedModule === integration.sourceModuleName;
              const isTargetCenter =
                selectedModule === integration.targetModuleName;

              let sourceX, sourceY, targetX, targetY;

              if (isSourceCenter) {
                sourceX = 0;
                sourceY = 0;

                const targetIndex = modules
                  .filter((m) => m !== selectedModule)
                  .indexOf(integration.targetModuleName);
                const targetAngle =
                  (targetIndex /
                    modules.filter((m) => m !== selectedModule).length) *
                  Math.PI *
                  2;
                const radius = 200;
                targetX = radius * Math.cos(targetAngle);
                targetY = radius * Math.sin(targetAngle);
              } else if (isTargetCenter) {
                targetX = 0;
                targetY = 0;

                const sourceIndex = modules
                  .filter((m) => m !== selectedModule)
                  .indexOf(integration.sourceModuleName);
                const sourceAngle =
                  (sourceIndex /
                    modules.filter((m) => m !== selectedModule).length) *
                  Math.PI *
                  2;
                const radius = 200;
                sourceX = radius * Math.cos(sourceAngle);
                sourceY = radius * Math.sin(sourceAngle);
              } else {
                // If no module is selected, calculate positions based on the full circle
                const sourceIndex = modules.indexOf(
                  integration.sourceModuleName,
                );
                const targetIndex = modules.indexOf(
                  integration.targetModuleName,
                );
                const sourceAngle =
                  (sourceIndex / modules.length) * Math.PI * 2;
                const targetAngle =
                  (targetIndex / modules.length) * Math.PI * 2;
                const radius = 200;
                sourceX = radius * Math.cos(sourceAngle);
                sourceY = radius * Math.sin(sourceAngle);
                targetX = radius * Math.cos(targetAngle);
                targetY = radius * Math.sin(targetAngle);
              }

              let strokeColor;
              switch (integration.integrationType) {
                case "navigation":
                  strokeColor = "rgba(59, 130, 246, 0.6)";
                  break;
                case "data":
                  strokeColor = "rgba(16, 185, 129, 0.6)";
                  break;
                case "workflow":
                  strokeColor = "rgba(139, 92, 246, 0.6)";
                  break;
                case "notification":
                  strokeColor = "rgba(245, 158, 11, 0.6)";
                  break;
                default:
                  strokeColor = "rgba(156, 163, 175, 0.6)";
              }

              return (
                <line
                  key={`${integration.id}-line`}
                  x1={`calc(50% + ${sourceX}px)`}
                  y1={`calc(50% + ${sourceY}px)`}
                  x2={`calc(50% + ${targetX}px)`}
                  y2={`calc(50% + ${targetY}px)`}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // Render hierarchical tree visualization
  const renderHierarchicalTree = () => {
    return (
      <div className="relative h-[500px] border rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <GitMerge className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {t("Hierarchical Tree Visualization")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                "This visualization shows module dependencies in a hierarchical tree structure.",
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(
                "Note: This is a placeholder. In a production environment, this would be implemented using D3.js or a similar library.",
              )}
            </p>
          </div>
        </div>

        {/* Placeholder visualization */}
        <div className="absolute inset-0 pointer-events-none overflow-auto p-4">
          <div className="relative w-full h-full flex justify-center">
            {/* Root module */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-12 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary">
                <div className="text-center">
                  <div className="font-medium">
                    {selectedModule || "Dashboard"}
                  </div>
                </div>
              </div>

              {/* First level children */}
              <div className="flex justify-center mt-8">
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <div className="flex justify-center">
                <div className="w-[600px] h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <div className="flex justify-between mt-2">
                {modules
                  .filter(
                    (module) =>
                      module !== selectedModule && module !== "Dashboard",
                  )
                  .slice(0, 5)
                  .map((module, index) => (
                    <div key={module} className="flex flex-col items-center">
                      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-28 h-10 rounded-lg bg-secondary/10 flex items-center justify-center border-2 border-secondary/30">
                        <div className="text-center">
                          <div className="font-medium text-xs">{module}</div>
                        </div>
                      </div>

                      {/* Second level children */}
                      {index % 2 === 0 && (
                        <>
                          <div className="flex justify-center mt-4">
                            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                          <div className="flex justify-center">
                            <div className="w-[200px] h-px bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                          <div className="flex justify-between mt-2">
                            {modules
                              .filter(
                                (m) =>
                                  m !== selectedModule &&
                                  m !== module &&
                                  m !== "Dashboard",
                              )
                              .slice(0, 2)
                              .map((childModule) => (
                                <div
                                  key={childModule}
                                  className="flex flex-col items-center"
                                >
                                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                                  <div className="w-24 h-8 rounded-lg bg-muted flex items-center justify-center border border-muted-foreground/20">
                                    <div className="text-center">
                                      <div className="font-medium text-xs">
                                        {childModule}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg" dir="auto">
          {t("Loading module integration visualization...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t("Module Integration Visualization")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Visualize connections and dependencies between different modules in the system",
            )}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <AIActionButton
            onClick={() => {
              promptAIAssistant(
                "Analyze the current module integrations and suggest improvements for better system connectivity",
              );
            }}
            label={t("AI Analysis")}
            variant="outline"
            size="sm"
            tooltipText={t("Get AI recommendations for module integrations")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("Search modules...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <select
            className="border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">{t("All Modules")}</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="force-directed">
            <Network className="mr-2 h-4 w-4" />
            {t("Force-Directed Graph")}
          </TabsTrigger>
          <TabsTrigger value="radial">
            <Share2 className="mr-2 h-4 w-4" />
            {t("Radial View")}
          </TabsTrigger>
          <TabsTrigger value="hierarchical">
            <GitMerge className="mr-2 h-4 w-4" />
            {t("Hierarchical Tree")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="force-directed" className="mt-6">
          {renderForceDirectedGraph()}
        </TabsContent>

        <TabsContent value="radial" className="mt-6">
          {renderRadialView()}
        </TabsContent>

        <TabsContent value="hierarchical" className="mt-6">
          {renderHierarchicalTree()}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{t("Integration Legend")}</CardTitle>
          <CardDescription>
            {t("Types of integrations between modules")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <GitBranch className="mr-1 h-3 w-3" />
                {t("Navigation")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("UI navigation between modules")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <BarChart3 className="mr-1 h-3 w-3" />
                {t("Data")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("Data sharing between modules")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Workflow className="mr-1 h-3 w-3" />
                {t("Workflow")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("Process flows between modules")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Bell className="mr-1 h-3 w-3" />
                {t("Notification")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("Alerts and notifications")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Module Integrations")}</CardTitle>
          <CardDescription>
            {t("List of all integrations between modules")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {filteredIntegrations.length > 0 ? (
                filteredIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <Badge
                        className={getIntegrationTypeColor(
                          integration.integrationType,
                        )}
                      >
                        {getIntegrationTypeIcon(integration.integrationType)}
                        <span className="ml-1">
                          {t(integration.integrationType)}
                        </span>
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

                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        {t("Integration Details")}:
                      </p>
                      <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-24">
                        {JSON.stringify(
                          integration.integrationDetails,
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <FallbackMessage
                  title={t("No Integrations Found")}
                  message={
                    searchQuery || selectedModule
                      ? t("No integrations match your filter criteria")
                      : t("No integrations have been created yet")
                  }
                  icon={
                    <Link2Off className="h-12 w-12 text-muted-foreground opacity-50" />
                  }
                  dir="auto"
                />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleIntegrationVisualization;

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { useToast } from "@/frontend/components/ui/use-toast";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";
import {
  Search,
  Link,
  Link2Off,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  moduleIntegrationService,
  ModuleIntegration,
} from "@/frontend/services/moduleIntegrationService";

interface ModuleIntegrationManagerProps {
  isRTL?: boolean;
}

const ModuleIntegrationManager: React.FC<ModuleIntegrationManagerProps> = ({
  isRTL = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { promptAIAssistant } = useAI();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState<ModuleIntegration[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Form state for creating/editing
  const [formData, setFormData] = useState<Partial<ModuleIntegration>>({
    sourceModuleId: "",
    sourceModuleName: "",
    targetModuleId: "",
    targetModuleName: "",
    integrationType: "navigation",
    integrationDetails: {},
    status: "active",
  });

  // List of available modules
  const availableModules = [
    "Dashboard",
    "Store",
    "Accounting",
    "Marketing",
    "Analytics",
    "Customers",
    "Inbox",
    "Documents",
    "Developer",
    "Settings",
  ];

  // Load integrations
  useEffect(() => {
    const loadIntegrations = async () => {
      setIsLoading(true);
      try {
        let response;
        if (selectedModule) {
          response =
            await moduleIntegrationService.getModuleIntegrations(
              selectedModule,
            );
        } else {
          response = await moduleIntegrationService.getAllIntegrations();
        }

        if (response.error) {
          throw response.error;
        }

        setIntegrations(response.data);
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
        ];
        setIntegrations(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();
  }, [selectedModule, t, toast]);

  // Filter integrations based on search query and active tab
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = searchQuery
      ? integration.sourceModuleName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        integration.targetModuleName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "navigation" &&
        integration.integrationType === "navigation") ||
      (activeTab === "data" && integration.integrationType === "data") ||
      (activeTab === "workflow" &&
        integration.integrationType === "workflow") ||
      (activeTab === "notification" &&
        integration.integrationType === "notification");

    return matchesSearch && matchesTab;
  });

  const handleCreateIntegration = async () => {
    if (
      !formData.sourceModuleName ||
      !formData.targetModuleName ||
      !formData.integrationType
    ) {
      toast({
        title: t("Validation Error"),
        description: t("Please fill in all required fields"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare the integration data
      const integrationData: Omit<ModuleIntegration, "id"> = {
        sourceModuleId: formData.sourceModuleName?.toLowerCase() || "",
        sourceModuleName: formData.sourceModuleName || "",
        targetModuleId: formData.targetModuleName?.toLowerCase() || "",
        targetModuleName: formData.targetModuleName || "",
        integrationType: formData.integrationType as
          | "data"
          | "navigation"
          | "workflow"
          | "notification",
        integrationDetails: formData.integrationDetails || {},
        status: "active",
      };

      // Call the service to create the integration
      const response =
        await moduleIntegrationService.createModuleIntegration(integrationData);

      if (response.error) {
        throw response.error;
      }

      if (response.data) {
        // Add the new integration to the state
        setIntegrations([...integrations, response.data]);

        toast({
          title: t("Integration Created"),
          description: t(
            "The module integration has been created successfully",
          ),
        });

        // Reset form
        setFormData({
          sourceModuleId: "",
          sourceModuleName: "",
          targetModuleId: "",
          targetModuleName: "",
          integrationType: "navigation",
          integrationDetails: {},
          status: "active",
        });

        setIsCreating(false);
      } else {
        // Fallback for demonstration if the service call fails
        const newIntegration: ModuleIntegration = {
          id: `temp-${Date.now()}`,
          ...integrationData,
        };

        setIntegrations([...integrations, newIntegration]);

        toast({
          title: t("Integration Created (Demo)"),
          description: t(
            "The module integration has been created in demo mode",
          ),
        });

        // Reset form
        setFormData({
          sourceModuleId: "",
          sourceModuleName: "",
          targetModuleId: "",
          targetModuleName: "",
          integrationType: "navigation",
          integrationDetails: {},
          status: "active",
        });

        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating integration:", error);
      toast({
        title: t("Error"),
        description: t("Failed to create module integration"),
        variant: "destructive",
      });
    }
  };

  const handleUpdateIntegration = async () => {
    if (!isEditing) return;

    try {
      // Prepare the update data
      const updateData: Partial<ModuleIntegration> = {};

      if (formData.sourceModuleName) {
        updateData.sourceModuleId = formData.sourceModuleName.toLowerCase();
        updateData.sourceModuleName = formData.sourceModuleName;
      }

      if (formData.targetModuleName) {
        updateData.targetModuleId = formData.targetModuleName.toLowerCase();
        updateData.targetModuleName = formData.targetModuleName;
      }

      if (formData.integrationType) {
        updateData.integrationType = formData.integrationType as
          | "data"
          | "navigation"
          | "workflow"
          | "notification";
      }

      if (formData.integrationDetails) {
        updateData.integrationDetails = formData.integrationDetails;
      }

      if (formData.status) {
        updateData.status = formData.status as
          | "active"
          | "inactive"
          | "pending";
      }

      // Call the service to update the integration
      const response = await moduleIntegrationService.updateModuleIntegration(
        isEditing,
        updateData,
      );

      if (response.error) {
        throw response.error;
      }

      if (response.success) {
        // Update the integration in the local state
        const updatedIntegrations = integrations.map((integration) =>
          integration.id === isEditing
            ? {
                ...integration,
                ...updateData,
              }
            : integration,
        );

        setIntegrations(updatedIntegrations);

        toast({
          title: t("Integration Updated"),
          description: t(
            "The module integration has been updated successfully",
          ),
        });
      } else {
        // Fallback for demonstration if the service call fails
        const updatedIntegrations = integrations.map((integration) =>
          integration.id === isEditing
            ? {
                ...integration,
                sourceModuleName:
                  formData.sourceModuleName || integration.sourceModuleName,
                targetModuleName:
                  formData.targetModuleName || integration.targetModuleName,
                integrationType:
                  (formData.integrationType as
                    | "data"
                    | "navigation"
                    | "workflow"
                    | "notification") || integration.integrationType,
                integrationDetails:
                  formData.integrationDetails || integration.integrationDetails,
                status:
                  (formData.status as "active" | "inactive" | "pending") ||
                  integration.status,
              }
            : integration,
        );

        setIntegrations(updatedIntegrations);

        toast({
          title: t("Integration Updated (Demo)"),
          description: t(
            "The module integration has been updated in demo mode",
          ),
        });
      }

      // Reset form and editing state
      setFormData({
        sourceModuleId: "",
        sourceModuleName: "",
        targetModuleId: "",
        targetModuleName: "",
        integrationType: "navigation",
        integrationDetails: {},
        status: "active",
      });

      setIsEditing(null);
    } catch (error) {
      console.error("Error updating integration:", error);
      toast({
        title: t("Error"),
        description: t("Failed to update module integration"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    try {
      // Call the service to delete the integration
      const response =
        await moduleIntegrationService.deleteModuleIntegration(id);

      if (response.error) {
        throw response.error;
      }

      if (response.success) {
        // Remove the integration from the local state
        const updatedIntegrations = integrations.filter(
          (integration) => integration.id !== id,
        );
        setIntegrations(updatedIntegrations);

        toast({
          title: t("Integration Deleted"),
          description: t(
            "The module integration has been deleted successfully",
          ),
        });
      } else {
        // Fallback for demonstration if the service call fails
        const updatedIntegrations = integrations.filter(
          (integration) => integration.id !== id,
        );
        setIntegrations(updatedIntegrations);

        toast({
          title: t("Integration Deleted (Demo)"),
          description: t(
            "The module integration has been deleted in demo mode",
          ),
        });
      }
    } catch (error) {
      console.error("Error deleting integration:", error);
      toast({
        title: t("Error"),
        description: t("Failed to delete module integration"),
        variant: "destructive",
      });
    }
  };

  const handleEditIntegration = (integration: ModuleIntegration) => {
    setFormData({
      sourceModuleId: integration.sourceModuleId,
      sourceModuleName: integration.sourceModuleName,
      targetModuleId: integration.targetModuleId,
      targetModuleName: integration.targetModuleName,
      integrationType: integration.integrationType,
      integrationDetails: integration.integrationDetails,
      status: integration.status,
    });

    setIsEditing(integration.id);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({
      sourceModuleId: "",
      sourceModuleName: "",
      targetModuleId: "",
      targetModuleName: "",
      integrationType: "navigation",
      integrationDetails: {},
      status: "active",
    });
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg" dir="auto">
          {t("Loading module integrations...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t("Module Integration Manager")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage connections between different modules in the system")}
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

          <Button
            variant="default"
            onClick={() => setIsCreating(true)}
            disabled={isCreating || isEditing !== null}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("New Integration")}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("Search integrations...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("Filter by module")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("All Modules")}</SelectItem>
            {availableModules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">{t("All Integrations")}</TabsTrigger>
          <TabsTrigger value="navigation">{t("Navigation")}</TabsTrigger>
          <TabsTrigger value="data">{t("Data")}</TabsTrigger>
          <TabsTrigger value="workflow">{t("Workflow")}</TabsTrigger>
          <TabsTrigger value="notification">{t("Notification")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isCreating && (
            <Card className="mb-6 border-primary/50">
              <CardHeader>
                <CardTitle>{t("Create New Integration")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Source Module")}
                    </label>
                    <Select
                      value={formData.sourceModuleName || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          sourceModuleName: value,
                          sourceModuleId: value.toLowerCase(),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select source module")} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Target Module")}
                    </label>
                    <Select
                      value={formData.targetModuleName || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          targetModuleName: value,
                          targetModuleId: value.toLowerCase(),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select target module")} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Integration Type")}
                    </label>
                    <Select
                      value={formData.integrationType || "navigation"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          integrationType: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select integration type")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="navigation">
                          {t("Navigation")}
                        </SelectItem>
                        <SelectItem value="data">{t("Data")}</SelectItem>
                        <SelectItem value="workflow">
                          {t("Workflow")}
                        </SelectItem>
                        <SelectItem value="notification">
                          {t("Notification")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Status")}
                    </label>
                    <Select
                      value={formData.status || "active"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t("Active")}</SelectItem>
                        <SelectItem value="inactive">
                          {t("Inactive")}
                        </SelectItem>
                        <SelectItem value="pending">{t("Pending")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={cancelForm}>
                    <X className="mr-2 h-4 w-4" />
                    {t("Cancel")}
                  </Button>
                  <Button onClick={handleCreateIntegration}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("Create Integration")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isEditing && (
            <Card className="mb-6 border-primary/50">
              <CardHeader>
                <CardTitle>{t("Edit Integration")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Source Module")}
                    </label>
                    <Select
                      value={formData.sourceModuleName || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          sourceModuleName: value,
                          sourceModuleId: value.toLowerCase(),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select source module")} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Target Module")}
                    </label>
                    <Select
                      value={formData.targetModuleName || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          targetModuleName: value,
                          targetModuleId: value.toLowerCase(),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select target module")} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Integration Type")}
                    </label>
                    <Select
                      value={formData.integrationType || "navigation"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          integrationType: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select integration type")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="navigation">
                          {t("Navigation")}
                        </SelectItem>
                        <SelectItem value="data">{t("Data")}</SelectItem>
                        <SelectItem value="workflow">
                          {t("Workflow")}
                        </SelectItem>
                        <SelectItem value="notification">
                          {t("Notification")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {t("Status")}
                    </label>
                    <Select
                      value={formData.status || "active"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t("Active")}</SelectItem>
                        <SelectItem value="inactive">
                          {t("Inactive")}
                        </SelectItem>
                        <SelectItem value="pending">{t("Pending")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={cancelForm}>
                    <X className="mr-2 h-4 w-4" />
                    {t("Cancel")}
                  </Button>
                  <Button onClick={handleUpdateIntegration}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("Update Integration")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditIntegration(integration)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteIntegration(integration.id || "")
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
      </Tabs>
    </div>
  );
};

export default ModuleIntegrationManager;

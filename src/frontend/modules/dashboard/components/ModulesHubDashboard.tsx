import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/frontend/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Store,
  Calculator,
  Users,
  HeadphonesIcon,
  TrendingUp,
  Sparkles,
  Code,
  Layers,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  ShoppingBag,
  Grid,
  FileText,
  MessageSquare,
} from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  isNew?: boolean;
  isRTL?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  path,
  badge,
  isNew = false,
  isRTL = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="h-full transition-all hover:shadow-md overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {isNew && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {t("New")}
              </Badge>
            )}
            {badge && (
              <Badge variant="outline" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={() => navigate(path)}
          variant="outline"
          className="w-full justify-center hover:bg-primary hover:text-white transition-colors"
        >
          {t("Open")} {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ModulesHubDashboardProps {
  isRTL?: boolean;
}

const ModulesHubDashboard: React.FC<ModulesHubDashboardProps> = ({
  isRTL = false,
}) => {
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const isSuperAdmin = hasRole && hasRole("superadmin");

  // Define all available modules
  const allModules = [
    {
      title: t("Dashboard"),
      description: t("Overview of your business performance and key metrics"),
      icon: <Grid className="h-5 w-5" />,
      path: "/dashboard",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Store"),
      description: t("Manage products, inventory, and orders"),
      icon: <Store className="h-5 w-5" />,
      path: "/dashboard/store",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Accounting"),
      description: t("Track finances, invoices, and expenses"),
      icon: <Calculator className="h-5 w-5" />,
      path: "/dashboard/accounting",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Marketing"),
      description: t("Create and manage marketing campaigns"),
      icon: <TrendingUp className="h-5 w-5" />,
      path: "/dashboard/marketing",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Analytics"),
      description: t("Analyze business data and performance metrics"),
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/dashboard/analytics",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Customers"),
      description: t("Manage customer profiles and relationships"),
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/customers",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Inbox"),
      description: t("Unified messaging center for all communications"),
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/dashboard/inbox",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Documents"),
      description: t("Manage and organize business documents"),
      icon: <FileText className="h-5 w-5" />,
      path: "/dashboard/documents",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("AI Assistant"),
      description: t("Intelligent assistant for business tasks"),
      icon: <Sparkles className="h-5 w-5" />,
      path: "/dashboard/ai",
      badge: t("Premium"),
      isNew: true,
      requiredRole: "premium",
    },
    {
      title: t("Developer Tools"),
      description: t("Tools for developers and system customization"),
      icon: <Code className="h-5 w-5" />,
      path: "/dashboard/developer",
      badge: t("Advanced"),
      isNew: false,
      requiredRole: "developer",
    },
    {
      title: t("Integrations"),
      description: t("Connect with external services and APIs"),
      icon: <Layers className="h-5 w-5" />,
      path: "/dashboard/integrations",
      badge: t("Advanced"),
      isNew: false,
      requiredRole: "admin",
    },
    {
      title: t("Customer Service"),
      description: t("Support ticket management and customer assistance"),
      icon: <HeadphonesIcon className="h-5 w-5" />,
      path: "/dashboard/customer-service",
      badge: t("Support"),
      isNew: false,
      requiredRole: "support",
    },
    {
      title: t("Notifications"),
      description: t("System alerts and important updates"),
      icon: <Bell className="h-5 w-5" />,
      path: "/dashboard/notifications",
      badge: t("System"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Settings"),
      description: t("Configure system and user preferences"),
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
      badge: t("System"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Support"),
      description: t("Get help and access documentation"),
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/dashboard/support",
      badge: t("System"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("Storefront"),
      description: t("Manage your online store and customer experience"),
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/storefront",
      badge: t("Core"),
      isNew: false,
      requiredRole: "user",
    },
    {
      title: t("User Analytics"),
      description: t("Advanced user behavior and system usage analytics"),
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/admin/user-analytics",
      badge: t("Admin"),
      isNew: true,
      requiredRole: "admin",
    },
  ];

  // Filter modules based on user role
  const visibleModules = isSuperAdmin
    ? allModules
    : allModules.filter((module) => {
        if (module.requiredRole === "user") return true;
        if (module.requiredRole === "premium" && hasRole && hasRole("premium"))
          return true;
        if (
          module.requiredRole === "developer" &&
          hasRole &&
          hasRole("developer")
        )
          return true;
        if (module.requiredRole === "admin" && hasRole && hasRole("admin"))
          return true;
        if (module.requiredRole === "support" && hasRole && hasRole("support"))
          return true;
        return false;
      });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("Modules Hub")}</h1>
        <p className="text-muted-foreground">
          {t(
            "Access all available modules and features of the Wemarka WMAI platform",
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleModules.map((module, index) => (
          <ModuleCard
            key={index}
            title={module.title}
            description={module.description}
            icon={module.icon}
            path={module.path}
            badge={module.badge}
            isNew={module.isNew}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
};

export default ModulesHubDashboard;

import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

interface StagingEnvironmentNoticeProps {
  className?: string;
}

const StagingEnvironmentNotice: React.FC<StagingEnvironmentNoticeProps> = ({
  className,
}) => {
  const [deploymentTime, setDeploymentTime] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);

  // Determine if we're in a production environment
  // In a real app, this would check environment variables
  const isProd = window.location.hostname === "app.wemarka.com";

  // Get the current environment name
  const getEnvironmentName = () => {
    const hostname = window.location.hostname;
    if (hostname.includes("staging")) return "Staging";
    if (hostname.includes("dev")) return "Development";
    if (hostname.includes("test")) return "Testing";
    if (hostname.includes("localhost")) return "Local";
    return "Unknown";
  };

  // Get the API URL
  const getApiUrl = () => {
    // This would normally come from environment variables
    return import.meta.env.VITE_SUPABASE_URL || "https://api.example.com";
  };

  useEffect(() => {
    // Simulate getting the deployment timestamp
    // In a real app, this would be injected at build time or fetched from an API
    const now = new Date();
    setDeploymentTime(now.toLocaleString());
  }, []);

  if (isProd || !isVisible) return null;

  return (
    <div
      className={cn(
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 flex items-center justify-between text-sm",
        className,
      )}
    >
      <div className="flex items-center">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <span className="font-semibold mr-2">Staging Mode</span>
        <span className="mx-2">|</span>
        <span>Environment: {getEnvironmentName()}</span>
        <span className="mx-2">|</span>
        <span>API: {getApiUrl()}</span>
        <span className="mx-2">|</span>
        <span>Deployed: {deploymentTime}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100"
      >
        ×
      </button>
    </div>
  );
};

export default StagingEnvironmentNotice;

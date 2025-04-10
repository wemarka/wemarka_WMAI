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
  const [buildId, setBuildId] = useState<string>("");

  // Determine if we're in a production environment
  const isProd =
    import.meta.env.VITE_APP_ENV === "production" ||
    window.location.hostname === "app.wemarka.com";

  // Get the current environment name
  const getEnvironmentName = () => {
    // First check environment variable
    const envVar = import.meta.env.VITE_APP_ENV;
    if (envVar) return envVar.charAt(0).toUpperCase() + envVar.slice(1);

    // Fallback to hostname detection
    const hostname = window.location.hostname;
    if (hostname.includes("staging")) return "Staging";
    if (hostname.includes("dev")) return "Development";
    if (hostname.includes("test")) return "Testing";
    if (hostname.includes("localhost")) return "Local";
    if (hostname.includes("tempo-dev")) return "Tempo";
    return "Unknown";
  };

  // Get the API URL
  const getApiUrl = () => {
    return import.meta.env.VITE_SUPABASE_URL || "https://api.example.com";
  };

  useEffect(() => {
    // Get deployment timestamp
    const deployTime =
      import.meta.env.VITE_DEPLOY_TIME || new Date().toISOString();
    setDeploymentTime(new Date(deployTime).toLocaleString());

    // Get build ID if available
    const buildIdentifier =
      import.meta.env.VITE_BUILD_ID ||
      import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ||
      "development";
    setBuildId(buildIdentifier.substring(0, 7)); // Show first 7 chars if it's a git hash
  }, []);

  // Don't show in production or if dismissed
  if (isProd || !isVisible) return null;

  return (
    <div
      className={cn(
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 flex items-center justify-between text-sm",
        className,
      )}
    >
      <div className="flex items-center flex-wrap">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <span className="font-semibold mr-2">Staging Mode</span>
        <span className="mx-2">|</span>
        <span>Environment: {getEnvironmentName()}</span>
        <span className="mx-2">|</span>
        <span>API: {getApiUrl()}</span>
        <span className="mx-2">|</span>
        <span>Deployed: {deploymentTime}</span>
        {buildId && (
          <>
            <span className="mx-2">|</span>
            <span>Build: {buildId}</span>
          </>
        )}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 ml-2"
        aria-label="Dismiss notice"
      >
        ×
      </button>
    </div>
  );
};

export default StagingEnvironmentNotice;

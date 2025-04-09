import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

interface MarketingModuleLayoutProps {
  children: React.ReactNode;
  currentSection?: string;
}

const MarketingModuleLayout: React.FC<MarketingModuleLayoutProps> = ({
  children,
  currentSection = "Campaigns",
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
            onClick={handleBackToDashboard}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 ml-auto mr-auto">
            Marketing
          </h2>
        </div>
      </div>
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">{currentSection}</h2>
        {children}
      </div>
    </div>
  );
};

export default MarketingModuleLayout;

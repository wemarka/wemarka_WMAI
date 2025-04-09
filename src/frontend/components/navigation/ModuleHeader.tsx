import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { useSidebar } from "@/frontend/contexts/SidebarContext";
import LanguageToggle from "@/frontend/components/ui/language-toggle";

interface ModuleHeaderProps {
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  isDarkMode = false,
  toggleDarkMode = () => {},
}) => {
  const navigate = useNavigate();
  const { selectedModule } = useSidebar();

  return (
    <header className="h-16 border-b bg-card shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold gradient-heading">
          {selectedModule}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64 bg-background rounded-lg"
          />
        </div>

        <LanguageToggle />

        <Button
          variant="ghost"
          size="icon-sm"
          rounded="full"
          className="text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          rounded="full"
          className="text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <div
          className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer"
          onClick={() => navigate("/dashboard/settings")}
        >
          <span className="text-sm font-medium">JD</span>
        </div>
      </div>
    </header>
  );
};

export default ModuleHeader;

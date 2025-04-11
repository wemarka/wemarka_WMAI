import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Moon,
  Sun,
  Menu,
  HelpCircle,
  Settings,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import { useSidebar } from "@/frontend/contexts/SidebarContext";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { LanguageToggle } from "@/frontend/components/ui/language-toggle";
import { AIActionButton } from "@/frontend/modules/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";

interface ModuleHeaderProps {
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  isDarkMode = false,
  toggleDarkMode = () => {},
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "",
  notificationCount = 3,
}) => {
  const navigate = useNavigate();
  const { selectedModule } = useSidebar();
  const { direction } = useLanguage();
  const { promptAIAssistant } = useAI();
  const [searchValue, setSearchValue] = useState("");
  const rtl = direction === "rtl";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Handle search
      console.log("Searching for:", searchValue);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="h-16 border-b bg-card shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold gradient-heading">
          {rtl
            ? selectedModule === "Dashboard"
              ? "لوحة التحكم"
              : selectedModule
            : selectedModule}
        </h1>
        <Badge
          variant="outline"
          className="ml-2 bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800"
        >
          {rtl ? "الإصدار 1.0" : "v1.0"}
        </Badge>
      </div>

      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:block"
        >
          <Search
            className={`absolute ${rtl ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`}
          />
          <Input
            placeholder={rtl ? "بحث..." : "Search..."}
            className={`${rtl ? "pr-10" : "pl-10"} w-64 bg-background rounded-lg`}
            value={searchValue}
            onChange={handleSearchChange}
            dir={rtl ? "rtl" : "ltr"}
          />
        </form>

        <AIActionButton
          onClick={() => {
            promptAIAssistant(
              rtl
                ? "مرحباً، أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟"
                : "Hello, I'm your AI assistant. How can I help you today?",
            );
          }}
          label={rtl ? "WMAI" : "WMAI"}
          tooltipText={rtl ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
          variant="default"
          size="sm"
          icon={<Sparkles className="h-3.5 w-3.5 mr-1" />}
        />

        <LanguageToggle />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                rounded="full"
                className="text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20 relative"
                onClick={() => navigate("/dashboard/notifications")}
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{rtl ? "الإشعارات" : "Notifications"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                rounded="full"
                className="text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20"
                onClick={() => navigate("/dashboard/help-center")}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{rtl ? "مركز المساعدة" : "Help Center"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isDarkMode
                  ? rtl
                    ? "الوضع الفاتح"
                    : "Light Mode"
                  : rtl
                    ? "الوضع الداكن"
                    : "Dark Mode"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-1 rtl:space-x-reverse cursor-pointer rounded-full p-1 hover:bg-muted/50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {getInitials(userName)}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={rtl ? "start" : "end"} className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="h-4 w-4 mr-2" />
              <span>{rtl ? "الملف الشخصي" : "Profile"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              <span>{rtl ? "الإعدادات" : "Settings"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/logout")}>
              <span className="text-red-500">
                {rtl ? "تسجيل الخروج" : "Logout"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ModuleHeader;

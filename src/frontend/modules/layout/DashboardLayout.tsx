import React, { useState, useEffect } from "react";
import { cn } from "@/frontend/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/frontend/contexts/AuthContext";
import {
  Sun,
  Moon,
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Sparkles,
  X,
  Menu,
  Globe,
  HelpCircle,
  MessageSquare,
  Calendar,
  ShoppingBag,
  LineChart,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3,
} from "lucide-react";
import MainSidebar from "@/frontend/components/navigation/MainSidebar";
import SubSidebar from "@/frontend/components/navigation/SubSidebar";
import {
  SidebarProvider,
  useSidebar,
} from "@/frontend/contexts/SidebarContext";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/frontend/components/ui/avatar";
import { Badge } from "@/frontend/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/frontend/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import { AIAssistantPanel } from "@/frontend/modules/ai";
import { useAI } from "@/frontend/contexts/AIContext";
import StagingEnvironmentNotice from "@/frontend/components/StagingEnvironmentNotice";
import FeedbackButton from "@/frontend/components/feedback/FeedbackButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentModule?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

// Wrapper component that provides the SidebarContext
const DashboardLayoutWithContext: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <SidebarProvider>
      <DashboardLayoutContent {...props} />
    </SidebarProvider>
  );
};

// Main content component that uses the SidebarContext
const DashboardLayoutContent = ({
  children,
  currentModule = "Dashboard",
  userName,
  userRole = "System Admin",
  userAvatar,
}: DashboardLayoutProps) => {
  const { user, signOut, isDevelopmentUser, useDevelopmentUser } = useAuth();
  const navigate = useNavigate();
  const { direction } = useLanguage();
  const { selectedModule, isSubSidebarOpen } = useSidebar();

  // Use user data from auth context if not provided as props
  const displayName = userName || user?.user_metadata?.full_name || "User";
  const avatarUrl =
    userAvatar ||
    user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const role = userRole || user?.user_metadata?.role || "System Admin";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [rtl, setRtl] = useState(direction === "rtl");
  const {
    isAIAssistantOpen,
    currentPrompt,
    toggleAIAssistant,
    closeAIAssistant,
    setCurrentModule,
  } = useAI();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchValue, setSearchValue] = useState("");

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set initial theme based on user preference
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }

    // Set RTL direction
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleDirection = () => {
    setRtl(!rtl);
    document.documentElement.dir = rtl ? "ltr" : "rtl";
  };

  // Update current module in AI context when it changes
  useEffect(() => {
    setCurrentModule(currentModule);
  }, [currentModule, setCurrentModule]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchValue);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-background dark:bg-gray-950 ${darkMode ? "dark" : ""} ${rtl ? "rtl" : "ltr"}`}
      dir={rtl ? "rtl" : "ltr"}
    >
      <StagingEnvironmentNotice />

      {/* Main Content Wrapper */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Sidebar */}
        <div className="flex transition-all duration-300">
          <div className="transition-all duration-300">
            <MainSidebar
              collapsed={sidebarCollapsed || isSubSidebarOpen}
              onToggleCollapse={toggleSidebar}
            />
          </div>
          {isSubSidebarOpen && (
            <div className="transition-all duration-300">
              <SubSidebar />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary">
                  {currentModule}
                </h1>
                <Badge className="ml-2 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {rtl ? "نسخة 1.0" : "v1.0"}
                </Badge>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400",
                    rtl ? "right-3" : "left-3",
                  )}
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  placeholder={
                    rtl ? "بحث في كل شيء..." : "Search everything..."
                  }
                  className={cn(
                    "py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-9 w-full shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none",
                    rtl ? "pr-10 pl-4" : "pl-10 pr-4",
                  )}
                />
              </form>
            </div>

            <div
              className={cn(
                "flex items-center",
                rtl ? "space-x-1 space-x-reverse" : "space-x-1",
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-gray-500 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full"
                    >
                      {darkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {darkMode
                      ? rtl
                        ? "التبديل إلى الوضع الفاتح"
                        : "Switch to Light Mode"
                      : rtl
                        ? "التبديل إلى الوضع الداكن"
                        : "Switch to Dark Mode"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDirection}
                      className="text-gray-500 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full"
                    >
                      <Globe className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {rtl
                      ? "التبديل إلى اليسار لليمين"
                      : "Switch to Right-to-Left"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 relative rounded-full"
                    >
                      <Calendar className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {rtl ? "التقويم" : "Calendar"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 relative rounded-full"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {rtl ? "الرسائل" : "Messages"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 relative rounded-full"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                        3
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {rtl ? "الإشعارات" : "Notifications"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{rtl ? "المساعدة" : "Help"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center space-x-2 rounded-full",
                      rtl ? "space-x-reverse mr-2" : "ml-2",
                    )}
                  >
                    <Avatar className="border-2 border-primary/20 h-9 w-9 ring-2 ring-white dark:ring-gray-800">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={rtl ? "start" : "end"}
                  className="w-56 p-2"
                >
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="font-medium text-sm">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer rounded-md">
                    <User className={cn("h-4 w-4", rtl ? "ml-2" : "mr-2")} />
                    <span>{rtl ? "الملف الشخصي" : "Profile"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-md">
                    <Settings
                      className={cn("h-4 w-4", rtl ? "ml-2" : "mr-2")}
                    />
                    <span>{rtl ? "الإعدادات" : "Settings"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isDevelopmentUser ? (
                    <DropdownMenuItem
                      className="cursor-pointer text-amber-600 rounded-md"
                      onClick={async () => {
                        await signOut();
                        navigate("/login");
                      }}
                    >
                      <LogOut
                        className={cn("h-4 w-4", rtl ? "ml-2" : "mr-2")}
                      />
                      <span>{rtl ? "إنهاء وضع المطور" : "Exit Dev Mode"}</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive rounded-md"
                      onClick={async () => {
                        await signOut();
                        navigate("/login");
                      }}
                    >
                      <LogOut
                        className={cn("h-4 w-4", rtl ? "ml-2" : "mr-2")}
                      />
                      <span>{rtl ? "تسجيل الخروج" : "Logout"}</span>
                    </DropdownMenuItem>
                  )}
                  {!user && (
                    <DropdownMenuItem
                      className="cursor-pointer text-emerald-600 rounded-md"
                      onClick={() => {
                        useDevelopmentUser();
                      }}
                    >
                      <User className={cn("h-4 w-4", rtl ? "ml-2" : "mr-2")} />
                      <span>
                        {rtl ? "استخدام حساب المطور" : "Use Dev Account"}
                      </span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6 bg-background dark:bg-gray-950">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {currentModule}
                  </h1>
                  <Badge className="ml-3 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40">
                    {rtl ? "نسخة 1.0" : "v1.0"}
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {rtl ? "مرحباً بك، " : "Welcome back, "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {displayName}
                  </span>
                  . {rtl ? "هذه نظرة عامة على " : "Here's an overview of "}
                  <span className="text-primary">{currentModule}</span>.
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-3 shadow-sm",
                  rtl ? "text-right" : "text-left",
                )}
              >
                <div className="h-10 w-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentTime.toLocaleDateString(rtl ? "ar-SA" : "en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                  <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {currentTime.toLocaleTimeString(rtl ? "ar-SA" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div
        className={cn(
          "fixed bottom-4 z-50",
          rtl ? "left-4" : "right-4",
          isAIAssistantOpen ? "block" : "hidden",
        )}
      >
        <AIAssistantPanel
          onClose={closeAIAssistant}
          currentSystem={currentModule}
          initialPrompt={currentPrompt || undefined}
        />
      </div>

      {/* AI Assistant Button (Fixed Position) */}
      <div className={cn("fixed bottom-4 z-40", rtl ? "left-4" : "right-4")}>
        <Button
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105"
          onClick={toggleAIAssistant}
        >
          {isAIAssistantOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Feedback Button */}
      <FeedbackButton currentModule={currentModule} position="bottom-left" />
    </div>
  );
};

export default DashboardLayoutWithContext;

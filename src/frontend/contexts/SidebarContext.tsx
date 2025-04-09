import React, { createContext, useContext, useState } from "react";

type ModuleName =
  | "Dashboard"
  | "Store"
  | "Accounting"
  | "Marketing"
  | "Analytics"
  | "Customers"
  | "Documents"
  | "Integrations"
  | "Developer"
  | "Settings";

interface SidebarContextType {
  selectedModule: ModuleName | null;
  isSubSidebarOpen: boolean;
  setSelectedModule: (module: ModuleName | null) => void;
  openSubSidebar: (module: ModuleName) => void;
  closeSubSidebar: () => void;
  toggleSubSidebar: (module: ModuleName) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [selectedModule, setSelectedModule] = useState<ModuleName | null>(null);
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState<boolean>(false);

  const openSubSidebar = (module: ModuleName) => {
    setSelectedModule(module);
    setIsSubSidebarOpen(true);
  };

  const closeSubSidebar = () => {
    setIsSubSidebarOpen(false);
  };

  const toggleSubSidebar = (module: ModuleName) => {
    if (selectedModule === module && isSubSidebarOpen) {
      closeSubSidebar();
    } else {
      openSubSidebar(module);
    }
  };

  const value = {
    selectedModule,
    isSubSidebarOpen,
    setSelectedModule,
    openSubSidebar,
    closeSubSidebar,
    toggleSubSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

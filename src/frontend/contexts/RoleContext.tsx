import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

// Define role types
export type UserRole = "admin" | "manager" | "editor" | "viewer" | "user";

// Define module access permissions
export interface ModulePermissions {
  [module: string]: UserRole[];
}

// Define the context type
type RoleContextType = {
  userRoles: UserRole[];
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessModule: (module: string) => boolean;
  fetchUserRoles: () => Promise<void>;
};

// Default module permissions
const defaultModulePermissions: ModulePermissions = {
  Dashboard: ["admin", "manager", "editor", "viewer", "user"],
  Store: ["admin", "manager", "editor", "user"],
  Storefront: ["admin", "manager", "editor", "user"],
  Accounting: ["admin", "manager"],
  Marketing: ["admin", "manager", "editor"],
  "Customer Service": ["admin", "manager", "editor", "viewer"],
  Analytics: ["admin", "manager", "viewer"],
  Customers: ["admin", "manager", "editor", "viewer"],
  Documents: ["admin", "manager", "editor"],
  Documentation: ["admin", "manager", "editor", "viewer", "user"],
  "Help Center": ["admin", "manager", "editor", "viewer", "user"],
  Integrations: ["admin", "manager"],
  Developer: ["admin"],
  Settings: ["admin", "manager"],
};

// Create the context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Create the provider component
export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user roles from Supabase
  const fetchUserRoles = async () => {
    if (!user) {
      setUserRoles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // For development user, assign admin role
      if (user.email === "dev@wemarka.com") {
        setUserRoles(["admin"]);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        throw error;
      }

      // If no roles are assigned, default to 'user'
      if (!data || data.length === 0) {
        setUserRoles(["user"]);
      } else {
        setUserRoles(data.map((item) => item.role as UserRole));
      }
    } catch (error) {
      console.error("Error in fetchUserRoles:", error);
      // Default to user role on error
      setUserRoles(["user"]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };

  // Check if user can access a specific module
  const canAccessModule = (module: string): boolean => {
    const allowedRoles = defaultModulePermissions[module] || [];
    return hasAnyRole(allowedRoles);
  };

  // Fetch roles when user changes
  useEffect(() => {
    fetchUserRoles();
  }, [user]);

  // Context value
  const value = {
    userRoles,
    isLoading,
    hasRole,
    hasAnyRole,
    canAccessModule,
    fetchUserRoles,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

// Custom hook to use the role context
export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

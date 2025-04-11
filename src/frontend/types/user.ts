/**
 * User role type
 */
export type UserRole =
  | "user"
  | "admin"
  | "superadmin"
  | "staff"
  | "developer"
  | "support"
  | "premium";

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  createdAt: string;
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  userId: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  company?: string;
  position?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt?: string;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  displayMode: "compact" | "comfortable";
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User | null;
  session: any | null;
  error: any | null;
}

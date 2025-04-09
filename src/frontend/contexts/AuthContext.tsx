import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/backend/services/authService";
import { Session, User, Provider } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isDevelopmentUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    userData?: object,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  updateUserProfile: (userData: object) => Promise<{ error: Error | null }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: Error | null }>;
  useDevelopmentUser: () => void;
};

// Default development user
const developmentUser: User = {
  id: "dev-user-id",
  app_metadata: {},
  user_metadata: {
    full_name: "مطور النظام",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser",
    role: "مطور",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email: "dev@wemarka.com",
  phone: "",
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: "",
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  banned_until: null,
  reauthentication_token: null,
  reauthentication_sent_at: null,
  confirmation_token: "",
  recovery_token: "",
  email_change_token_new: "",
  email_change: "",
  email_change_token_current: "",
  email_change_confirm_status: 0,
  invited_at: null,
  action_link: "",
  factors: null,
  confirmation_sent_at: new Date().toISOString(),
  recovery_sent_at: null,
  email_change_sent_at: null,
  identities: null,
  factors_sent_at: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevelopmentUser, setIsDevelopmentUser] = useState(false);

  useEffect(() => {
    // Check if we're using development user
    const usingDevUser = localStorage.getItem("usingDevUser") === "true";

    if (usingDevUser) {
      setUser(developmentUser);
      setIsDevelopmentUser(true);
      setIsLoading(false);
      return;
    }

    // Get initial session
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await authService.signIn(email, password);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    try {
      const { error } = await authService.signUp(email, password, userData);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await authService.signOut();
    // Clear any local storage items related to auth
    localStorage.removeItem("wasLoggedIn");
    // Reset development user state
    setIsDevelopmentUser(false);
    setUser(null);
  };

  const useDevelopmentUser = () => {
    setUser(developmentUser);
    setIsDevelopmentUser(true);
    localStorage.setItem("usingDevUser", "true");
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await authService.updatePassword(password);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateUserProfile = async (userData: object) => {
    try {
      const { error } = await authService.updateUserProfile(userData);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { error } = await authService.signInWithProvider(provider);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isDevelopmentUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateUserProfile,
    signInWithProvider,
    useDevelopmentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

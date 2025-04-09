import { supabase } from "@/backend/lib/supabase";
import { Provider } from "@supabase/supabase-js";

export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  signUp: async (email: string, password: string, userData?: object) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  updatePassword: async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  updateUserProfile: async (userData: object) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  signInWithProvider: async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

import { supabase } from "@/lib/supabase";
import { User, UserRole } from "@/frontend/types/user";

/**
 * Service for managing users
 */
export const userService = {
  /**
   * Get the current user
   */
  getCurrentUser: async (): Promise<{ data: User | null; error: any }> => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching current user:", error);
        return { data: null, error };
      }

      if (!user) {
        return { data: null, error: null };
      }

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
      }

      const userWithRoles: User = {
        id: user.id,
        email: user.email || "",
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        roles: roles?.map((r) => r.role as UserRole) || [],
        createdAt: user.created_at,
      };

      return { data: userWithRoles, error: null };
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return { data: null, error };
    }
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (): Promise<{ data: User[]; error: any }> => {
    try {
      // First check if the current user is an admin
      const { data: currentUser, error: currentUserError } =
        await userService.getCurrentUser();

      if (currentUserError) {
        return { data: [], error: currentUserError };
      }

      if (
        !currentUser ||
        !currentUser.roles.some((role) =>
          ["admin", "superadmin"].includes(role),
        )
      ) {
        return {
          data: [],
          error: { message: "Unauthorized. Admin access required." },
        };
      }

      // Get all users from auth.users
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) {
        console.error("Error fetching users:", authError);
        return { data: [], error: authError };
      }

      // Get all user roles
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        return { data: [], error: rolesError };
      }

      // Map auth users to our User type with roles
      const users: User[] = authUsers.users.map((authUser) => {
        const userRoles =
          allRoles
            ?.filter((r) => r.user_id === authUser.id)
            .map((r) => r.role as UserRole) || [];

        return {
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          roles: userRoles,
          createdAt: authUser.created_at,
        };
      });

      return { data: users, error: null };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return { data: [], error };
    }
  },

  /**
   * Get a user by ID (admin only)
   */
  getUserById: async (
    id: string,
  ): Promise<{ data: User | null; error: any }> => {
    try {
      // First check if the current user is an admin
      const { data: currentUser, error: currentUserError } =
        await userService.getCurrentUser();

      if (currentUserError) {
        return { data: null, error: currentUserError };
      }

      if (
        !currentUser ||
        !currentUser.roles.some((role) =>
          ["admin", "superadmin"].includes(role),
        )
      ) {
        return {
          data: null,
          error: { message: "Unauthorized. Admin access required." },
        };
      }

      // Get the user from auth.users
      const { data: authUser, error: authError } =
        await supabase.auth.admin.getUserById(id);

      if (authError || !authUser) {
        console.error(`Error fetching user with ID ${id}:`, authError);
        return { data: null, error: authError };
      }

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", id);

      if (rolesError) {
        console.error(
          `Error fetching roles for user with ID ${id}:`,
          rolesError,
        );
        return { data: null, error: rolesError };
      }

      const user: User = {
        id: authUser.user.id,
        email: authUser.user.email || "",
        firstName: authUser.user.user_metadata?.first_name || "",
        lastName: authUser.user.user_metadata?.last_name || "",
        roles: roles?.map((r) => r.role as UserRole) || [],
        createdAt: authUser.user.created_at,
      };

      return { data: user, error: null };
    } catch (error) {
      console.error(`Error in getUserById for ID ${id}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Update a user's profile
   */
  updateUserProfile: async (updates: {
    firstName?: string;
    lastName?: string;
  }): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: updates.firstName,
          last_name: updates.lastName,
        },
      });

      if (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      return { success: false, error };
    }
  },

  /**
   * Assign a role to a user (admin only)
   */
  assignRole: async (
    userId: string,
    role: UserRole,
  ): Promise<{ success: boolean; error: any }> => {
    try {
      // First check if the current user is an admin
      const { data: currentUser, error: currentUserError } =
        await userService.getCurrentUser();

      if (currentUserError) {
        return { success: false, error: currentUserError };
      }

      if (
        !currentUser ||
        !currentUser.roles.some((r) => ["admin", "superadmin"].includes(r))
      ) {
        return {
          success: false,
          error: { message: "Unauthorized. Admin access required." },
        };
      }

      // Check if the role already exists for this user
      const { data: existingRole, error: checkError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", role)
        .maybeSingle();

      if (checkError) {
        console.error(
          `Error checking existing role for user ${userId}:`,
          checkError,
        );
        return { success: false, error: checkError };
      }

      // If role already exists, no need to add it again
      if (existingRole) {
        return { success: true, error: null };
      }

      // Add the role
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
      });

      if (error) {
        console.error(`Error assigning role ${role} to user ${userId}:`, error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error(
        `Error in assignRole for user ${userId} and role ${role}:`,
        error,
      );
      return { success: false, error };
    }
  },

  /**
   * Remove a role from a user (admin only)
   */
  removeRole: async (
    userId: string,
    role: UserRole,
  ): Promise<{ success: boolean; error: any }> => {
    try {
      // First check if the current user is an admin
      const { data: currentUser, error: currentUserError } =
        await userService.getCurrentUser();

      if (currentUserError) {
        return { success: false, error: currentUserError };
      }

      if (
        !currentUser ||
        !currentUser.roles.some((r) => ["admin", "superadmin"].includes(r))
      ) {
        return {
          success: false,
          error: { message: "Unauthorized. Admin access required." },
        };
      }

      // Remove the role
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) {
        console.error(
          `Error removing role ${role} from user ${userId}:`,
          error,
        );
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error(
        `Error in removeRole for user ${userId} and role ${role}:`,
        error,
      );
      return { success: false, error };
    }
  },

  /**
   * Check if a user has a specific role
   */
  hasRole: async (
    role: UserRole,
  ): Promise<{ hasRole: boolean; error: any }> => {
    try {
      const { data: currentUser, error } = await userService.getCurrentUser();

      if (error) {
        return { hasRole: false, error };
      }

      if (!currentUser) {
        return { hasRole: false, error: null };
      }

      return { hasRole: currentUser.roles.includes(role), error: null };
    } catch (error) {
      console.error(`Error in hasRole for role ${role}:`, error);
      return { hasRole: false, error };
    }
  },

  /**
   * Track user activity
   */
  trackActivity: async (
    eventType: string,
    eventData: any,
    module: string,
  ): Promise<{ success: boolean; error: any }> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "Error getting current user for activity tracking:",
          userError,
        );
        return { success: false, error: userError };
      }

      const { error } = await supabase.from("user_analytics").insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
        module: module,
      });

      if (error) {
        console.error("Error tracking user activity:", error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in trackActivity:", error);
      return { success: false, error };
    }
  },
};

export default userService;

import { supabase } from "@/lib/supabase";
import { UserRole } from "@/frontend/contexts/RoleContext";

/**
 * Fetch roles for a specific user
 */
export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) throw error;

    // If no roles found, return default user role
    if (!data || data.length === 0) {
      return ["user"];
    }

    return data.map((item) => item.role as UserRole);
  } catch (error) {
    console.error("Error fetching user roles:", error);
    // Default to user role on error
    return ["user"];
  }
};

/**
 * Assign a role to a user
 */
export const assignUserRole = async (
  userId: string,
  role: UserRole,
): Promise<boolean> => {
  try {
    // Check if the role already exists for this user
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", role)
      .single();

    // If role already exists, no need to add it again
    if (existingRole) return true;

    // Add the new role
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error assigning user role:", error);
    return false;
  }
};

/**
 * Remove a role from a user
 */
export const removeUserRole = async (
  userId: string,
  role: UserRole,
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing user role:", error);
    return false;
  }
};

/**
 * Check if a user has a specific role
 */
export const hasRole = async (
  userId: string,
  role: UserRole,
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", role)
      .single();

    if (error) return false;
    return !!data;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

/**
 * Get all users with a specific role
 */
export const getUsersByRole = async (role: UserRole): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", role);

    if (error) throw error;
    return data.map((item) => item.user_id);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return [];
  }
};

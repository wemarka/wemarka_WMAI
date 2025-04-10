import { supabase } from "@/lib/supabase";
import { Role, Permission, ModuleAction } from "../types";

/**
 * Fetches all roles from the database
 */
export const fetchRoles = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }

  return data.map((role) => ({
    id: role.id,
    name: role.name,
    type: role.type,
    description: role.description,
    isDefault: role.is_default,
  }));
};

/**
 * Creates a new role in the database
 */
export const createRole = async (role: Omit<Role, "id">): Promise<Role> => {
  const { data, error } = await supabase
    .from("roles")
    .insert({
      name: role.name,
      type: role.type,
      description: role.description,
      is_default: role.isDefault,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating role:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    description: data.description,
    isDefault: data.is_default,
  };
};

/**
 * Updates an existing role in the database
 */
export const updateRole = async (role: Role): Promise<Role> => {
  const { data, error } = await supabase
    .from("roles")
    .update({
      name: role.name,
      type: role.type,
      description: role.description,
      is_default: role.isDefault,
      updated_at: new Date().toISOString(),
    })
    .eq("id", role.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating role:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    description: data.description,
    isDefault: data.is_default,
  };
};

/**
 * Deletes a role from the database
 */
export const deleteRole = async (id: string): Promise<void> => {
  // First delete all permissions associated with this role
  const { error: permissionsError } = await supabase
    .from("permissions")
    .delete()
    .eq("role_id", id);

  if (permissionsError) {
    console.error("Error deleting role permissions:", permissionsError);
    throw permissionsError;
  }

  // Then delete the role
  const { error } = await supabase.from("roles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

/**
 * Fetches all permissions for a specific role
 */
export const fetchPermissions = async (
  roleId: string,
): Promise<Permission[]> => {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .eq("role_id", roleId);

  if (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }

  return data.map((permission) => ({
    id: permission.id,
    roleId: permission.role_id,
    module: permission.module,
    action: permission.action,
    allowed: permission.allowed,
  }));
};

/**
 * Saves permissions for a role by deleting existing ones and inserting new ones
 */
export const savePermissions = async (
  permissions: Omit<Permission, "id">[],
): Promise<void> => {
  // First delete existing permissions for this role
  if (permissions.length > 0) {
    const roleId = permissions[0].roleId;
    const { error: deleteError } = await supabase
      .from("permissions")
      .delete()
      .eq("role_id", roleId);

    if (deleteError) {
      console.error("Error deleting existing permissions:", deleteError);
      throw deleteError;
    }
  }

  // Then insert new permissions
  if (permissions.length > 0) {
    const { error: insertError } = await supabase.from("permissions").insert(
      permissions.map((p) => ({
        role_id: p.roleId,
        module: p.module,
        action: p.action,
        allowed: p.allowed,
      })),
    );

    if (insertError) {
      console.error("Error saving permissions:", insertError);
      throw insertError;
    }
  }
};

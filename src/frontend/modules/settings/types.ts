// Define types for roles and permissions management

export type RoleType = "superadmin" | "admin" | "agent" | "viewer";

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  description: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  roleId: string;
  module: string;
  action: string;
  allowed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleAction {
  module: string;
  action: string;
  description: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface PermissionMatrix {
  modules: string[];
  actions: Record<string, string[]>;
  permissions: Record<string, Record<string, boolean>>;
}

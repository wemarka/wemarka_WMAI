# Wemarka WMAI Role System

## Overview

Wemarka WMAI implements a comprehensive role-based access control (RBAC) system to manage user permissions across different modules of the application. This document outlines the available roles, their permissions, and how the role system is implemented.

## Role Types

The system defines several role types with different levels of access:

### Default System Roles

1. **Super Admin**
   - Type: `superadmin`
   - Description: Full access to all modules and actions
   - Default: Yes

2. **Admin**
   - Type: `admin`
   - Description: Administrative access with some restrictions
   - Default: Yes

3. **Agent**
   - Type: `agent`
   - Description: Access to customer-facing modules
   - Default: Yes

4. **Viewer**
   - Type: `viewer`
   - Description: Read-only access to most modules
   - Default: Yes

5. **User**
   - Type: `user`
   - Description: Basic access to user-facing modules
   - Default: Assigned when no other roles are present

## Module Access by Role

The following table outlines which roles can access which modules:

| Module | Super Admin | Admin | Manager | Editor | Viewer | User |
|--------|-------------|-------|---------|--------|--------|------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Store | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Storefront | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Accounting | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Marketing | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Customer Service | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| User Analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Customers | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Documents | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Documentation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Help Center | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Developer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## Permission Matrix

Each module has specific actions that can be performed. Permissions are assigned at the role-action level:

### Dashboard Module

| Action | Description | Super Admin | Admin | Manager | Editor | Viewer | User |
|--------|-------------|-------------|-------|---------|--------|--------|------|
| view | View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| edit | Edit dashboard widgets | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

### Store Module

| Action | Description | Super Admin | Admin | Manager | Editor | Viewer | User |
|--------|-------------|-------------|-------|---------|--------|--------|------|
| view | View store data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| edit | Edit store data | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| delete | Delete store items | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### Accounting Module

| Action | Description | Super Admin | Admin | Manager | Editor | Viewer | User |
|--------|-------------|-------------|-------|---------|--------|--------|------|
| view | View accounting data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| edit | Edit accounting data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### Marketing Module

| Action | Description | Super Admin | Admin | Manager | Editor | Viewer | User |
|--------|-------------|-------------|-------|---------|--------|--------|------|
| view | View marketing campaigns | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| edit | Edit marketing campaigns | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

### Settings Module

| Action | Description | Super Admin | Admin | Manager | Editor | Viewer | User |
|--------|-------------|-------------|-------|---------|--------|--------|------|
| view | View settings | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| edit | Edit settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Implementation Details

### Role Context

The role system is implemented using React Context in `src/frontend/contexts/RoleContext.tsx`. This context provides:

- Current user roles
- Functions to check role permissions
- Functions to check module access

### Database Schema

Roles and permissions are stored in the following Supabase tables:

- `roles`: Defines available roles
- `user_roles`: Associates users with roles
- `permissions`: Defines permissions for each role-module-action combination

### Role-Based Component

The application includes a `RoleBasedComponent` that conditionally renders content based on user roles:

```tsx
<RoleBasedComponent allowedRoles={['admin', 'manager']}>
  <AdminContent />
</RoleBasedComponent>
```

### Role Management

Administrators can manage roles and permissions through the Role Management Panel in the Settings module. This interface allows:

- Creating new roles
- Editing existing roles
- Assigning permissions to roles
- Deleting custom roles

## Default Module Permissions

The system defines default module permissions in the `RoleContext`:

```typescript
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
```

## Role Assignment

Roles are assigned to users in the following ways:

1. **Default Role**: New users are assigned the "user" role by default
2. **Development Role**: Users with the email "dev@wemarka.com" are automatically assigned the "admin" role
3. **Manual Assignment**: Administrators can assign roles to users through the user management interface

## Best Practices

1. **Principle of Least Privilege**: Users should be given the minimum level of access required for their job function
2. **Role Separation**: Create distinct roles for different job functions
3. **Regular Audits**: Periodically review role assignments and permissions
4. **Custom Roles**: Create custom roles for specific business needs rather than modifying default roles

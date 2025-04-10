import React, { ReactNode } from "react";
import { useRole, UserRole } from "@/frontend/contexts/RoleContext";

interface RoleBasedComponentProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on user roles
 * @param children The content to render if the user has the required role
 * @param allowedRoles Array of roles that are allowed to see the content
 * @param fallback Optional content to render if the user doesn't have the required role
 */
const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const { hasAnyRole, isLoading } = useRole();

  // While loading, don't render anything
  if (isLoading) {
    return null;
  }

  // If user has any of the allowed roles, render children
  if (hasAnyRole(allowedRoles)) {
    return <>{children}</>;
  }

  // Otherwise, render fallback content
  return <>{fallback}</>;
};

export default RoleBasedComponent;

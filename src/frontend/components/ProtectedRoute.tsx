import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useRole } from "@/frontend/contexts/RoleContext";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requiredModule?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  requiredModule,
}: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { canAccessModule, isLoading: roleLoading } = useRole();
  const location = useLocation();
  const isLoading = authLoading || roleLoading;

  // Show loading state while checking authentication and roles
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse-subtle text-primary">
          <svg
            className="animate-spin h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If module access is required but user doesn't have permission
  if (requiredModule && !canAccessModule(requiredModule)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If authenticated and has required role, render children
  return <>{children}</>;
}

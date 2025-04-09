import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/frontend/contexts/AuthContext";

/**
 * Component to check for session expiration and handle auth state changes
 * This should be placed at the root of the application
 */
export default function AuthSessionCheck() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for session expiration
    const checkSession = () => {
      // If user was previously logged in but now isn't, redirect to login
      const wasLoggedIn = localStorage.getItem("wasLoggedIn");
      if (wasLoggedIn === "true" && !user && !isLoading) {
        navigate("/login?message=session_expired");
        localStorage.removeItem("wasLoggedIn");
      }

      // Update logged in status
      if (user) {
        localStorage.setItem("wasLoggedIn", "true");
      }
    };

    checkSession();

    // Set up interval to periodically check session
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, isLoading, navigate]);

  return null; // This component doesn't render anything
}

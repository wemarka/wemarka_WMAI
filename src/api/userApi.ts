import { userService } from "@/frontend/services/userService";
import { UserRole } from "@/frontend/types/user";

/**
 * API handlers for user operations
 */
export const userApi = {
  /**
   * Get the current user
   */
  getCurrentUser: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } = await req.supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { data, error } = await userService.getCurrentUser();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in getCurrentUser API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } = await req.supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has admin role
      const { data: roles } = await req.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id);

      const isAdmin = roles?.some(r => ['admin', 'superadmin'].includes(r.role));

      if (!isAdmin) {
        return res.status(403).json({ error: "Forbidden. Admin access required." });
      }

      const { data, error } = await userService.getAllUsers();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in getAllUsers API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get a user by ID (admin only)
   */
  getUserById: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } = await req.supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has admin role
      const { data: roles } = await req.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id);

      const isAdmin = roles?.some(r => ['admin', 'superadmin'].includes(r.role));

      if (!isAdmin) {
        return res.status(403).json({ error: "Forbidden. Admin access required." });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const { data, error } = await userService.getUserById(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res
import { storeService } from "@/frontend/services/storeService";
import { Product } from "@/frontend/types/store";

/**
 * API handlers for store operations
 */
export const storeApi = {
  /**
   * Get all products
   */
  getProducts: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } =
        await req.supabase.auth.getSession();

      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { data, error } = await storeService.getProducts();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in getProducts API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get a product by ID
   */
  getProductById: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } =
        await req.supabase.auth.getSession();

      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const { data, error } = await storeService.getProductById(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in getProductById API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Create a new product
   */
  createProduct: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } =
        await req.supabase.auth.getSession();

      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has admin or staff role
      const { data: roles } = await req.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id);

      const isAuthorized = roles?.some((r) =>
        ["admin", "superadmin", "staff"].includes(r.role),
      );

      if (!isAuthorized) {
        return res
          .status(403)
          .json({ error: "Forbidden. Insufficient permissions." });
      }

      const productData = req.body;

      // Validate required fields
      if (!productData.name || !productData.price || !productData.category) {
        return res
          .status(400)
          .json({ error: "Name, price, and category are required" });
      }

      const { data, error } = await storeService.createProduct(productData);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error: any) {
      console.error("Error in createProduct API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Update an existing product
   */
  updateProduct: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } =
        await req.supabase.auth.getSession();

      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has admin or staff role
      const { data: roles } = await req.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id);

      const isAuthorized = roles?.some((r) =>
        ["admin", "superadmin", "staff"].includes(r.role),
      );

      if (!isAuthorized) {
        return res
          .status(403)
          .json({ error: "Forbidden. Insufficient permissions." });
      }

      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const { data, error } = await storeService.updateProduct(id, updates);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in updateProduct API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Delete a product
   */
  deleteProduct: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } =
        await req.supabase.auth.getSession();

      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has admin or staff role
      const { data: roles } = await req.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id);

      const isAuthorized = roles?.some((r) =>
        ["admin", "superadmin", "staff"].includes(r.role),
      );

      if (!isAuthorized) {
        return res
          .status(403)
          .json({ error: "Forbidden. Insufficient permissions." });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const { success, error } = await storeService.deleteProduct(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Error in deleteProduct API:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Search products
   */
  searchProducts: async (req: any, res: any) => {
    try {
      // Validate user session
      const { data: session, error: sessionError } =
        await req.supabase.auth.getSession();

      if (sessionError || !session.session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const { data, error } = await storeService.searchProducts(query);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in searchProducts API:", error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default storeApi;

import { supabase } from "@/lib/supabase";
import { Invoice, InvoiceItem } from "@/frontend/types/invoice";

/**
 * Service for managing invoices
 */
export const invoiceService = {
  /**
   * Get all invoices
   */
  getInvoices: async (): Promise<{ data: Invoice[]; error: any }> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting current user:", userError);
        return { data: [], error: userError };
      }

      if (!user) {
        return { data: [], error: { message: "User not authenticated" } };
      }

      // Check if user has admin role to get all invoices
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        return { data: [], error: rolesError };
      }

      const isAdmin = roles?.some((r) =>
        ["admin", "superadmin", "staff"].includes(r.role),
      );

      let query = supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      // If not admin, only show user's own invoices
      if (!isAdmin) {
        query = query.eq("customer_id", user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching invoices:", error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error in getInvoices:", error);
      return { data: [], error };
    }
  },

  /**
   * Get an invoice by ID
   */
  getInvoiceById: async (
    id: string,
  ): Promise<{ data: Invoice | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching invoice with ID ${id}:`, error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Error in getInvoiceById for ID ${id}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Create a new invoice
   */
  createInvoice: async (
    invoice: Omit<Invoice, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Invoice | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert(invoice)
        .select()
        .single();

      if (error) {
        console.error("Error creating invoice:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in createInvoice:", error);
      return { data: null, error };
    }
  },

  /**
   * Update an existing invoice
   */
  updateInvoice: async (
    id: string,
    updates: Partial<Invoice>,
  ): Promise<{ data: Invoice | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating invoice with ID ${id}:`, error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Error in updateInvoice for ID ${id}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Delete an invoice
   */
  deleteInvoice: async (
    id: string,
  ): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);

      if (error) {
        console.error(`Error deleting invoice with ID ${id}:`, error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error(`Error in deleteInvoice for ID ${id}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Get invoices by status
   */
  getInvoicesByStatus: async (
    status: string,
  ): Promise<{ data: Invoice[]; error: any }> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting current user:", userError);
        return { data: [], error: userError };
      }

      if (!user) {
        return { data: [], error: { message: "User not authenticated" } };
      }

      // Check if user has admin role to get all invoices
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        return { data: [], error: rolesError };
      }

      const isAdmin = roles?.some((r) =>
        ["admin", "superadmin", "staff"].includes(r.role),
      );

      let query = supabase
        .from("invoices")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      // If not admin, only show user's own invoices
      if (!isAdmin) {
        query = query.eq("customer_id", user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching invoices with status ${status}:`, error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error(
        `Error in getInvoicesByStatus for status ${status}:`,
        error,
      );
      return { data: [], error };
    }
  },

  /**
   * Mark an invoice as paid
   */
  markAsPaid: async (id: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", id);

      if (error) {
        console.error(`Error marking invoice ${id} as paid:`, error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error(`Error in markAsPaid for invoice ${id}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Subscribe to invoice changes
   */
  subscribeToInvoices: (callback: (payload: any) => void) => {
    const subscription = supabase
      .channel("invoices_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices" },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },
};

export default invoiceService;

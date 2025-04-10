import { supabase } from "@/lib/supabase";

export type Invoice = {
  id: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue" | "draft";
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Payroll = {
  id: string;
  employee: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

// Invoices
export const fetchInvoices = async () => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchInvoice = async (id: string) => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createInvoice = async (
  invoice: Omit<Invoice, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      ...invoice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
  const { data, error } = await supabase
    .from("invoices")
    .update({
      ...invoice,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteInvoice = async (id: string) => {
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) throw error;
  return true;
};

// Payrolls
export const fetchPayrolls = async () => {
  const { data, error } = await supabase
    .from("payrolls")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchPayroll = async (id: string) => {
  const { data, error } = await supabase
    .from("payrolls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createPayroll = async (
  payroll: Omit<Payroll, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("payrolls")
    .insert({
      ...payroll,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePayroll = async (id: string, payroll: Partial<Payroll>) => {
  const { data, error } = await supabase
    .from("payrolls")
    .update({
      ...payroll,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePayroll = async (id: string) => {
  const { error } = await supabase.from("payrolls").delete().eq("id", id);

  if (error) throw error;
  return true;
};

// Subscribe to real-time changes
export const subscribeToInvoices = (callback: (payload: any) => void) => {
  return supabase
    .channel("invoices-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "invoices" },
      callback,
    )
    .subscribe();
};

export const subscribeToPayrolls = (callback: (payload: any) => void) => {
  return supabase
    .channel("payrolls-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "payrolls" },
      callback,
    )
    .subscribe();
};

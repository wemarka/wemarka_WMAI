import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

export type Product = Tables<"products">;
export type Order = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
};

// Products
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createProduct = async (
  product: Omit<Product, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from("products")
    .update({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
  return true;
};

// Orders
export const fetchOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchOrder = async (id: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (order: Omit<Order, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrder = async (id: string, order: Partial<Order>) => {
  const { data, error } = await supabase
    .from("orders")
    .update(order)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteOrder = async (id: string) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw error;
  return true;
};

// Subscribe to real-time changes
export const subscribeToProducts = (callback: (payload: any) => void) => {
  return supabase
    .channel("products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      callback,
    )
    .subscribe();
};

export const subscribeToOrders = (callback: (payload: any) => void) => {
  return supabase
    .channel("orders-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      callback,
    )
    .subscribe();
};

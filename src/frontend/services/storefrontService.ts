import { supabase } from "@/lib/supabase";
import { Product, Order, OrderItem } from "./storeService";

// Cart type definition
export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
};

export type Cart = {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at?: string;
  updated_at?: string;
};

// Fetch products for storefront (public facing)
export const fetchStorefrontProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0) // Only show products in stock
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchStorefrontProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Cart operations
export const fetchCart = async (userId: string) => {
  const { data, error } = await supabase
    .from("carts")
    .select("*, items:cart_items(*, product:products(*))")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is "No rows found"
  return data;
};

export const createCart = async (userId: string) => {
  const { data, error } = await supabase
    .from("carts")
    .insert({
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addToCart = async (cartId: string, item: Omit<CartItem, "id">) => {
  // Check if item already exists in cart
  const { data: existingItems, error: fetchError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", item.product_id);

  if (fetchError) throw fetchError;

  if (existingItems && existingItems.length > 0) {
    // Update existing item
    const existingItem = existingItems[0];
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + item.quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Add new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeCartItem = async (itemId: string) => {
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) throw error;
  return true;
};

export const clearCart = async (cartId: string) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (error) throw error;
  return true;
};

// Checkout process
export const createOrder = async (
  userId: string,
  items: CartItem[],
  totalAmount: number,
) => {
  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      amount: totalAmount,
      status: "pending",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Update product stock
  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (product) {
      await supabase
        .from("products")
        .update({
          stock: Math.max(0, product.stock - item.quantity),
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.product_id);
    }
  }

  // Clear the cart
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cart) {
    await clearCart(cart.id);
  }

  return order;
};

// Subscribe to real-time changes
export const subscribeToStorefrontProducts = (
  callback: (payload: any) => void,
) => {
  return supabase
    .channel("storefront-products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      callback,
    )
    .subscribe();
};

export const subscribeToCart = (
  cartId: string,
  callback: (payload: any) => void,
) => {
  return supabase
    .channel(`cart-${cartId}-changes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
        filter: `cart_id=eq.${cartId}`,
      },
      callback,
    )
    .subscribe();
};

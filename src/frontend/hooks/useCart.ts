import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCart,
  createCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder as createCheckoutOrder,
  subscribeToCart,
  CartItem,
} from "@/frontend/services/storefrontService";
import { useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useAuth } from "@/frontend/contexts/AuthContext";

// Query keys
export const cartKeys = {
  all: ["cart"] as const,
  details: () => [...cartKeys.all, "detail"] as const,
  detail: (userId: string) => [...cartKeys.details(), userId] as const,
};

// Hook for managing cart
export const useCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

  const cartQuery = useQuery({
    queryKey: cartKeys.detail(userId || ""),
    queryFn: () => fetchCart(userId || ""),
    enabled: !!userId,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!userId || !cartQuery.data?.id) return;

    const subscription = subscribeToCart(cartQuery.data.id, (payload) => {
      // Invalidate and refetch cart data on any changes
      queryClient.invalidateQueries(cartKeys.detail(userId));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, userId, cartQuery.data?.id]);

  // Create cart mutation
  const createCartMutation = useMutation({
    mutationFn: () => createCart(userId || ""),
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.detail(userId || ""), newCart);
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, "id">) => {
      let cartId = cartQuery.data?.id;

      // If no cart exists, create one first
      if (!cartId) {
        const newCart = await createCart(userId || "");
        cartId = newCart.id;
      }

      return addToCart(cartId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail(userId || ""));
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add item to cart: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail(userId || ""));
      toast({
        title: "Cart updated",
        description: "Your cart has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update cart: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Remove cart item mutation
  const removeCartItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail(userId || ""));
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => {
      if (!cartQuery.data?.id) return Promise.resolve(true);
      return clearCart(cartQuery.data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail(userId || ""));
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to clear cart: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: ({
      items,
      totalAmount,
    }: {
      items: CartItem[];
      totalAmount: number;
    }) => createCheckoutOrder(userId || "", items, totalAmount),
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail(userId || ""));
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to place order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeCartItem: removeCartItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    checkout: checkoutMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartItemMutation.isPending,
    isRemovingFromCart: removeCartItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
    isCheckingOut: checkoutMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  subscribeToOrders,
  Order,
} from "@/frontend/services/storeService";
import { useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: any) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Hook for fetching all orders
export const useOrders = (filters?: any) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => fetchOrders(),
  });

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToOrders((payload) => {
      // Update cache based on the change type
      if (payload.eventType === "INSERT") {
        queryClient.setQueryData(
          orderKeys.list(filters),
          (old: Order[] | undefined) => {
            return old ? [payload.new, ...old] : [payload.new];
          },
        );
      } else if (payload.eventType === "UPDATE") {
        queryClient.setQueryData(
          orderKeys.list(filters),
          (old: Order[] | undefined) => {
            return old
              ? old.map((item) =>
                  item.id === payload.new.id ? payload.new : item,
                )
              : undefined;
          },
        );
        // Also update the individual order cache
        queryClient.setQueryData(orderKeys.detail(payload.new.id), payload.new);
      } else if (payload.eventType === "DELETE") {
        queryClient.setQueryData(
          orderKeys.list(filters),
          (old: Order[] | undefined) => {
            return old
              ? old.filter((item) => item.id !== payload.old.id)
              : undefined;
          },
        );
        // Invalidate the individual order cache
        queryClient.invalidateQueries(orderKeys.detail(payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, filters]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (newOrder) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(orderKeys.lists());
      toast({
        title: "Order created",
        description: "The order has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: Partial<Order> }) =>
      updateOrder(id, order),
    onSuccess: (updatedOrder) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(orderKeys.lists());
      queryClient.invalidateQueries(orderKeys.detail(updatedOrder.id));
      toast({
        title: "Order updated",
        description: "The order has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (_, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(orderKeys.lists());
      toast({
        title: "Order deleted",
        description: "The order has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
};

// Hook for fetching a single order
export const useOrder = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });
};

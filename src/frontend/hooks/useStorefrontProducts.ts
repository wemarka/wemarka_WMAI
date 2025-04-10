import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchStorefrontProducts,
  fetchStorefrontProduct,
  subscribeToStorefrontProducts,
} from "@/frontend/services/storefrontService";
import { Product } from "@/frontend/services/storeService";
import { useEffect } from "react";

// Query keys
export const storefrontProductKeys = {
  all: ["storefrontProducts"] as const,
  lists: () => [...storefrontProductKeys.all, "list"] as const,
  list: (filters: any) =>
    [...storefrontProductKeys.lists(), { filters }] as const,
  details: () => [...storefrontProductKeys.all, "detail"] as const,
  detail: (id: string) => [...storefrontProductKeys.details(), id] as const,
};

// Hook for fetching all storefront products
export const useStorefrontProducts = (filters?: any) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: storefrontProductKeys.list(filters),
    queryFn: () => fetchStorefrontProducts(),
  });

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToStorefrontProducts((payload) => {
      // Update cache based on the change type
      if (payload.eventType === "INSERT") {
        queryClient.setQueryData(
          storefrontProductKeys.list(filters),
          (old: Product[] | undefined) => {
            return old ? [payload.new, ...old] : [payload.new];
          },
        );
      } else if (payload.eventType === "UPDATE") {
        queryClient.setQueryData(
          storefrontProductKeys.list(filters),
          (old: Product[] | undefined) => {
            return old
              ? old.map((item) =>
                  item.id === payload.new.id ? payload.new : item,
                )
              : undefined;
          },
        );
        // Also update the individual product cache
        queryClient.setQueryData(
          storefrontProductKeys.detail(payload.new.id),
          payload.new,
        );
      } else if (payload.eventType === "DELETE") {
        queryClient.setQueryData(
          storefrontProductKeys.list(filters),
          (old: Product[] | undefined) => {
            return old
              ? old.filter((item) => item.id !== payload.old.id)
              : undefined;
          },
        );
        // Invalidate the individual product cache
        queryClient.invalidateQueries(
          storefrontProductKeys.detail(payload.old.id),
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, filters]);

  return query;
};

// Hook for fetching a single storefront product
export const useStorefrontProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: storefrontProductKeys.detail(id),
    queryFn: () => fetchStorefrontProduct(id),
    enabled: !!id,
  });
};

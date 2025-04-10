import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  subscribeToProducts,
  Product,
} from "@/frontend/services/storeService";
import { useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook for fetching all products
export const useProducts = (filters?: any) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(),
  });

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToProducts((payload) => {
      // Update cache based on the change type
      if (payload.eventType === "INSERT") {
        queryClient.setQueryData(
          productKeys.list(filters),
          (old: Product[] | undefined) => {
            return old ? [payload.new, ...old] : [payload.new];
          },
        );
      } else if (payload.eventType === "UPDATE") {
        queryClient.setQueryData(
          productKeys.list(filters),
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
          productKeys.detail(payload.new.id),
          payload.new,
        );
      } else if (payload.eventType === "DELETE") {
        queryClient.setQueryData(
          productKeys.list(filters),
          (old: Product[] | undefined) => {
            return old
              ? old.filter((item) => item.id !== payload.old.id)
              : undefined;
          },
        );
        // Invalidate the individual product cache
        queryClient.invalidateQueries(productKeys.detail(payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, filters]);

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(productKeys.lists());
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      updateProduct(id, product),
    onSuccess: (updatedProduct) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(productKeys.lists());
      queryClient.invalidateQueries(productKeys.detail(updatedProduct.id));
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(productKeys.lists());
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};

// Hook for fetching a single product
export const useProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
};

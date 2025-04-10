import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInvoices,
  fetchInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  subscribeToInvoices,
  Invoice,
} from "@/frontend/services/accountingService";
import { useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";

// Query keys
export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (filters: any) => [...invoiceKeys.lists(), { filters }] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

// Hook for fetching all invoices
export const useInvoices = (filters?: any) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => fetchInvoices(),
  });

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToInvoices((payload) => {
      // Update cache based on the change type
      if (payload.eventType === "INSERT") {
        queryClient.setQueryData(
          invoiceKeys.list(filters),
          (old: Invoice[] | undefined) => {
            return old ? [payload.new, ...old] : [payload.new];
          },
        );
      } else if (payload.eventType === "UPDATE") {
        queryClient.setQueryData(
          invoiceKeys.list(filters),
          (old: Invoice[] | undefined) => {
            return old
              ? old.map((item) =>
                  item.id === payload.new.id ? payload.new : item,
                )
              : undefined;
          },
        );
        // Also update the individual invoice cache
        queryClient.setQueryData(
          invoiceKeys.detail(payload.new.id),
          payload.new,
        );
      } else if (payload.eventType === "DELETE") {
        queryClient.setQueryData(
          invoiceKeys.list(filters),
          (old: Invoice[] | undefined) => {
            return old
              ? old.filter((item) => item.id !== payload.old.id)
              : undefined;
          },
        );
        // Invalidate the individual invoice cache
        queryClient.invalidateQueries(invoiceKeys.detail(payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, filters]);

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoice) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(invoiceKeys.lists());
      toast({
        title: "Invoice created",
        description: "The invoice has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create invoice: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update invoice mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, invoice }: { id: string; invoice: Partial<Invoice> }) =>
      updateInvoice(id, invoice),
    onSuccess: (updatedInvoice) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(invoiceKeys.lists());
      queryClient.invalidateQueries(invoiceKeys.detail(updatedInvoice.id));
      toast({
        title: "Invoice updated",
        description: "The invoice has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update invoice: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: (_, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(invoiceKeys.lists());
      toast({
        title: "Invoice deleted",
        description: "The invoice has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete invoice: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    createInvoice: createInvoiceMutation.mutate,
    updateInvoice: updateInvoiceMutation.mutate,
    deleteInvoice: deleteInvoiceMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    isUpdating: updateInvoiceMutation.isPending,
    isDeleting: deleteInvoiceMutation.isPending,
  };
};

// Hook for fetching a single invoice
export const useInvoice = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => fetchInvoice(id),
    enabled: !!id,
  });
};

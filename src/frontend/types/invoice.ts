/**
 * Invoice interface
 */
export interface Invoice {
  id: string;
  customer_id: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  due_date: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at?: string;
}

/**
 * Invoice item interface
 */
export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  tax?: number;
}

/**
 * Invoice summary interface
 */
export interface InvoiceSummary {
  total_invoices: number;
  paid_invoices: number;
  overdue_invoices: number;
  draft_invoices: number;
  total_amount: number;
  paid_amount: number;
  overdue_amount: number;
}

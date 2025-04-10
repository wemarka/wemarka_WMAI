export interface SalesSummary {
  date: string;
  total_amount: number;
  order_count: number;
  avg_order_value: number;
}

export interface ActiveUsers {
  date: string;
  user_count: number;
  visit_count: number;
  avg_session_time: number;
}

export interface TicketResponseRate {
  category: string;
  ticket_count: number;
  avg_response_time: number;
  resolution_rate: number;
}

export interface AnalyticsSummary {
  salesData: SalesSummary[];
  usersData: ActiveUsers[];
  ticketData: TicketResponseRate[];
  monthlyRevenue: number;
  conversionRate: number;
  avgSessionTime: number;
}

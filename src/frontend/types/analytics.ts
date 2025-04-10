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

export interface TopProduct {
  product_id: string;
  product_name: string;
  total_sales: number;
  units_sold: number;
  image_url?: string;
}

export interface TopAgent {
  agent_id: string;
  agent_name: string;
  tickets_resolved: number;
  avg_resolution_time: number;
  satisfaction_rate: number;
}

export interface BounceRateData {
  date: string;
  page_path: string;
  visits: number;
  bounces: number;
  bounce_rate: number;
}

export interface AnalyticsFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  category?: string;
}

export interface AnalyticsSummary {
  salesData: SalesSummary[];
  usersData: ActiveUsers[];
  ticketData: TicketResponseRate[];
  topProducts: TopProduct[];
  topAgents: TopAgent[];
  bounceRateData: BounceRateData[];
  monthlyRevenue: number;
  conversionRate: number;
  avgSessionTime: number;
  bounceRate: number;
}

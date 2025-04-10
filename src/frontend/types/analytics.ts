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

export interface UserAnalytics {
  // Overview stats
  activeUsers: number;
  userGrowthRate: number;
  avgSessionDuration: number; // in seconds
  sessionDurationChange: number; // percentage
  engagementRate: number; // percentage
  engagementChange: number; // percentage
  retentionRate: number; // percentage
  retentionChange: number; // percentage

  // Daily activity
  dailyActivity: {
    date: string;
    activeUsers: number;
    sessions: number;
  }[];

  // Hourly usage
  hourlyUsage: {
    hour: number;
    avgMinutes: number;
    sessions: number;
  }[];

  // Module usage
  moduleUsage: {
    module: string;
    usage: number; // percentage
    avgTimeSpent: number; // minutes
  }[];

  // Top features
  topFeatures: {
    name: string;
    usagePercent: number;
    module: string;
  }[];

  // User growth
  userGrowth: {
    date: string;
    newUsers: number;
    activeUsers: number;
  }[];

  // Retention data
  retentionData: {
    day: number; // day after signup (1, 3, 7, 14, 30)
    rate: number; // percentage
  }[];

  // Device distribution
  deviceDistribution: {
    device: string;
    percentage: number;
  }[];

  // Browser distribution
  browserDistribution: {
    browser: string;
    percentage: number;
  }[];

  // Country distribution
  countryDistribution: {
    country: string;
    percentage: number;
  }[];
}

export interface AnalyticsFilter {
  startDate: Date;
  endDate: Date;
  modules?: string[];
  userRoles?: string[];
  countries?: string[];
}

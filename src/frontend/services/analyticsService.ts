import { supabase } from "@/lib/supabase";
import {
  SalesSummary,
  ActiveUsers,
  TicketResponseRate,
  TopProduct,
  TopAgent,
  BounceRateData,
  AnalyticsSummary,
  AnalyticsFilters,
  UserAnalytics,
  AnalyticsFilter,
} from "@/frontend/types/analytics";

/**
 * Format date for Supabase queries
 */
const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Fetch weekly sales data from Supabase
 */
export const getWeeklySales = async (
  filters?: AnalyticsFilters,
): Promise<SalesSummary[]> => {
  try {
    let query = supabase
      .from("weekly_sales")
      .select("*")
      .order("date", { ascending: true });

    // Apply date filters if provided
    if (filters?.dateRange) {
      const fromDate = formatDateForQuery(filters.dateRange.from);
      const toDate = formatDateForQuery(filters.dateRange.to);
      query = query.gte("date", fromDate).lte("date", toDate);
    }

    // Apply category filter if provided
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    return [];
  }
};

/**
 * Fetch active users data from Supabase
 */
export const getActiveUsers = async (
  filters?: AnalyticsFilters,
): Promise<ActiveUsers[]> => {
  try {
    let query = supabase
      .from("active_users")
      .select("*")
      .order("date", { ascending: true });

    // Apply date filters if provided
    if (filters?.dateRange) {
      const fromDate = formatDateForQuery(filters.dateRange.from);
      const toDate = formatDateForQuery(filters.dateRange.to);
      query = query.gte("date", fromDate).lte("date", toDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching active users:", error);
    return [];
  }
};

/**
 * Fetch ticket resolution time data from Supabase
 */
export const getTicketResolutionTime = async (
  filters?: AnalyticsFilters,
): Promise<TicketResponseRate[]> => {
  try {
    let query = supabase.from("ticket_resolution_time").select("*");

    // Apply category filter if provided
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    // Apply date filters if provided
    if (filters?.dateRange) {
      const fromDate = formatDateForQuery(filters.dateRange.from);
      const toDate = formatDateForQuery(filters.dateRange.to);
      query = query.gte("date", fromDate).lte("date", toDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to match TicketResponseRate interface
    return (
      data.map((item) => ({
        category: item.category,
        ticket_count: item.ticket_count,
        avg_response_time: item.avg_resolution_time,
        resolution_rate: item.resolution_rate,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching ticket resolution time:", error);
    return [];
  }
};

/**
 * Fetch top selling products from Supabase
 */
export const getTopProducts = async (
  limit: number = 5,
  filters?: AnalyticsFilters,
): Promise<TopProduct[]> => {
  try {
    // First check if the product_sales view exists
    const { data: viewCheck, error: viewCheckError } = await supabase
      .from("information_schema.views")
      .select("table_name")
      .eq("table_name", "product_sales")
      .eq("table_schema", "public");

    // If view doesn't exist or there's an error checking, return mock data
    if (viewCheckError || !viewCheck || viewCheck.length === 0) {
      console.warn("product_sales view not found, using mock data");
      const mockProducts = getMockAnalyticsData().topProducts.slice(0, limit);
      return mockProducts;
    }

    let query = supabase
      .from("product_sales")
      .select("product_id, product_name, total_sales, units_sold, image_url")
      .order("total_sales", { ascending: false })
      .limit(limit);

    // Apply date filters if provided
    if (filters?.dateRange) {
      const fromDate = formatDateForQuery(filters.dateRange.from);
      const toDate = formatDateForQuery(filters.dateRange.to);
      query = query.gte("date", fromDate).lte("date", toDate);
    }

    // Apply category filter if provided
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching top products:", error);
      // Return mock data on error
      return getMockAnalyticsData().topProducts.slice(0, limit);
    }

    // If no data returned, use mock data
    if (!data || data.length === 0) {
      return getMockAnalyticsData().topProducts.slice(0, limit);
    }

    return data;
  } catch (error) {
    console.error("Error fetching top products:", error);
    // Return mock data on error
    return getMockAnalyticsData().topProducts.slice(0, limit);
  }
};

/**
 * Fetch top performing agents from Supabase
 */
export const getTopAgents = async (
  limit: number = 5,
  filters?: AnalyticsFilters,
): Promise<TopAgent[]> => {
  try {
    let query = supabase
      .from("agent_performance")
      .select(
        "agent_id, agent_name, tickets_resolved, avg_resolution_time, satisfaction_rate",
      )
      .order("tickets_resolved", { ascending: false })
      .limit(limit);

    // Apply date filters if provided
    if (filters?.dateRange) {
      const fromDate = formatDateForQuery(filters.dateRange.from);
      const toDate = formatDateForQuery(filters.dateRange.to);
      query = query.gte("date", fromDate).lte("date", toDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching top agents:", error);
    return [];
  }
};

/**
 * Fetch bounce rate data from Supabase
 */
export const getBounceRateData = async (
  filters?: AnalyticsFilters,
): Promise<BounceRateData[]> => {
  try {
    let query = supabase
      .from("page_bounce_rates")
      .select("*")
      .order("date", { ascending: true });

    // Apply date filters if provided
    if (filters?.dateRange) {
      const fromDate = formatDateForQuery(filters.dateRange.from);
      const toDate = formatDateForQuery(filters.dateRange.to);
      query = query.gte("date", fromDate).lte("date", toDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching bounce rate data:", error);
    return [];
  }
};

/**
 * Fetch all analytics data at once with filters
 */
export const getAnalyticsSummary = async (
  filters?: AnalyticsFilters,
): Promise<AnalyticsSummary> => {
  try {
    // Use Promise.all to fetch all data concurrently
    const [
      salesData,
      usersData,
      ticketData,
      topProducts,
      topAgents,
      bounceRateData,
    ] = await Promise.all([
      getWeeklySales(filters),
      getActiveUsers(filters),
      getTicketResolutionTime(filters),
      getTopProducts(5, filters),
      getTopAgents(5, filters),
      getBounceRateData(filters),
    ]);

    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = salesData
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

    // Calculate conversion rate
    const totalVisits = usersData.reduce(
      (sum, user) => sum + (user.visit_count || 0),
      0,
    );
    const totalOrders = salesData.reduce(
      (sum, sale) => sum + (sale.order_count || 0),
      0,
    );
    const conversionRate =
      totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

    // Calculate average session time
    const avgSessionTime =
      usersData.reduce((sum, user) => sum + (user.avg_session_time || 0), 0) /
      (usersData.length || 1);

    // Calculate overall bounce rate
    const totalVisitsForBounce = bounceRateData.reduce(
      (sum, data) => sum + data.visits,
      0,
    );
    const totalBounces = bounceRateData.reduce(
      (sum, data) => sum + data.bounces,
      0,
    );
    const bounceRate =
      totalVisitsForBounce > 0
        ? (totalBounces / totalVisitsForBounce) * 100
        : 0;

    return {
      salesData,
      usersData,
      ticketData,
      topProducts,
      topAgents,
      bounceRateData,
      monthlyRevenue,
      conversionRate,
      avgSessionTime,
      bounceRate,
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return getMockAnalyticsData(); // Fallback to mock data on error
  }
};

/**
 * Get available categories for filtering
 */
export const getAnalyticsCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("analytics_categories")
      .select("category_name");

    if (error) throw error;
    return data.map((item) => item.category_name) || [];
  } catch (error) {
    console.error("Error fetching analytics categories:", error);
    return ["Technical", "Billing", "Product", "General", "Shipping"]; // Fallback categories
  }
};

/**
 * Get mock data for development/testing
 */
export const getMockAnalyticsData = (): AnalyticsSummary => {
  // Generate dates for the last 7 days
  const salesData: SalesSummary[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      total_amount: Math.floor(Math.random() * 5000) + 1000,
      order_count: Math.floor(Math.random() * 50) + 10,
      avg_order_value: Math.floor(Math.random() * 200) + 50,
    };
  });

  // Generate active users data
  const usersData: ActiveUsers[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      user_count: Math.floor(Math.random() * 500) + 100,
      visit_count: Math.floor(Math.random() * 1000) + 200,
      avg_session_time: Math.floor(Math.random() * 300) + 60,
    };
  });

  // Generate ticket data
  const ticketCategories = [
    "Technical",
    "Billing",
    "Product",
    "General",
    "Shipping",
  ];
  const ticketData: TicketResponseRate[] = ticketCategories.map((category) => ({
    category,
    ticket_count: Math.floor(Math.random() * 100) + 10,
    avg_response_time: Math.floor(Math.random() * 24) + 1,
    resolution_rate: Math.floor(Math.random() * 40) + 60,
  }));

  // Generate top products data
  const productNames = [
    "Premium Headphones",
    "Wireless Keyboard",
    "Ultra HD Monitor",
    "Gaming Mouse",
    "Bluetooth Speaker",
  ];
  const topProducts: TopProduct[] = productNames.map((name, index) => ({
    product_id: `PROD-${index + 1}`,
    product_name: name,
    total_sales: Math.floor(Math.random() * 10000) + 2000,
    units_sold: Math.floor(Math.random() * 200) + 50,
    image_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${name.replace(/ /g, "")}`,
  }));

  // Generate top agents data
  const agentNames = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
  ];
  const topAgents: TopAgent[] = agentNames.map((name, index) => ({
    agent_id: `AGENT-${index + 1}`,
    agent_name: name,
    tickets_resolved: Math.floor(Math.random() * 100) + 50,
    avg_resolution_time: Math.floor(Math.random() * 120) + 30,
    satisfaction_rate: Math.floor(Math.random() * 30) + 70,
  }));

  // Generate bounce rate data
  const pageNames = ["/home", "/products", "/about", "/contact", "/blog"];
  const bounceRateData: BounceRateData[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];

    pageNames.forEach((page) => {
      const visits = Math.floor(Math.random() * 500) + 100;
      const bounces = Math.floor(Math.random() * visits * 0.6);
      bounceRateData.push({
        date: dateStr,
        page_path: page,
        visits,
        bounces,
        bounce_rate: (bounces / visits) * 100,
      });
    });
  }

  // Calculate summary metrics
  const monthlyRevenue = salesData.reduce(
    (sum, sale) => sum + sale.total_amount,
    0,
  );
  const totalVisits = usersData.reduce(
    (sum, user) => sum + user.visit_count,
    0,
  );
  const totalOrders = salesData.reduce(
    (sum, sale) => sum + sale.order_count,
    0,
  );
  const conversionRate = (totalOrders / totalVisits) * 100;
  const avgSessionTime =
    usersData.reduce((sum, user) => sum + user.avg_session_time, 0) /
    usersData.length;

  // Calculate bounce rate
  const totalVisitsForBounce = bounceRateData.reduce(
    (sum, data) => sum + data.visits,
    0,
  );
  const totalBounces = bounceRateData.reduce(
    (sum, data) => sum + data.bounces,
    0,
  );
  const bounceRate = (totalBounces / totalVisitsForBounce) * 100;

  return {
    salesData,
    usersData,
    ticketData,
    topProducts,
    topAgents,
    bounceRateData,
    monthlyRevenue,
    conversionRate,
    avgSessionTime,
    bounceRate,
  };
};

/**
 * Get user analytics data for a specific date range
 * @param startDate Start date for analytics
 * @param endDate End date for analytics
 * @returns User analytics data
 */
export const getUserAnalytics = async (
  startDate: Date,
  endDate: Date,
): Promise<UserAnalytics> => {
  try {
    // In a real implementation, this would fetch from Supabase tables
    // For now, we'll return mock data
    return getMockUserAnalytics(startDate, endDate);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw error;
  }
};

/**
 * Get filtered user analytics data
 * @param filter Analytics filter parameters
 * @returns Filtered user analytics data
 */
export const getFilteredUserAnalytics = async (
  filter: AnalyticsFilter,
): Promise<UserAnalytics> => {
  try {
    // In a real implementation, this would apply filters to the query
    // For now, we'll return mock data
    return getMockUserAnalytics(filter.startDate, filter.endDate);
  } catch (error) {
    console.error("Error fetching filtered user analytics:", error);
    throw error;
  }
};

/**
 * Generate mock user analytics data
 * @param startDate Start date for analytics
 * @param endDate End date for analytics
 * @returns Mock user analytics data
 */
const getMockUserAnalytics = (
  startDate: Date,
  endDate: Date,
): UserAnalytics => {
  // Calculate number of days in the date range
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Generate daily activity data
  const dailyActivity = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      activeUsers: Math.floor(Math.random() * 500) + 100,
      sessions: Math.floor(Math.random() * 1000) + 200,
    };
  });

  // Generate hourly usage data
  const hourlyUsage = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    avgMinutes: Math.floor(Math.random() * 30) + 5,
    sessions: Math.floor(Math.random() * 200) + 50,
  }));

  // Generate module usage data
  const modules = [
    "Dashboard",
    "Store",
    "Accounting",
    "Marketing",
    "Inbox",
    "Analytics",
    "Customers",
    "Documents",
    "Integrations",
    "Developer",
    "Settings",
  ];

  const moduleUsage = modules.map((module) => ({
    module,
    usage: Math.floor(Math.random() * 30) + 1,
    avgTimeSpent: Math.floor(Math.random() * 30) + 5,
  }));

  // Normalize module usage percentages to sum to 100
  const totalUsage = moduleUsage.reduce((sum, item) => sum + item.usage, 0);
  moduleUsage.forEach((item) => {
    item.usage = Math.round((item.usage / totalUsage) * 100);
  });

  // Generate top features data
  const features = [
    { name: "Product Management", module: "Store" },
    { name: "Invoice Creation", module: "Accounting" },
    { name: "Campaign Analytics", module: "Marketing" },
    { name: "Customer Chat", module: "Inbox" },
    { name: "Sales Reports", module: "Analytics" },
    { name: "User Management", module: "Settings" },
    { name: "AI Assistant", module: "Dashboard" },
    { name: "Document Generation", module: "Documents" },
    { name: "API Integration", module: "Developer" },
    { name: "Customer Profiles", module: "Customers" },
  ];

  const topFeatures = features.map((feature) => ({
    ...feature,
    usagePercent: Math.floor(Math.random() * 50) + 30,
  }));

  // Sort top features by usage percentage
  topFeatures.sort((a, b) => b.usagePercent - a.usagePercent);

  // Generate user growth data
  const userGrowth = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      newUsers: Math.floor(Math.random() * 50) + 5,
      activeUsers: Math.floor(Math.random() * 500) + 100,
    };
  });

  // Generate retention data
  const retentionData = [
    { day: 1, rate: Math.floor(Math.random() * 20) + 70 },
    { day: 3, rate: Math.floor(Math.random() * 20) + 60 },
    { day: 7, rate: Math.floor(Math.random() * 20) + 50 },
    { day: 14, rate: Math.floor(Math.random() * 20) + 40 },
    { day: 30, rate: Math.floor(Math.random() * 20) + 30 },
  ];

  // Generate device distribution data
  const deviceDistribution = [
    { device: "Desktop", percentage: Math.floor(Math.random() * 30) + 40 },
    { device: "Mobile", percentage: Math.floor(Math.random() * 20) + 20 },
    { device: "Tablet", percentage: Math.floor(Math.random() * 10) + 10 },
  ];

  // Normalize device percentages to sum to 100
  const totalDevices = deviceDistribution.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );
  deviceDistribution.forEach((item) => {
    item.percentage = Math.round((item.percentage / totalDevices) * 100);
  });

  // Generate browser distribution data
  const browserDistribution = [
    { browser: "Chrome", percentage: Math.floor(Math.random() * 20) + 40 },
    { browser: "Firefox", percentage: Math.floor(Math.random() * 10) + 20 },
    { browser: "Safari", percentage: Math.floor(Math.random() * 10) + 15 },
    { browser: "Edge", percentage: Math.floor(Math.random() * 10) + 10 },
    { browser: "Other", percentage: Math.floor(Math.random() * 5) + 5 },
  ];

  // Normalize browser percentages to sum to 100
  const totalBrowsers = browserDistribution.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );
  browserDistribution.forEach((item) => {
    item.percentage = Math.round((item.percentage / totalBrowsers) * 100);
  });

  // Generate country distribution data
  const countryDistribution = [
    {
      country: "United States",
      percentage: Math.floor(Math.random() * 20) + 30,
    },
    {
      country: "United Kingdom",
      percentage: Math.floor(Math.random() * 10) + 15,
    },
    { country: "Germany", percentage: Math.floor(Math.random() * 10) + 10 },
    { country: "France", percentage: Math.floor(Math.random() * 5) + 8 },
    { country: "Canada", percentage: Math.floor(Math.random() * 5) + 7 },
    { country: "Australia", percentage: Math.floor(Math.random() * 5) + 6 },
    { country: "Japan", percentage: Math.floor(Math.random() * 5) + 5 },
    { country: "Brazil", percentage: Math.floor(Math.random() * 3) + 4 },
    { country: "India", percentage: Math.floor(Math.random() * 3) + 3 },
    { country: "Saudi Arabia", percentage: Math.floor(Math.random() * 3) + 2 },
    { country: "Other", percentage: Math.floor(Math.random() * 5) + 5 },
  ];

  // Normalize country percentages to sum to 100
  const totalCountries = countryDistribution.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );
  countryDistribution.forEach((item) => {
    item.percentage = Math.round((item.percentage / totalCountries) * 100);
  });

  return {
    activeUsers: Math.floor(Math.random() * 5000) + 1000,
    userGrowthRate: Math.floor(Math.random() * 20) + 5,
    avgSessionDuration: Math.floor(Math.random() * 600) + 300, // 5-15 minutes in seconds
    sessionDurationChange: Math.floor(Math.random() * 30) - 10, // -10% to +20%
    engagementRate: Math.floor(Math.random() * 30) + 40, // 40-70%
    engagementChange: Math.floor(Math.random() * 20) - 5, // -5% to +15%
    retentionRate: Math.floor(Math.random() * 30) + 50, // 50-80%
    retentionChange: Math.floor(Math.random() * 20) - 5, // -5% to +15%
    dailyActivity,
    hourlyUsage,
    moduleUsage,
    topFeatures,
    userGrowth,
    retentionData,
    deviceDistribution,
    browserDistribution,
    countryDistribution,
  };
};

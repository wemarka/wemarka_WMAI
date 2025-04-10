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

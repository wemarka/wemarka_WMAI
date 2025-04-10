import { supabase } from "@/lib/supabase";
import {
  SalesSummary,
  ActiveUsers,
  TicketResponseRate,
  AnalyticsSummary,
} from "@/frontend/types/analytics";

/**
 * Fetch sales summary data from Supabase
 */
export const getSalesSummary = async (): Promise<SalesSummary[]> => {
  try {
    const { data, error } = await supabase
      .from("sales_summary")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    return [];
  }
};

/**
 * Fetch active users data from Supabase
 */
export const getActiveUsers = async (): Promise<ActiveUsers[]> => {
  try {
    const { data, error } = await supabase
      .from("active_users")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching active users:", error);
    return [];
  }
};

/**
 * Fetch ticket response rate data from Supabase
 */
export const getTicketResponseRate = async (): Promise<
  TicketResponseRate[]
> => {
  try {
    const { data, error } = await supabase
      .from("ticket_response_rate")
      .select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching ticket response rate:", error);
    return [];
  }
};

/**
 * Fetch all analytics data at once
 */
export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    const [salesData, usersData, ticketData] = await Promise.all([
      getSalesSummary(),
      getActiveUsers(),
      getTicketResponseRate(),
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

    // Calculate conversion rate (example calculation)
    const totalVisits = usersData.reduce(
      (sum, user) => sum + (user.visit_count || 0),
      0,
    );
    const totalConversions = salesData.length;
    const conversionRate =
      totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;

    // Calculate average session time
    const avgSessionTime =
      usersData.reduce((sum, user) => sum + (user.avg_session_time || 0), 0) /
      (usersData.length || 1);

    return {
      salesData,
      usersData,
      ticketData,
      monthlyRevenue,
      conversionRate,
      avgSessionTime,
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return {
      salesData: [],
      usersData: [],
      ticketData: [],
      monthlyRevenue: 0,
      conversionRate: 0,
      avgSessionTime: 0,
    };
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

  return {
    salesData,
    usersData,
    ticketData,
    monthlyRevenue,
    conversionRate,
    avgSessionTime,
  };
};

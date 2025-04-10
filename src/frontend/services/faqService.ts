import { supabase } from "@/lib/supabase";
import { FAQ, SupportAnalytics } from "@/frontend/types/faq";

/**
 * Fetch all FAQs from the database
 */
export const getAllFAQs = async (lang: string = "en"): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("lang", lang)
    .order("category");

  if (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }

  return data as FAQ[];
};

/**
 * Fetch FAQs filtered by category
 */
export const getFAQsByCategory = async (
  category: string,
  lang: string = "en",
): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("category", category)
    .eq("lang", lang)
    .order("created_at");

  if (error) {
    console.error("Error fetching FAQs by category:", error);
    throw error;
  }

  return data as FAQ[];
};

/**
 * Search FAQs by query string
 */
export const searchFAQs = async (
  query: string,
  lang: string = "en",
): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("lang", lang)
    .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
    .order("category");

  if (error) {
    console.error("Error searching FAQs:", error);
    throw error;
  }

  return data as FAQ[];
};

/**
 * Get all unique FAQ categories
 */
export const getFAQCategories = async (
  lang: string = "en",
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("category")
    .eq("lang", lang)
    .order("category");

  if (error) {
    console.error("Error fetching FAQ categories:", error);
    throw error;
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))];
  return categories;
};

/**
 * Get support analytics data
 */
export const getSupportAnalytics = async (
  lang: string = "en",
): Promise<SupportAnalytics> => {
  try {
    // Get total FAQs count
    const { count: totalFAQs, error: faqError } = await supabase
      .from("faqs")
      .select("*", { count: "exact", head: true })
      .eq("lang", lang);

    if (faqError) throw faqError;

    // Get active searches count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: activeSearches, error: searchError } = await supabase
      .from("search_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    // Get feedback responses count
    const { count: feedbackResponses, error: feedbackError } = await supabase
      .from("user_feedback")
      .select("*", { count: "exact", head: true });

    // Get unanswered questions count
    const { count: unansweredQuestions, error: unansweredError } =
      await supabase
        .from("ai_help_logs")
        .select("*", { count: "exact", head: true })
        .eq("has_answer", false);

    // Get searches by day (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const { data: searchesByDay, error: searchesByDayError } = await supabase
      .from("search_logs_by_day")
      .select("date, count")
      .gte("date", fourteenDaysAgo.toISOString().split("T")[0])
      .order("date");

    // Get feedback by rating
    const { data: feedbackByRating, error: feedbackByRatingError } =
      await supabase
        .from("feedback_by_rating")
        .select("rating, count")
        .order("rating");

    // Get top search terms
    const { data: topSearchTerms, error: topSearchTermsError } = await supabase
      .from("top_search_terms")
      .select("term, count")
      .order("count", { ascending: false })
      .limit(10);

    // Get category distribution
    const { data: categoryDistribution, error: categoryDistributionError } =
      await supabase
        .from("faq_category_distribution")
        .select("category, count")
        .order("count", { ascending: false });

    return {
      totalFAQs: totalFAQs || 0,
      activeSearches: activeSearches || 0,
      feedbackResponses: feedbackResponses || 0,
      unansweredQuestions: unansweredQuestions || 0,
      searchesByDay: (searchesByDay as { date: string; count: number }[]) || [],
      feedbackByRating:
        (feedbackByRating as { rating: number; count: number }[]) || [],
      topSearchTerms:
        (topSearchTerms as { term: string; count: number }[]) || [],
      categoryDistribution:
        (categoryDistribution as { category: string; count: number }[]) || [],
    };
  } catch (error) {
    console.error("Error fetching support analytics:", error);
    // Return default values if there's an error
    return {
      totalFAQs: 0,
      activeSearches: 0,
      feedbackResponses: 0,
      unansweredQuestions: 0,
      searchesByDay: [],
      feedbackByRating: [],
      topSearchTerms: [],
      categoryDistribution: [],
    };
  }
};

/**
 * Get mock support analytics data (for development/testing)
 */
export const getMockSupportAnalytics = (): SupportAnalytics => {
  // Generate dates for the last 14 days
  const searchesByDay = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50) + 10,
    };
  });

  // Generate feedback by rating
  const feedbackByRating = Array.from({ length: 5 }, (_, i) => ({
    rating: i + 1,
    count: Math.floor(Math.random() * 30) + 5,
  }));

  // Generate top search terms
  const searchTerms = [
    "login",
    "password reset",
    "payment",
    "shipping",
    "refund",
    "account",
    "order status",
    "discount",
    "return policy",
    "contact",
  ];
  const topSearchTerms = searchTerms.map((term) => ({
    term,
    count: Math.floor(Math.random() * 100) + 20,
  }));

  // Generate category distribution
  const categories = [
    "account",
    "orders",
    "payments",
    "shipping",
    "returns",
    "technical",
    "general",
  ];
  const categoryDistribution = categories.map((category) => ({
    category,
    count: Math.floor(Math.random() * 50) + 10,
  }));

  return {
    totalFAQs: 127,
    activeSearches: 843,
    feedbackResponses: 215,
    unansweredQuestions: 32,
    searchesByDay,
    feedbackByRating,
    topSearchTerms,
    categoryDistribution,
  };
};

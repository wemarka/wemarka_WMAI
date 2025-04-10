import { supabase } from "@/lib/supabase";
import { Doc, DocFeedback } from "@/frontend/types/docs";

/**
 * Fetch all docs from the database
 */
export const getAllDocs = async (lang: string = "en"): Promise<Doc[]> => {
  const { data, error } = await supabase
    .from("docs")
    .select("*, feedback_stats(*)")
    .eq("lang", lang)
    .order("category");

  if (error) {
    console.error("Error fetching docs:", error);
    throw error;
  }

  return data as Doc[];
};

/**
 * Fetch docs filtered by category
 */
export const getDocsByCategory = async (
  category: string,
  lang: string = "en",
): Promise<Doc[]> => {
  const { data, error } = await supabase
    .from("docs")
    .select("*, feedback_stats(*)")
    .eq("category", category)
    .eq("lang", lang)
    .order("created_at");

  if (error) {
    console.error("Error fetching docs by category:", error);
    throw error;
  }

  return data as Doc[];
};

/**
 * Search docs by query string
 */
export const searchDocs = async (
  query: string,
  lang: string = "en",
): Promise<Doc[]> => {
  const { data, error } = await supabase
    .from("docs")
    .select("*, feedback_stats(*)")
    .eq("lang", lang)
    .or(
      `title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`,
    )
    .order("category");

  if (error) {
    console.error("Error searching docs:", error);
    throw error;
  }

  return data as Doc[];
};

/**
 * Get all unique doc categories
 */
export const getDocCategories = async (
  lang: string = "en",
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("docs")
    .select("category")
    .eq("lang", lang)
    .order("category");

  if (error) {
    console.error("Error fetching doc categories:", error);
    throw error;
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))];
  return categories;
};

/**
 * Submit feedback for a doc
 */
export const submitDocFeedback = async (
  feedback: DocFeedback,
): Promise<void> => {
  const { error } = await supabase.from("doc_feedback").insert([
    {
      doc_id: feedback.doc_id,
      user_id: feedback.user_id,
      helpful: feedback.helpful,
      comment: feedback.comment,
    },
  ]);

  if (error) {
    console.error("Error submitting doc feedback:", error);
    throw error;
  }
};

/**
 * Get feedback statistics for a doc
 */
export const getDocFeedbackStats = async (docId: string) => {
  const { data, error } = await supabase
    .from("doc_feedback_stats")
    .select("*")
    .eq("doc_id", docId)
    .single();

  if (error) {
    console.error("Error fetching doc feedback stats:", error);
    return null;
  }

  return data;
};

/**
 * Get a single doc by ID
 */
export const getDocById = async (
  docId: string,
  lang: string = "en",
): Promise<Doc | null> => {
  const { data, error } = await supabase
    .from("docs")
    .select("*, feedback_stats(*)")
    .eq("id", docId)
    .eq("lang", lang)
    .single();

  if (error) {
    console.error("Error fetching doc by ID:", error);
    return null;
  }

  return data as Doc;
};

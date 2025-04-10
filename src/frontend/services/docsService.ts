import { supabase } from "@/lib/supabase";
import { Doc } from "@/frontend/types/docs";

/**
 * Fetch all docs from the database
 */
export const getAllDocs = async (lang: string = "en"): Promise<Doc[]> => {
  const { data, error } = await supabase
    .from("docs")
    .select("*")
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
    .select("*")
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
    .select("*")
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

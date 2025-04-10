import { supabase } from "@/lib/supabase";
import { FeedbackFormData, UserFeedback } from "@/frontend/types/feedback";

/**
 * Save user feedback to the database
 */
export const saveFeedback = async (
  data: FeedbackFormData,
): Promise<UserFeedback> => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data: feedback, error } = await supabase
    .from("user_feedback")
    .insert({
      user_id: userId,
      rating: data.rating,
      feedback: data.feedback || null,
      module: data.module || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }

  return feedback as UserFeedback;
};

/**
 * Get user feedback history
 */
export const getUserFeedback = async (): Promise<UserFeedback[]> => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("user_feedback")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }

  return data as UserFeedback[];
};

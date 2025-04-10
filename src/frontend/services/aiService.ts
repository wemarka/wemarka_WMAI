import { supabase } from "@/lib/supabase";
import {
  AIHelpLog,
  AIHelpRequest,
  AIHelpResponse,
  FeedbackType,
} from "@/frontend/types/ai";

/**
 * Send a question to the AI assistant and get a response
 * @param question The user's question
 * @param context Optional context to provide to the AI
 * @returns The AI's response and conversation ID
 */
export const askAI = async (
  question: string,
  context?: string,
): Promise<{ response: string; conversationId: string | null }> => {
  try {
    // Call the Supabase Edge Function
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-ask",
      {
        body: { question, context },
      },
    );

    if (error) throw new Error(error.message);

    let conversationId = null;
    // Save the conversation to Supabase if user is logged in
    if (user?.user?.id && data.response) {
      conversationId = await saveConversation(
        user.user.id,
        question,
        data.response,
      );
    }

    return {
      response: data.response as string,
      conversationId,
    };
  } catch (error) {
    console.error("Error asking AI:", error);
    throw new Error("Failed to get response from AI assistant");
  }
};

/**
 * Save a conversation to the ai_help_logs table
 * @param userId The user's ID
 * @param question The user's question
 * @param response The AI's response
 */
export const saveConversation = async (
  userId: string,
  question: string,
  response: string,
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("ai_help_logs")
      .insert({
        user_id: userId,
        question,
        response,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error("Error saving conversation:", error);
    // Don't throw here to prevent breaking the user experience
    // Just log the error
    return null;
  }
};

/**
 * Get conversation history for a user
 * @param userId The user's ID
 * @param limit The maximum number of conversations to return
 * @returns The user's conversation history
 */
export const getConversationHistory = async (
  userId: string,
  limit: number = 10,
): Promise<AIHelpLog[]> => {
  try {
    const { data, error } = await supabase
      .from("ai_help_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as AIHelpLog[];
  } catch (error) {
    console.error("Error getting conversation history:", error);
    return [];
  }
};

/**
 * Save feedback for a conversation
 * @param conversationId The ID of the conversation
 * @param feedback The feedback (positive or negative)
 */
export const saveFeedback = async (
  conversationId: string,
  feedback: FeedbackType,
): Promise<void> => {
  try {
    if (!conversationId) return;

    const { error } = await supabase
      .from("ai_help_logs")
      .update({ feedback })
      .eq("id", conversationId);

    if (error) throw error;
  } catch (error) {
    console.error("Error saving feedback:", error);
    // Don't throw here to prevent breaking the user experience
    // Just log the error
  }
};

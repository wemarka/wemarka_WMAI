import { supabase } from "@/lib/supabase";
import { AIHelpLog, AIHelpRequest, AIHelpResponse } from "@/frontend/types/ai";

/**
 * Send a question to the AI assistant and get a response
 * @param question The user's question
 * @param context Optional context to provide to the AI
 * @returns The AI's response
 */
export const askAI = async (
  question: string,
  context?: string,
): Promise<AIHelpResponse> => {
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

    // Save the conversation to Supabase if user is logged in
    if (user?.user?.id && data.response) {
      await saveConversation(user.user.id, question, data.response);
    }

    return data as AIHelpResponse;
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
): Promise<void> => {
  try {
    const { error } = await supabase.from("ai_help_logs").insert({
      user_id: userId,
      question,
      response,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving conversation:", error);
    // Don't throw here to prevent breaking the user experience
    // Just log the error
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

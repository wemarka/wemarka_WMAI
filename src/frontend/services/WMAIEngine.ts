import { supabase } from "@/lib/supabase";
import {
  AIHelpLog,
  AIHelpRequest,
  AIHelpResponse,
  FeedbackType,
} from "@/frontend/types/ai";
import {
  CampaignType,
  MarketingPrompt,
  AIGeneratedCampaign,
  CustomerBehaviorData,
} from "@/frontend/types/marketing";

/**
 * WMAIEngine - Centralized service for AI interactions across the application
 * Handles connections to Supabase and OpenAI for various AI functionalities
 */
export class WMAIEngine {
  /**
   * Fetch prompt history from Supabase
   * @param userId The user's ID
   * @param limit Maximum number of prompts to fetch
   * @param campaignType Optional filter by campaign type
   * @returns Array of marketing prompts
   */
  static async getPromptHistory(
    userId: string,
    limit: number = 10,
    campaignType?: CampaignType,
  ): Promise<MarketingPrompt[]> {
    try {
      let query = supabase
        .from("ai_help_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Filter by campaign type if provided
      if (campaignType) {
        query = query.ilike("question", `%${campaignType}%`);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;

      // Convert to MarketingPrompt format
      return (data || []).map((log) => ({
        id: log.id,
        userId: log.user_id,
        prompt: log.question,
        response: log.response,
        campaignType: this.detectCampaignType(log.question),
        createdAt: log.created_at,
        feedback: log.feedback,
      }));
    } catch (error) {
      console.error("Error fetching prompt history:", error);
      return [];
    }
  }

  /**
   * Generate suggestions based on campaign type and user history
   * @param campaignType The type of campaign
   * @param userId The user's ID
   * @returns Array of suggested prompts
   */
  static async generateSuggestions(
    campaignType: CampaignType,
    userId: string,
  ): Promise<string[]> {
    try {
      // Get user's prompt history for this campaign type
      const history = await this.getPromptHistory(userId, 5, campaignType);

      // Call the Supabase Edge Function for AI suggestions
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-generate-suggestions",
        {
          body: { campaignType, history: history.map((h) => h.prompt) },
        },
      );

      if (error) throw error;
      return data.suggestions || [];
    } catch (error) {
      console.error("Error generating suggestions:", error);

      // Fallback suggestions if AI fails
      const fallbackSuggestions = {
        social: [
          "Create an engaging social media post about our new product",
          "Design a carousel post highlighting customer testimonials",
          "Draft a trending hashtag campaign for our brand",
        ],
        email: [
          "Write a compelling email subject line for our summer sale",
          "Create an email newsletter template with personalized sections",
          "Design an abandoned cart recovery email sequence",
        ],
        content: [
          "Generate a blog post outline about industry trends",
          "Create a listicle of top 10 tips for our customers",
          "Draft a case study template highlighting customer success",
        ],
        ads: [
          "Write Google Ad copy with strong call-to-actions",
          "Create Facebook ad headlines that drive conversions",
          "Design a remarketing campaign targeting website visitors",
        ],
      };

      return (
        fallbackSuggestions[campaignType] || [
          "Generate marketing content for our campaign",
          "Create engaging copy for our target audience",
          "Design a promotional strategy for our new product",
        ]
      );
    }
  }

  /**
   * Analyze customer behavior and generate custom campaigns
   * @param customerData Customer behavior data
   * @returns Generated campaign recommendations
   */
  static async generateCustomCampaigns(
    customerData: CustomerBehaviorData,
  ): Promise<AIGeneratedCampaign[]> {
    try {
      // Call the Supabase Edge Function for campaign generation
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-generate-campaigns",
        {
          body: { customerData },
        },
      );

      if (error) throw error;
      return data.campaigns || [];
    } catch (error) {
      console.error("Error generating custom campaigns:", error);

      // Return fallback campaigns if AI fails
      return [
        {
          id: "fallback-1",
          title: "Personalized Email Campaign",
          description: "Target customers based on their browsing history",
          content:
            "Hello [Customer Name], We noticed you've been looking at our [Product Category]. Check out our latest offerings!",
          type: "email",
          targetAudience: "Recent website visitors",
          estimatedImpact: "Medium",
          createdAt: new Date().toISOString(),
        },
        {
          id: "fallback-2",
          title: "Social Media Engagement Campaign",
          description: "Increase brand awareness through social media",
          content:
            "Join the conversation! Share your experience with [Brand] products and use hashtag #BrandLove to be featured.",
          type: "social",
          targetAudience: "Existing customers",
          estimatedImpact: "High",
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  /**
   * Save a prompt to the history
   * @param userId User ID
   * @param prompt The prompt text
   * @param response The AI response
   * @param campaignType Optional campaign type
   * @returns The saved prompt ID
   */
  static async savePrompt(
    userId: string,
    prompt: string,
    response: string,
    campaignType?: CampaignType,
  ): Promise<string | null> {
    try {
      // Add campaign type to the prompt if provided
      const enhancedPrompt = campaignType
        ? `[${campaignType}] ${prompt}`
        : prompt;

      const { data, error } = await supabase
        .from("ai_help_logs")
        .insert({
          user_id: userId,
          question: enhancedPrompt,
          response,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error("Error saving prompt:", error);
      return null;
    }
  }

  /**
   * Detect campaign type from prompt text
   * @param prompt The prompt text
   * @returns Detected campaign type or default
   */
  private static detectCampaignType(prompt: string): CampaignType {
    const lowerPrompt = prompt.toLowerCase();

    if (prompt.startsWith("[") && prompt.includes("]")) {
      // Extract from format: "[campaignType] rest of prompt"
      const match = prompt.match(/\[(\w+)\]/);
      if (match && ["social", "email", "content", "ads"].includes(match[1])) {
        return match[1] as CampaignType;
      }
    }

    if (
      lowerPrompt.includes("social") ||
      lowerPrompt.includes("facebook") ||
      lowerPrompt.includes("instagram") ||
      lowerPrompt.includes("twitter") ||
      lowerPrompt.includes("linkedin")
    ) {
      return "social";
    }

    if (
      lowerPrompt.includes("email") ||
      lowerPrompt.includes("newsletter") ||
      lowerPrompt.includes("subject line")
    ) {
      return "email";
    }

    if (
      lowerPrompt.includes("blog") ||
      lowerPrompt.includes("article") ||
      lowerPrompt.includes("content") ||
      lowerPrompt.includes("post")
    ) {
      return "content";
    }

    if (
      lowerPrompt.includes("ad") ||
      lowerPrompt.includes("advertisement") ||
      lowerPrompt.includes("campaign") ||
      lowerPrompt.includes("google ads")
    ) {
      return "ads";
    }

    return "content"; // Default type
  }
}

export default WMAIEngine;

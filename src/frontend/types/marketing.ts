/**
 * Marketing module type definitions
 */

// Campaign types supported by the AI system
export type CampaignType = "social" | "email" | "content" | "ads";

// Marketing prompt history item
export interface MarketingPrompt {
  id: string;
  userId: string;
  prompt: string;
  response: string;
  campaignType: CampaignType;
  createdAt: string;
  feedback?: "positive" | "negative" | null;
}

// AI-generated campaign
export interface AIGeneratedCampaign {
  id: string;
  title: string;
  description: string;
  content: string;
  type: CampaignType;
  targetAudience: string;
  estimatedImpact: "Low" | "Medium" | "High";
  createdAt: string;
  metrics?: CampaignMetrics;
}

// Campaign performance metrics
export interface CampaignMetrics {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number; // Click-through rate
  conversionRate?: number;
  roi?: number; // Return on investment
}

// Customer behavior data for AI analysis
export interface CustomerBehaviorData {
  segments: CustomerSegment[];
  recentInteractions: CustomerInteraction[];
  preferences: CustomerPreferences;
  demographics?: CustomerDemographics;
}

// Customer segment information
export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  interests: string[];
}

// Customer interaction data
export interface CustomerInteraction {
  type:
    | "website_visit"
    | "purchase"
    | "email_open"
    | "social_engagement"
    | "support";
  timestamp: string;
  details: Record<string, any>;
}

// Customer preferences
export interface CustomerPreferences {
  preferredChannels: ("email" | "social" | "sms" | "push" | "web")[];
  interests: string[];
  productCategories: string[];
  communicationFrequency: "daily" | "weekly" | "monthly" | "quarterly";
}

// Customer demographics
export interface CustomerDemographics {
  ageGroups: Record<string, number>; // e.g., "18-24": 30 (percent)
  genders: Record<string, number>; // e.g., "female": 55 (percent)
  locations: Record<string, number>; // e.g., "New York": 15 (percent)
  incomeRanges?: Record<string, number>; // e.g., "50k-75k": 25 (percent)
}

// Campaign creation request
export interface CampaignCreationRequest {
  title: string;
  type: CampaignType;
  targetAudience: string[];
  goals: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
  contentPrompt?: string;
}

// Campaign template
export interface CampaignTemplate {
  id: string;
  name: string;
  type: CampaignType;
  description: string;
  structure: string;
  sampleContent: string;
  bestPractices: string[];
}

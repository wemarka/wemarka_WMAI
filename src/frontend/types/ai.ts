export interface AIHelpLog {
  id: string;
  user_id: string;
  question: string;
  response: string;
  feedback?: FeedbackType;
  created_at: string;
  updated_at: string;
}

export type FeedbackType = "positive" | "negative" | null;

export interface AIHelpRequest {
  question: string;
  context?: string;
}

export interface AIHelpResponse {
  response: string;
  sources?: string[];
}

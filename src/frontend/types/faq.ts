export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  lang: string;
  created_at?: string;
  updated_at?: string;
  feedback_stats?: FAQFeedbackStats;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export interface FAQFeedbackStats {
  total_votes: number;
  helpful_votes: number;
  unhelpful_votes: number;
  helpful_percentage: number;
}

export interface FAQFeedback {
  id?: string;
  faq_id: string;
  user_id?: string;
  helpful: boolean;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupportAnalytics {
  totalFAQs: number;
  activeSearches: number;
  feedbackResponses: number;
  unansweredQuestions: number;
  searchesByDay?: { date: string; count: number }[];
  feedbackByRating?: { rating: number; count: number }[];
  topSearchTerms?: { term: string; count: number }[];
  categoryDistribution?: { category: string; count: number }[];
}

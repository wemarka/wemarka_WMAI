export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  lang: string;
  created_at?: string;
  updated_at?: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
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

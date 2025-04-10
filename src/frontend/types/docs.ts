export interface Doc {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  lang: string;
  created_at?: string;
  updated_at?: string;
  feedback_stats?: DocFeedbackStats;
}

export interface DocCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export interface DocFeedbackStats {
  total_votes: number;
  helpful_votes: number;
  unhelpful_votes: number;
  helpful_percentage: number;
}

export interface DocFeedback {
  id?: string;
  doc_id: string;
  user_id?: string;
  helpful: boolean;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

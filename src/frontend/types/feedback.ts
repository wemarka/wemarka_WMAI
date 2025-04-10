export interface FeedbackFormData {
  rating: number;
  feedback?: string;
  module?: string;
}

export interface UserFeedback extends FeedbackFormData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AIHelpLog {
  id: string;
  user_id: string;
  question: string;
  response: string;
  created_at: string;
  updated_at: string;
}

export interface AIHelpRequest {
  question: string;
  context?: string;
}

export interface AIHelpResponse {
  response: string;
  sources?: string[];
}

export interface Doc {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  lang: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Define your tables here
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string | null;
        };
      };
    };
  };
}

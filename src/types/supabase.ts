export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_help_logs: {
        Row: {
          created_at: string | null
          id: string
          question: string
          response: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question: string
          response: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question?: string
          response?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      doc_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          doc_id: string
          helpful: boolean
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          doc_id: string
          helpful: boolean
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          doc_id?: string
          helpful?: boolean
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doc_feedback_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
        ]
      }
      docs: {
        Row: {
          category: string
          content: string
          created_at: string | null
          description: string | null
          id: string
          lang: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          lang?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          lang?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faq_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          faq_id: string
          helpful: boolean
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          faq_id: string
          helpful: boolean
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          faq_id?: string
          helpful?: boolean
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_feedback_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          id: string
          lang: string
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category: string
          created_at?: string | null
          id?: string
          lang?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          id?: string
          lang?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_usage: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          module: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          module: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          module?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_draft_layouts: {
        Row: {
          created_at: string | null
          id: string
          name: string
          sections: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          sections: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          sections?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      homepage_layouts: {
        Row: {
          created_at: string | null
          id: string
          layout_data: Json
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          layout_data: Json
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          layout_data?: Json
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      homepage_published_layouts: {
        Row: {
          created_at: string | null
          draft_id: string | null
          id: string
          name: string
          published_at: string | null
          sections: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          draft_id?: string | null
          id?: string
          name: string
          published_at?: string | null
          sections: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          draft_id?: string | null
          id?: string
          name?: string
          published_at?: string | null
          sections?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homepage_published_layouts_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "homepage_draft_layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      module_access: {
        Row: {
          access_time: string
          created_at: string | null
          duration: number | null
          id: string
          module: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          access_time?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          module: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          access_time?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          module?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_access_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          allowed: boolean | null
          created_at: string | null
          id: string
          module: string
          role_id: string
          updated_at: string | null
        }
        Insert: {
          action: string
          allowed?: boolean | null
          created_at?: string | null
          id?: string
          module: string
          role_id: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          allowed?: boolean | null
          created_at?: string | null
          id?: string
          module?: string
          role_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string | null
          first_response_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          first_response_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          first_response_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      test_logs: {
        Row: {
          created_at: string | null
          duration: number
          error: string | null
          id: string
          logs: Json | null
          module: string
          status: string
          test_id: string
          test_name: string
        }
        Insert: {
          created_at?: string | null
          duration: number
          error?: string | null
          id?: string
          logs?: Json | null
          module: string
          status: string
          test_id: string
          test_name: string
        }
        Update: {
          created_at?: string | null
          duration?: number
          error?: string | null
          id?: string
          logs?: Json | null
          module?: string
          status?: string
          test_id?: string
          test_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string | null
          device: string | null
          duration: number | null
          id: string
          ip_address: string | null
          os: string | null
          session_end: string | null
          session_start: string
          user_id: string
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device?: string | null
          duration?: number | null
          id?: string
          ip_address?: string | null
          os?: string | null
          session_end?: string | null
          session_start?: string
          user_id: string
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device?: string | null
          duration?: number | null
          id?: string
          ip_address?: string | null
          os?: string | null
          session_end?: string | null
          session_start?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      doc_feedback_stats: {
        Row: {
          doc_id: string | null
          helpful_percentage: number | null
          helpful_votes: number | null
          total_votes: number | null
          unhelpful_votes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doc_feedback_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_feedback_stats: {
        Row: {
          faq_id: string | null
          helpful_percentage: number | null
          helpful_votes: number | null
          total_votes: number | null
          unhelpful_votes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_feedback_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sales: {
        Row: {
          category: string | null
          date: string | null
          image_url: string | null
          product_id: string | null
          product_name: string | null
          total_sales: number | null
          units_sold: number | null
        }
        Relationships: []
      }
      sales_summary: {
        Row: {
          avg_order_value: number | null
          date: string | null
          order_count: number | null
          total_amount: number | null
        }
        Relationships: []
      }
      test_summary_view: {
        Row: {
          coverage: number | null
          failed: number | null
          last_run: string | null
          module: string | null
          passed: number | null
          total_tests: number | null
        }
        Relationships: []
      }
      ticket_response_rate: {
        Row: {
          avg_response_time: number | null
          category: string | null
          resolution_rate: number | null
          ticket_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

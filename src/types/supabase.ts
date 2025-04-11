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
      ai_development_recommendations: {
        Row: {
          analysis_id: string | null
          category: string
          code_snippet: string | null
          created_at: string | null
          description: string
          estimated_hours: number | null
          feedback: string | null
          id: string
          implementation_difficulty: string | null
          priority: string
          related_module: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          analysis_id?: string | null
          category: string
          code_snippet?: string | null
          created_at?: string | null
          description: string
          estimated_hours?: number | null
          feedback?: string | null
          id?: string
          implementation_difficulty?: string | null
          priority: string
          related_module?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          analysis_id?: string | null
          category?: string
          code_snippet?: string | null
          created_at?: string | null
          description?: string
          estimated_hours?: number | null
          feedback?: string | null
          id?: string
          implementation_difficulty?: string | null
          priority?: string
          related_module?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_development_recommendations_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "code_analysis_results"
            referencedColumns: ["id"]
          },
        ]
      }
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
      ai_recommendations: {
        Row: {
          category: string
          code_snippet: string | null
          created_at: string | null
          description: string
          estimated_hours: number | null
          feedback: string | null
          id: string
          implementation_difficulty: string | null
          priority: string
          related_module: string | null
          status: string
          title: string
        }
        Insert: {
          category: string
          code_snippet?: string | null
          created_at?: string | null
          description: string
          estimated_hours?: number | null
          feedback?: string | null
          id?: string
          implementation_difficulty?: string | null
          priority: string
          related_module?: string | null
          status: string
          title: string
        }
        Update: {
          category?: string
          code_snippet?: string | null
          created_at?: string | null
          description?: string
          estimated_hours?: number | null
          feedback?: string | null
          id?: string
          implementation_difficulty?: string | null
          priority?: string
          related_module?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string | null
          id: string
          price: number
          product_id: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string | null
          id?: string
          price: number
          product_id: string
          quantity: number
          updated_at?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string | null
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sales"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      code_analysis_results: {
        Row: {
          analysis_date: string | null
          analysis_type: string
          branch: string | null
          code_quality_score: number | null
          code_snippet: string | null
          created_at: string | null
          file_path: string | null
          id: string
          performance_score: number | null
          repository_url: string | null
          security_score: number | null
          summary: string | null
          user_id: string | null
        }
        Insert: {
          analysis_date?: string | null
          analysis_type: string
          branch?: string | null
          code_quality_score?: number | null
          code_snippet?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: string
          performance_score?: number | null
          repository_url?: string | null
          security_score?: number | null
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_date?: string | null
          analysis_type?: string
          branch?: string | null
          code_quality_score?: number | null
          code_snippet?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: string
          performance_score?: number | null
          repository_url?: string | null
          security_score?: number | null
          summary?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      development_roadmaps: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_completion: string | null
          focus_areas: Json | null
          id: string
          risks: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_completion?: string | null
          focus_areas?: Json | null
          id?: string
          risks?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_completion?: string | null
          focus_areas?: Json | null
          id?: string
          risks?: Json | null
          title?: string
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
      git_commits: {
        Row: {
          additions: number | null
          author: string | null
          branch: string | null
          commit_hash: string
          created_at: string | null
          date: string
          deletions: number | null
          files_changed: number | null
          id: string
          message: string | null
          repository: string | null
        }
        Insert: {
          additions?: number | null
          author?: string | null
          branch?: string | null
          commit_hash: string
          created_at?: string | null
          date: string
          deletions?: number | null
          files_changed?: number | null
          id?: string
          message?: string | null
          repository?: string | null
        }
        Update: {
          additions?: number | null
          author?: string | null
          branch?: string | null
          commit_hash?: string
          created_at?: string | null
          date?: string
          deletions?: number | null
          files_changed?: number | null
          id?: string
          message?: string | null
          repository?: string | null
        }
        Relationships: []
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
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          customer: string
          date: string
          due_date: string
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer: string
          date: string
          due_date: string
          id?: string
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer?: string
          date?: string
          due_date?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          name: string
          progress: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          name: string
          progress: number
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          name?: string
          progress?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
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
      module_progress: {
        Row: {
          completed_tasks: number
          contributors: string[] | null
          created_at: string | null
          id: string
          last_activity: string | null
          module: string
          progress: number
          total_tasks: number
          updated_at: string | null
        }
        Insert: {
          completed_tasks?: number
          contributors?: string[] | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          module: string
          progress: number
          total_tasks?: number
          updated_at?: string | null
        }
        Update: {
          completed_tasks?: number
          contributors?: string[] | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          module?: string
          progress?: number
          total_tasks?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sales"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
      payrolls: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          employee: string
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          employee: string
          id?: string
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          employee?: string
          id?: string
          status?: string
          updated_at?: string | null
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
      project_metrics: {
        Row: {
          average_issue_resolution_time: number | null
          burndown: Json | null
          closed_issues: number
          code_quality: Json | null
          contributors: number
          created_at: string | null
          id: string
          merged_pull_requests: number
          open_issues: number
          pull_requests: number
          total_commits: number
          total_files: number
          total_lines: number
          updated_at: string | null
          velocity: number | null
        }
        Insert: {
          average_issue_resolution_time?: number | null
          burndown?: Json | null
          closed_issues?: number
          code_quality?: Json | null
          contributors?: number
          created_at?: string | null
          id?: string
          merged_pull_requests?: number
          open_issues?: number
          pull_requests?: number
          total_commits?: number
          total_files?: number
          total_lines?: number
          updated_at?: string | null
          velocity?: number | null
        }
        Update: {
          average_issue_resolution_time?: number | null
          burndown?: Json | null
          closed_issues?: number
          code_quality?: Json | null
          contributors?: number
          created_at?: string | null
          id?: string
          merged_pull_requests?: number
          open_issues?: number
          pull_requests?: number
          total_commits?: number
          total_files?: number
          total_lines?: number
          updated_at?: string | null
          velocity?: number | null
        }
        Relationships: []
      }
      project_stages: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner: string | null
          progress: number
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner?: string | null
          progress: number
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner?: string | null
          progress?: number
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          created_at: string | null
          features: string[] | null
          id: string
          name: string
          release_date: string
          status: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          name: string
          release_date: string
          status: string
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          name?: string
          release_date?: string
          status?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      roadmap_phases: {
        Row: {
          created_at: string | null
          dependencies: Json | null
          description: string | null
          duration: string | null
          id: string
          name: string
          order_index: number
          priority: string
          roadmap_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: Json | null
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          order_index: number
          priority: string
          roadmap_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: Json | null
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          order_index?: number
          priority?: string
          roadmap_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_phases_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "development_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_tasks: {
        Row: {
          assignee: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number
          phase_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index: number
          phase_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          phase_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "roadmap_phases"
            referencedColumns: ["id"]
          },
        ]
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
      tasks: {
        Row: {
          actual_hours: number | null
          assignee: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          name: string
          priority: string
          stage_id: string
          status: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assignee?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          priority: string
          stage_id: string
          status: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assignee?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          priority?: string
          stage_id?: string
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "project_stages"
            referencedColumns: ["id"]
          },
        ]
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

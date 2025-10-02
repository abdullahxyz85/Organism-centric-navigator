export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organisms: {
        Row: {
          id: string
          name: string
          common_name: string | null
          scientific_name: string | null
          synonyms: string[]
          category: string
          description: string | null
          image_url: string | null
          experiment_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          common_name?: string | null
          scientific_name?: string | null
          synonyms?: string[]
          category: string
          description?: string | null
          image_url?: string | null
          experiment_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          common_name?: string | null
          scientific_name?: string | null
          synonyms?: string[]
          category?: string
          description?: string | null
          image_url?: string | null
          experiment_count?: number
          created_at?: string
        }
      }
      papers: {
        Row: {
          id: string
          title: string
          authors: string[]
          publication_date: string | null
          journal: string | null
          doi: string | null
          abstract: string | null
          pdf_url: string | null
          summary: string | null
          key_findings: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          authors?: string[]
          publication_date?: string | null
          journal?: string | null
          doi?: string | null
          abstract?: string | null
          pdf_url?: string | null
          summary?: string | null
          key_findings?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          authors?: string[]
          publication_date?: string | null
          journal?: string | null
          doi?: string | null
          abstract?: string | null
          pdf_url?: string | null
          summary?: string | null
          key_findings?: string[]
          created_at?: string
        }
      }
      experiments: {
        Row: {
          id: string
          paper_id: string | null
          organism_id: string | null
          conditions: string[]
          duration_days: number | null
          key_results: string | null
          metrics: Json
          created_at: string
        }
        Insert: {
          id?: string
          paper_id?: string | null
          organism_id?: string | null
          conditions?: string[]
          duration_days?: number | null
          key_results?: string | null
          metrics?: Json
          created_at?: string
        }
        Update: {
          id?: string
          paper_id?: string | null
          organism_id?: string | null
          conditions?: string[]
          duration_days?: number | null
          key_results?: string | null
          metrics?: Json
          created_at?: string
        }
      }
      conditions: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}

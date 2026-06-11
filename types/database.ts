export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          facebook_url: string | null
          line_id: string | null
          contact_is_public: boolean
          analytics_consent: boolean
          deletion_requested_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      projects: {
        Row: {
          id: string
          owner_id: string | null
          slug: string
          name: string
          url: string
          description: string | null
          category: string
          screenshot_url: string | null
          is_active: boolean
          source: 'scraped' | 'submitted'
          source_fb_comment_url: string | null
          scraped_by: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      claim_requests: {
        Row: {
          id: string
          project_id: string
          claimer_id: string
          note: string | null
          status: 'pending' | 'approved' | 'rejected'
          rejection_reason: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['claim_requests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['claim_requests']['Insert']>
      }
      categories: {
        Row: {
          id: string
          slug: string
          name_th: string
          name_en: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      user_consents: {
        Row: {
          id: string
          user_id: string
          contact_consent: boolean
          analytics_consent: boolean
          consented_at: string
          ip_hash: string | null
        }
        Insert: Omit<Database['public']['Tables']['user_consents']['Row'], 'id' | 'consented_at'>
        Update: Partial<Database['public']['Tables']['user_consents']['Insert']>
      }
      stats_cache: {
        Row: {
          key: string
          value: number
          updated_at: string
        }
        Insert: Database['public']['Tables']['stats_cache']['Row']
        Update: Partial<Database['public']['Tables']['stats_cache']['Row']>
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ClaimRequest = Database['public']['Tables']['claim_requests']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type UserConsent = Database['public']['Tables']['user_consents']['Row']
export type StatsCache = Database['public']['Tables']['stats_cache']['Row']

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
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          original_url: string | null;
          original_file: string | null;
          duration: number;
          status: "pending" | "processing" | "completed" | "failed";
          error: string | null;
          settings: {
            enhance: boolean;
            captions: boolean;
            background_music?: string | null;
          };
          output_files: Json[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          original_url?: string | null;
          original_file?: string | null;
          duration: number;
          status?: "pending" | "processing" | "completed" | "failed";
          error?: string | null;
          settings?: {
            enhance: boolean;
            captions: boolean;
            background_music?: string | null;
          };
          output_files?: Json[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          original_url?: string | null;
          original_file?: string | null;
          duration?: number;
          status?: "pending" | "processing" | "completed" | "failed";
          error?: string | null;
          settings?: {
            enhance: boolean;
            captions: boolean;
            background_music?: string | null;
          };
          output_files?: Json[];
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: "purchase" | "usage" | "bonus" | "refund";
          description: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: "purchase" | "usage" | "bonus" | "refund";
          description?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: "purchase" | "usage" | "bonus" | "refund";
          description?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string;
          stripe_price_id: string;
          status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
          current_period_start: string;
          current_period_end: string;
          cancel_at: string | null;
          canceled_at: string | null;
          trial_start: string | null;
          trial_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id: string;
          stripe_price_id: string;
          status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
          current_period_start: string;
          current_period_end: string;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string;
          stripe_price_id?: string;
          status?: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid";
          current_period_start?: string;
          current_period_end?: string;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];

// Table types
export type User = Tables<"users">;
export type Video = Tables<"videos">;
export type CreditTransaction = Tables<"credit_transactions">;
export type Subscription = Tables<"subscriptions">;

// Insert types
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];
export type CreditTransactionInsert = Database["public"]["Tables"]["credit_transactions"]["Insert"];
export type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];

// Update types
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type VideoUpdate = Database["public"]["Tables"]["videos"]["Update"];
export type CreditTransactionUpdate = Database["public"]["Tables"]["credit_transactions"]["Update"];
export type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"];
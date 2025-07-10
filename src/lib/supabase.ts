import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'freshman' | 'senior';
          join_date: string;
          profile_data: any;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'freshman' | 'senior';
          profile_data?: any;
        };
        Update: {
          name?: string;
          role?: 'freshman' | 'senior';
          profile_data?: any;
        };
      };
      questions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          created_at: string;
          status: 'open' | 'answered' | 'closed';
          upvotes: number;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
          category: string;
          status?: 'open' | 'answered' | 'closed';
        };
        Update: {
          title?: string;
          content?: string;
          category?: string;
          status?: 'open' | 'answered' | 'closed';
          upvotes?: number;
        };
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          user_id: string;
          content: string;
          created_at: string;
          upvotes: number;
          is_best_answer: boolean;
        };
        Insert: {
          question_id: string;
          user_id: string;
          content: string;
        };
        Update: {
          content?: string;
          upvotes?: number;
          is_best_answer?: boolean;
        };
      };
    };
  };
};
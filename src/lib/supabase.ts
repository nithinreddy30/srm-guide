import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not configured. Using mock client.');
  // Create a mock client that won't break the app
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured'))
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) })
    })
  } as any;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
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
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase - Future me yahi DB banega.
// Abhi local pe chalega, jab key daaloge to cloud sync on.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(url, anon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Tables: profiles, transactions, budgets - schema.sql me hai
export type Transaction = {
  id?: string;
  user_id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  date: string;
  created_at?: string;
};

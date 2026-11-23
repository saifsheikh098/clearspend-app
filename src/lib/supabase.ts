import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

function cleanEnv(val?: string): string {
  return (val || '').trim().replace(/^['"]|['"]$/g, '');
}

const rawUrl = cleanEnv(process.env.EXPO_PUBLIC_SUPABASE_URL);
const rawAnon = cleanEnv(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const url = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
  ? rawUrl
  : 'https://placeholder.supabase.co';
const anon = rawAnon || 'placeholder-key';

export const supabase = createClient(url, anon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

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

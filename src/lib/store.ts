// Local first - Supabase nahi hai tab bhi app chalegi
// Jab Supabase on hoga to sync hoga
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, Transaction } from './supabase';

export async function getTransactions(): Promise<Transaction[]> {
  try {
    // 1. Pehle Supabase try karo
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (data && data.length) return data as Transaction[];
  } catch {}
  // 2. Fail hua to Local se lo
  const local = await AsyncStorage.getItem('clearspend_txs');
  return local ? JSON.parse(local) : [];
}

export async function addTransaction(tx: Transaction) {
  const local = await getTransactions();
  const updated = [tx, ...local];
  await AsyncStorage.setItem('clearspend_txs', JSON.stringify(updated));
  try {
    await supabase.from('transactions').insert(tx);
  } catch {}
  return updated;
}

export async function deleteTransaction(id: string) {
  const local = await getTransactions();
  const updated = local.filter(t => String(t.id) !== String(id));
  await AsyncStorage.setItem('clearspend_txs', JSON.stringify(updated));
  try {
    await supabase.from('transactions').delete().eq('id', id);
  } catch {}
  return updated;
}

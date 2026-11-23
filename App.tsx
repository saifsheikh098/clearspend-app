import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import { getTransactions, addTransaction, deleteTransaction } from './src/lib/store';
import { Transaction } from './src/lib/supabase';

export default function App() {
  const [tab, setTab] = useState<'home' | 'ai'>('home');
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then(setTxs);
  }, []);

  async function handleAdd(tx: Transaction) {
    const updated = await addTransaction(tx);
    setTxs(updated);
  }

  async function handleDelete(id: string) {
    const updated = await deleteTransaction(id);
    setTxs(updated);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0 }}>
      <View style={{ flexDirection: 'row', padding: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>ClearSpend ₹</Text>
      </View>

      {tab === 'home' ? (
        <HomeScreen txs={txs} onAdd={handleAdd} onDelete={handleDelete} />
      ) : (
        <AIChatScreen transactions={txs} />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
        <TouchableOpacity onPress={() => setTab('home')}>
          <Text style={{ fontWeight: tab === 'home' ? '800' : '500', color: tab === 'home' ? '#16a34a' : '#64748b' }}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('ai')}>
          <Text style={{ fontWeight: tab === 'ai' ? '800' : '500', color: tab === 'ai' ? '#16a34a' : '#64748b' }}>🤖 AI Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

registerRootComponent(App);

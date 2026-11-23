import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import { getTransactions } from './src/lib/store';

export default function App() {
  const [tab, setTab] = useState<'home' | 'ai'>('home');
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    getTransactions().then(setTxs);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 12, justifyContent: 'center', gap: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '800' }}>ClearSpend ₹</Text>
      </View>

      {tab === 'home' ? (
        <HomeScreen txs={txs} onAdd={() => {}} />
      ) : (
        <AIChatScreen transactions={txs} />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
        <TouchableOpacity onPress={() => setTab('home')}>
          <Text>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('ai')}>
          <Text>🤖 AI Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { askAI } from '../lib/ai';

// FUTURE AI CHAT SCREEN - Play Store me ye highlight feature hoga
// User puchega: "Mera is mahine kitna kharcha hua?" -> AI transactions dekh ke jawab dega
export default function AIChatScreen({ transactions }: any) {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Hi! Main ClearSpend AI hu 🤖\nPucho - "Mera Render pe kitna kharcha hua?" ya "Paise kaise bachau?"' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMsgs((p: any) => [...p, userMsg]);
    setInput('');
    setLoading(true);
    const reply = await askAI([...msgs, userMsg], transactions);
    setMsgs((p: any) => [...p, { role: 'assistant', content: reply }]);
    setLoading(false);
  }

  return (
    <View style={s.wrap}>
      <Text style={s.title}>ClearSpend AI ✨</Text>
      <ScrollView style={s.chat}>
        {msgs.map((m: any, i: number) => (
          <View key={i} style={[s.bubble, m.role === 'user' ? s.user : s.ai]}>
            <Text style={{ color: m.role === 'user' ? '#fff' : '#0f172a' }}>{m.content}</Text>
          </View>
        ))}
        {loading && <Text>AI soch raha hai...</Text>}
      </ScrollView>
      <View style={s.row}>
        <TextInput style={s.input} value={input} onChangeText={setInput} placeholder="AI se pucho..." />
        <TouchableOpacity style={s.btn} onPress={send}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '800' },
  chat: { flex: 1, marginVertical: 12 },
  bubble: { padding: 12, borderRadius: 14, marginBottom: 8, maxWidth: '85%' },
  user: { backgroundColor: '#16a34a', alignSelf: 'flex-end' },
  ai: { backgroundColor: '#fff', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  btn: { backgroundColor: '#16a34a', paddingHorizontal: 18, borderRadius: 12, justifyContent: 'center' }
});

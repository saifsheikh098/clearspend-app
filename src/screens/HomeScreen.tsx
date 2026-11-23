import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Home - Balance + Transactions list - Clean UI
export default function HomeScreen({ txs, onAdd }: any) {
  const income = txs
    .filter((t: any) => t.type === 'income')
    .reduce((s: number, t: any) => s + t.amount, 0);
  const expense = txs
    .filter((t: any) => t.type === 'expense')
    .reduce((s: number, t: any) => s + t.amount, 0);

  return (
    <View style={s.wrap}>
      <View style={s.card}>
        <Text style={s.label}>Total Balance</Text>
        <Text style={s.bal}>₹{(income - expense).toLocaleString('en-IN')}</Text>
        <View style={s.row}>
          <Text style={{ color: '#fff' }}>Income ₹{income}</Text>
          <Text style={{ color: '#fff' }}>Expense ₹{expense}</Text>
        </View>
      </View>

      <Text style={s.h}>Recent Transactions</Text>

      <FlatList
        data={txs}
        keyExtractor={(i: any) => String(i.id)}
        renderItem={({ item }: any) => (
          <View style={s.tx}>
            <Text style={{ flex: 1 }}>{item.note} • {item.category}</Text>
            <Text style={{ color: item.type === 'income' ? '#16a34a' : '#ef4444', fontWeight: '700' }}>
              {item.type === 'income' ? '+' : '-'}₹{item.amount}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 20 }}>
            Koi transaction nahi - + dabao
          </Text>
        }
      />

      <TouchableOpacity style={s.fab} onPress={onAdd}>
        <Text style={{ color: '#fff', fontSize: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#111827', borderRadius: 20, padding: 18 },
  label: { color: '#9ca3af' },
  bal: { color: '#fff', fontSize: 32, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  h: { fontSize: 16, fontWeight: '700', marginVertical: 12 },
  tx: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' }
});

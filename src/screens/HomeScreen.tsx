import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';

const EXPENSE_CATS = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Other'];
const INCOME_CATS = ['Salary', 'Business', 'Freelance', 'Other'];

export default function HomeScreen({ txs, onAdd, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');

  const income = txs
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const expense = txs
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  function switchType(newType: 'expense' | 'income') {
    setType(newType);
    setCategory(newType === 'expense' ? 'Food' : 'Salary');
  }

  async function saveTx() {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert('Sahi Amount Daalo', 'Amount 0 se zyada hona chahiye.');
      return;
    }

    await onAdd({
      id: Date.now().toString(),
      type,
      amount: num,
      category,
      note: note.trim() || category,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setNote('');
    setOpen(false);
  }

  function confirmDelete(id: string) {
    Alert.alert('Delete Transaction?', 'Kya aap ise hatana chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  }

  const categories = type === 'expense' ? EXPENSE_CATS : INCOME_CATS;

  return (
    <View style={s.wrap}>
      <View style={s.card}>
        <Text style={s.label}>Total Balance</Text>
        <Text style={s.bal}>₹{(income - expense).toLocaleString('en-IN')}</Text>
        <View style={s.row}>
          <Text style={{ color: '#4ade80', fontWeight: '600' }}>Income ₹{income.toLocaleString('en-IN')}</Text>
          <Text style={{ color: '#f87171', fontWeight: '600' }}>Expense ₹{expense.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <Text style={s.h}>Recent Transactions</Text>

      <FlatList
        data={txs}
        keyExtractor={(i: any, idx: number) => String(i.id || idx)}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }: any) => (
          <View style={s.tx}>
            <View style={{ flex: 1 }}>
              <Text style={s.txNote}>{item.note}</Text>
              <Text style={s.txMeta}>{item.category} • {item.date}</Text>
            </View>
            <Text style={{ color: item.type === 'income' ? '#16a34a' : '#ef4444', fontWeight: '700', marginRight: 10 }}>
              {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toLocaleString('en-IN')}
            </Text>
            <TouchableOpacity onPress={() => confirmDelete(String(item.id))} style={s.delBtn}>
              <Text style={{ color: '#94a3b8', fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 24 }}>
            Koi transaction nahi - niche + dabao
          </Text>
        }
      />

      <TouchableOpacity style={s.fab} onPress={() => setOpen(true)}>
        <Text style={{ color: '#fff', fontSize: 30, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={s.modalBg}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Naya Transaction</Text>

            <View style={s.typeRow}>
              <TouchableOpacity
                style={[s.typeBtn, type === 'expense' && s.expenseActive]}
                onPress={() => switchType('expense')}
              >
                <Text style={[s.typeTxt, type === 'expense' && { color: '#fff' }]}>Expense (-)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.typeBtn, type === 'income' && s.incomeActive]}
                onPress={() => switchType('income')}
              >
                <Text style={[s.typeTxt, type === 'income' && { color: '#fff' }]}>Income (+)</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={s.input}
              placeholder="Amount (₹) e.g. 250"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={s.catWrap}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[s.chip, category === c && s.chipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={{ color: category === c ? '#fff' : '#334155', fontWeight: '600', fontSize: 12 }}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={s.input}
              placeholder="Note (e.g. Chai, Petrol, Client)"
              value={note}
              onChangeText={setNote}
            />

            <View style={s.modalActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setOpen(false)}>
                <Text style={{ color: '#475569', fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={saveTx}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#111827', borderRadius: 20, padding: 18 },
  label: { color: '#9ca3af', fontSize: 13 },
  bal: { color: '#fff', fontSize: 32, fontWeight: '800', marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  h: { fontSize: 16, fontWeight: '700', marginVertical: 12, color: '#0f172a' },
  tx: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  txNote: { fontWeight: '600', color: '#0f172a', fontSize: 15 },
  txMeta: { color: '#64748b', fontSize: 12, marginTop: 2 },
  delBtn: { padding: 6 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 14 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center' },
  expenseActive: { backgroundColor: '#ef4444' },
  incomeActive: { backgroundColor: '#16a34a' },
  typeTxt: { fontWeight: '700', color: '#334155' },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 12 },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f1f5f9' },
  chipActive: { backgroundColor: '#16a34a' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#16a34a', alignItems: 'center' },
});

import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';

const TABS = ['Todo', 'Journals', 'Tracker', 'Account'];

const priorityStyles = {
  high: { label: 'Most Important', color: '#FEE2E2', border: '#EF4444' },
  normal: { label: 'Normal', color: '#DCFCE7', border: '#22C55E' },
  attention: { label: 'Needs Attention', color: '#FEF9C3', border: '#EAB308' },
};

const initialTasks = [
  { id: '1', title: 'Buy groceries', checked: false, tag: 'Shopping', priority: 'high', createdAt: '2026-02-05T09:15:00', endTime: '2026-02-05T13:00:00' },
  { id: '2', title: 'Read chapter 4', checked: true, tag: 'Study', priority: 'normal', createdAt: '2026-02-05T07:20:00', endTime: '2026-02-05T19:00:00' },
  { id: '3', title: 'Workout', checked: false, tag: 'Exercise', priority: 'attention', createdAt: '2026-02-05T06:45:00', endTime: '2026-02-05T18:00:00' },
];

const initialJournals = {
  'Personal Growth': [
    { id: 'pg-1', date: '2026-02-05', time: '08:30', text: 'Today I focused on consistency and reflection.' },
  ],
  Work: [{ id: 'w-1', date: '2026-02-04', time: '21:10', text: 'Wrapped up Q1 planning notes and priorities.' }],
  Family: [{ id: 'f-1', date: '2026-02-03', time: '19:05', text: 'Family dinner and discussed weekend plans.' }],
  Hobbies: [{ id: 'h-1', date: '2026-02-02', time: '17:25', text: 'Practiced guitar for 40 minutes.' }],
};

const initialExpenses = [
  { id: 'e1', category: 'Food', amount: 24, type: 'spent' },
  { id: 'e2', category: 'Salary', amount: 350, type: 'income' },
  { id: 'e3', category: 'Transport', amount: 12, type: 'spent' },
  { id: 'e4', category: 'Books', amount: 40, type: 'spent' },
];

function formatToday() {
  const d = new Date();
  return {
    day: d.toLocaleDateString(undefined, { weekday: 'long' }),
    date: d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

function TodoScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [sortBy, setSortBy] = useState('creation time');
  const today = formatToday();

  const sortedTasks = useMemo(() => {
    const arr = [...tasks];
    if (sortBy === 'priority') {
      const order = { high: 0, attention: 1, normal: 2 };
      arr.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === 'end time') {
      arr.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    } else {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return arr;
  }, [tasks, sortBy]);

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.dayText}>{today.day}</Text>
      <Text style={styles.dateText}>{today.date}</Text>

      <Text style={styles.sectionTitle}>Sort by</Text>
      <View style={styles.rowWrap}>
        {['creation time', 'priority', 'end time'].map((type) => (
          <Pressable
            key={type}
            onPress={() => setSortBy(type)}
            style={[styles.pill, sortBy === type && styles.pillActive]}
          >
            <Text style={[styles.pillText, sortBy === type && styles.pillTextActive]}>{type}</Text>
          </Pressable>
        ))}
      </View>

      {sortedTasks.map((task) => {
        const config = priorityStyles[task.priority];
        return (
          <Pressable
            key={task.id}
            style={[styles.taskCard, { backgroundColor: config.color, borderColor: config.border }]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={[styles.checkbox, task.checked && styles.checkboxChecked]}>
              {task.checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, task.checked && styles.taskChecked]}>{task.title}</Text>
              <View style={styles.rowWrap}>
                {task.tag ? <Text style={styles.tag}>#{task.tag}</Text> : null}
                <Text style={styles.priorityLabel}>{config.label}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function JournalScreen() {
  const [folderMode, setFolderMode] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [search, setSearch] = useState('');
  const [entryText, setEntryText] = useState('');

  const now = new Date();
  const noteHeader = `${now.toLocaleDateString()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const folders = ['All', ...Object.keys(initialJournals)];
  const flatEntries = Object.entries(initialJournals).flatMap(([folder, entries]) =>
    entries.map((entry) => ({ ...entry, folder }))
  );

  const filtered = flatEntries.filter((item) => {
    const folderOk = selectedFolder === 'All' || item.folder === selectedFolder;
    const searchOk = !search || item.date.includes(search) || item.text.toLowerCase().includes(search.toLowerCase());
    return folderOk && searchOk;
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Journals</Text>
        <Pressable style={styles.pill} onPress={() => setFolderMode((p) => !p)}>
          <Text style={styles.pillText}>{folderMode ? 'Show entries' : 'Folder only mode'}</Text>
        </Pressable>
      </View>

      <View style={styles.rowWrap}>
        {folders.map((folder) => (
          <Pressable
            key={folder}
            onPress={() => setSelectedFolder(folder)}
            style={[styles.pill, selectedFolder === folder && styles.pillActive]}
          >
            <Text style={[styles.pillText, selectedFolder === folder && styles.pillTextActive]}>{folder}</Text>
          </Pressable>
        ))}
      </View>

      {!folderMode && (
        <>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by date or note"
            style={styles.input}
          />
          {filtered.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.folder}</Text>
              <Text style={styles.muted}>{item.date} at {item.time}</Text>
              <Text style={styles.cardText}>{item.text}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>New Note</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{noteHeader}</Text>
            <View style={styles.canvasArea}>
              <Text style={styles.muted}>Drop images / stickers here (free placement canvas)</Text>
            </View>
            <TextInput
              multiline
              value={entryText}
              onChangeText={setEntryText}
              placeholder="Write your journal..."
              style={[styles.input, { minHeight: 110, textAlignVertical: 'top' }]}
            />
            <View style={styles.rowWrap}>
              <Pressable style={styles.button}><Text style={styles.buttonText}>Share as PDF</Text></Pressable>
              <Pressable style={styles.button}><Text style={styles.buttonText}>Share as image</Text></Pressable>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function TrackerScreen() {
  const [entries] = useState(initialExpenses);

  const income = entries.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const spent = entries.filter((e) => e.type === 'spent').reduce((sum, e) => sum + e.amount, 0);
  const left = income - spent;

  const spendByCategory = entries
    .filter((e) => e.type === 'spent')
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

  const maxValue = Math.max(...Object.values(spendByCategory), 1);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.summaryRow}>
        <View><Text style={styles.muted}>Income</Text><Text style={styles.summaryValue}>${income}</Text></View>
        <View><Text style={styles.muted}>Spent</Text><Text style={styles.summaryValue}>${spent}</Text></View>
        <View><Text style={styles.muted}>Left</Text><Text style={styles.summaryValue}>${left}</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Expense Table</Text>
      {entries.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.category}</Text>
          <Text style={styles.tableCell}>{item.type}</Text>
          <Text style={[styles.tableCell, { textAlign: 'right' }]}>${item.amount}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Category Analysis</Text>
      {Object.entries(spendByCategory).map(([category, value]) => (
        <View key={category} style={{ marginBottom: 10 }}>
          <Text style={styles.muted}>{category} (${value})</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${(value / maxValue) * 100}%` }]} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function AccountScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.sectionTitle}>Profile & Settings</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.cardText}>Edit profile, app theme, notifications, backup and export.</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Todo');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'Todo' && <TodoScreen />}
        {activeTab === 'Journals' && <JournalScreen />}
        {activeTab === 'Tracker' && <TrackerScreen />}
        {activeTab === 'Account' && <AccountScreen />}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1 },
  screen: { padding: 16, paddingBottom: 32 },
  dayText: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  dateText: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginVertical: 10, color: '#0F172A' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#fff' },
  pillActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  pillText: { fontSize: 12, color: '#334155' },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  taskCard: { marginTop: 12, borderRadius: 16, borderWidth: 1, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  checkboxMark: { color: '#fff', fontWeight: '800' },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  taskChecked: { textDecorationLine: 'line-through', color: '#64748B' },
  tag: { backgroundColor: '#E2E8F0', color: '#334155', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12 },
  priorityLabel: { fontSize: 12, color: '#475569' },
  input: { marginTop: 10, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, marginTop: 10 },
  cardTitle: { fontWeight: '700', color: '#0F172A' },
  cardText: { marginTop: 6, color: '#334155' },
  muted: { color: '#64748B', fontSize: 12 },
  canvasArea: { marginTop: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#94A3B8', borderRadius: 12, minHeight: 90, alignItems: 'center', justifyContent: 'center', padding: 8 },
  button: { backgroundColor: '#0EA5E9', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 14 },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  tableRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', padding: 10, marginTop: 8 },
  tableCell: { flex: 1, color: '#334155' },
  barTrack: { backgroundColor: '#E2E8F0', borderRadius: 999, height: 10, marginTop: 4, overflow: 'hidden' },
  barFill: { backgroundColor: '#0EA5E9', height: '100%', borderRadius: 999 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#CBD5E1', backgroundColor: '#fff' },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabLabel: { color: '#64748B', fontWeight: '600' },
  tabLabelActive: { color: '#0284C7' },
});

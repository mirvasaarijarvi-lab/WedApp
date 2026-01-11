import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';

type Task = {
  id: string;
  wedding_id: string;
  title: string;
  completed: boolean;
  assignee_kind: 'user' | 'guest' | 'vendor' | 'officiant' | 'venue' | null;
  assignee_ref_id: string | null;
};

export default function TasksScreen() {
  const { weddingId } = useWedding();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [assigneeKind, setAssigneeKind] = useState<Task['assignee_kind']>(null);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  const load = async () => {
    if (!weddingId) return;
    setLoading(true);
    const [{ data: t, error: te }, { data: g }, { data: v }] = await Promise.all([
      supabase.from('tasks').select('*').eq('wedding_id', weddingId).order('title'),
      supabase.from('guests').select('id,name').eq('wedding_id', weddingId).order('name'),
      supabase.from('vendors').select('id,name,type').eq('wedding_id', weddingId).order('name'),
    ]);
    if (te) Alert.alert('Error', te.message);
    setTasks((t as any) || []);
    setGuests(g || []);
    setVendors(v || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [weddingId]);

  const onAdd = async () => {
    if (!weddingId || !title) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('tasks').insert([
        {
          wedding_id: weddingId,
          title,
          assignee_kind: assigneeKind,
          assignee_ref_id: assigneeId,
        },
      ]);
      if (error) throw error;
      setTitle('');
      setAssigneeKind(null);
      setAssigneeId(null);
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('tasks').update({ completed: !completed }).eq('id', id);
      if (error) throw error;
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const assigneeOptions = useMemo(() => {
    if (assigneeKind === 'guest') return guests.map((g) => ({ id: g.id, label: g.name }));
    if (assigneeKind === 'vendor' || assigneeKind === 'officiant' || assigneeKind === 'venue')
      return vendors.map((v) => ({ id: v.id, label: v.name + (v.type ? ` (${v.type})` : '') }));
    return [];
  }, [assigneeKind, guests, vendors]);

  if (!weddingId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          Select or create a wedding first to manage tasks.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Tasks</Text>

      <View style={{ gap: 8, marginBottom: 12 }}>
        <TextInput
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(['guest', 'vendor', 'officiant', 'venue'] as const).map((k) => (
            <Button key={k} title={`${assigneeKind === k ? '• ' : ''}${k}`} onPress={() => setAssigneeKind(k)} />
          ))}
          <Button title={`${assigneeKind === null ? '• ' : ''}unassigned`} onPress={() => { setAssigneeKind(null); setAssigneeId(null); }} />
        </View>
        {assigneeKind && (
          <View style={{ gap: 8 }}>
            <Text>Select {assigneeKind}</Text>
            <FlatList
              style={{ maxHeight: 160 }}
              data={assigneeOptions}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Button
                  title={`${assigneeId === item.id ? '• ' : ''}${item.label}`}
                  onPress={() => setAssigneeId(item.id)}
                />
              )}
              ListEmptyComponent={<Text style={{ color: '#666' }}>No options</Text>}
            />
          </View>
        )}
        <Button title="Add task" onPress={onAdd} disabled={loading || !title || (!!assigneeKind && !assigneeId)} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: '#666' }}>
              {item.completed ? 'Ready' : 'Open'}
              {item.assignee_kind ? ` • ${item.assignee_kind}` : ''}{item.assignee_ref_id ? ` • ${item.assignee_ref_id}` : ''}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Button title={item.completed ? 'Mark not ready' : 'Mark ready'} onPress={() => toggleComplete(item.id, item.completed)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No tasks yet.</Text>}
      />
    </View>
  );
}

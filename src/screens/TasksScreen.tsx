import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../theme/theme';

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
  const { colors, spacing, typography } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: spacing.xl,
          backgroundColor: colors.background,
        },
        header: {
          marginBottom: spacing.lg,
        },
        form: {
          gap: spacing.sm,
          marginBottom: spacing.lg,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.md,
          borderRadius: spacing.sm,
          fontFamily: typography.body,
          color: colors.text,
        },
        rowWrap: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
        selectArea: {
          gap: spacing.sm,
        },
        selectLabel: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
        },
        card: {
          marginBottom: spacing.md,
          gap: spacing.sm,
        },
        taskHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.sm,
        },
        taskTitle: {
          fontFamily: typography.bodyMedium,
          fontSize: 16,
          color: colors.text,
          flex: 1,
        },
        taskMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          marginBottom: spacing.sm,
        },
        empty: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
          backgroundColor: colors.background,
        },
        emptyText: {
          fontFamily: typography.body,
          color: colors.text,
          textAlign: 'center',
        },
        emptyList: {
          fontFamily: typography.body,
          color: colors.muted,
          textAlign: 'center',
        },
      }),
    [colors, spacing, typography]
  );
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
      <View style={styles.empty}>
        <EmptyState
          title="No wedding selected"
          description="Select or create a wedding first to manage tasks."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionTitle style={styles.header}>Tasks</SectionTitle>

      <Card style={styles.form}>
        <TextInput
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <View style={styles.rowWrap}>
          {(['guest', 'vendor', 'officiant', 'venue'] as const).map((k) => (
            <AppButton
              key={k}
              title={`${assigneeKind === k ? '• ' : ''}${k}`}
              variant={assigneeKind === k ? 'secondary' : 'outline'}
              onPress={() => setAssigneeKind(k)}
            />
          ))}
          <AppButton
            title={`${assigneeKind === null ? '• ' : ''}unassigned`}
            variant={assigneeKind === null ? 'secondary' : 'outline'}
            onPress={() => { setAssigneeKind(null); setAssigneeId(null); }}
          />
        </View>
        {assigneeKind && (
          <View style={styles.selectArea}>
            <Text style={styles.selectLabel}>Select {assigneeKind}</Text>
            <FlatList
              style={{ maxHeight: 160 }}
              data={assigneeOptions}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <AppButton
                  title={`${assigneeId === item.id ? '• ' : ''}${item.label}`}
                  variant={assigneeId === item.id ? 'secondary' : 'outline'}
                  onPress={() => setAssigneeId(item.id)}
                />
              )}
              ListEmptyComponent={<Text style={styles.emptyList}>No options</Text>}
            />
          </View>
        )}
        <AppButton title="Add task" onPress={onAdd} disabled={loading || !title || (!!assigneeKind && !assigneeId)} />
      </Card>

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Badge label={item.completed ? 'Ready' : 'Open'} tone={item.completed ? 'primary' : 'muted'} />
            </View>
            <Text style={styles.taskMeta}>
              {item.assignee_kind ? `Assigned to ${item.assignee_kind}` : 'Unassigned'}
            </Text>
            <AppButton
              title={item.completed ? 'Mark not ready' : 'Mark ready'}
              variant={item.completed ? 'outline' : 'secondary'}
              onPress={() => toggleComplete(item.id, item.completed)}
            />
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No tasks yet"
            description="Add your first planning task and track it as ready."
          />
        }
      />
    </View>
  );
}

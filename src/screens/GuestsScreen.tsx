import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import FeatureIcon from '../components/FeatureIcon';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../theme/theme';

type Guest = {
  id: string;
  wedding_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvp_status?: 'yes' | 'no' | 'maybe' | null;
};

export default function GuestsScreen() {
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
        headerRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        rowWrap: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
          marginTop: spacing.sm,
        },
        card: {
          marginBottom: spacing.md,
          gap: spacing.xs,
        },
        cardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        cardHeaderRight: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        name: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
          fontSize: 16,
        },
        meta: {
          fontFamily: typography.body,
          color: colors.muted,
        },
        chipRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
        actionRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
        buttonCompact: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
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
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEditingId(null);
  };

  const load = async () => {
    if (!weddingId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('name');
    if (error) Alert.alert('Error', error.message);
    const guestsData = (data as Guest[]) || [];
    if (guestsData.length === 0) {
      setGuests([]);
      setLoading(false);
      return;
    }
    const { data: rsvpData, error: rsvpError } = await supabase
      .from('rsvps')
      .select('guest_id,status')
      .in(
        'guest_id',
        guestsData.map((g) => g.id)
      );
    if (rsvpError) Alert.alert('Error', rsvpError.message);
    const rsvpMap = new Map((rsvpData || []).map((r) => [r.guest_id, r.status]));
    setGuests(guestsData.map((g) => ({ ...g, rsvp_status: (rsvpMap.get(g.id) as any) || null })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [weddingId]);

  const onSubmit = async () => {
    if (!weddingId || !name) return;
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('guests')
          .update({ name, email: email || null, phone: phone || null })
          .eq('id', editingId)
          .eq('wedding_id', weddingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guests')
          .insert([{ wedding_id: weddingId, name, email: email || null, phone: phone || null }]);
        if (error) throw error;
      }
      resetForm();
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save guest');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (g: Guest) => {
    setEditingId(g.id);
    setName(g.name);
    setEmail(g.email || '');
    setPhone(g.phone || '');
  };

  const onDelete = async (id: string) => {
    if (!weddingId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('guests').delete().eq('id', id).eq('wedding_id', weddingId);
      if (error) throw error;
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to delete guest');
    } finally {
      setLoading(false);
    }
  };

  const setRsvp = async (guestId: string, status: 'yes' | 'no' | 'maybe') => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('rsvps')
        .upsert({ guest_id: guestId, status }, { onConflict: 'guest_id' });
      if (error) throw error;
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to set RSVP');
    } finally {
      setLoading(false);
    }
  };

  const getRsvpBadge = (status: Guest['rsvp_status']) => {
    if (status === 'yes') return { label: 'RSVP Yes', tone: 'primary' as const };
    if (status === 'maybe') return { label: 'RSVP Maybe', tone: 'accent' as const };
    if (status === 'no') return { label: 'RSVP No', tone: 'muted' as const };
    return { label: 'No RSVP', tone: 'muted' as const };
  };

  const getStatusChip = (status: Guest['rsvp_status']) => {
    if (status === 'yes') return { label: 'Confirmed', tone: 'primary' as const };
    if (status === 'maybe') return { label: 'Pending', tone: 'accent' as const };
    if (status === 'no') return { label: 'Declined', tone: 'muted' as const };
    return { label: 'Awaiting reply', tone: 'muted' as const };
  };

  if (!weddingId) {
    return (
      <View style={styles.empty}>
        <EmptyState
          title="No wedding selected"
          description="Select or create a wedding first to manage guests."
          illustration="rings"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <SectionTitle>Guests</SectionTitle>
        <FeatureIcon name="guests" />
      </View>

      <Card style={styles.form}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          inputMode="email"
          style={styles.input}
        />
        <TextInput
          placeholder="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          inputMode="tel"
          style={styles.input}
        />
        <View style={styles.row}>
          <AppButton title={editingId ? 'Save' : 'Add'} onPress={onSubmit} disabled={loading || !name} />
          {editingId ? <AppButton title="Cancel" variant="outline" onPress={resetForm} /> : null}
        </View>
      </Card>

      <FlatList
        data={guests}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.cardHeaderRight}>
                <Badge {...getRsvpBadge(item.rsvp_status ?? null)} />
                <FeatureIcon name="guests" size={28} />
              </View>
            </View>
            {!!item.email && <Text style={styles.meta}>{item.email}</Text>}
            {!!item.phone && <Text style={styles.meta}>{item.phone}</Text>}
            <View style={styles.chipRow}>
              <Badge label="Invite sent" tone="muted" />
              <Badge {...getStatusChip(item.rsvp_status ?? null)} />
            </View>
            <View style={styles.actionRow}>
              <AppButton title="Edit" variant="outline" onPress={() => onEdit(item)} style={styles.buttonCompact} />
              <AppButton title="Delete" variant="ghost" onPress={() => onDelete(item.id)} style={styles.buttonCompact} />
            </View>
            <View style={styles.actionRow}>
              <AppButton title="RSVP Yes" variant="primary" onPress={() => setRsvp(item.id, 'yes')} style={styles.buttonCompact} />
              <AppButton title="RSVP No" variant="outline" onPress={() => setRsvp(item.id, 'no')} style={styles.buttonCompact} />
              <AppButton title="RSVP Maybe" variant="secondary" onPress={() => setRsvp(item.id, 'maybe')} style={styles.buttonCompact} />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No guests yet"
            description="Start adding guests and track RSVPs with a calm, elegant view."
            illustration="bouquet"
          />
        }
      />
    </View>
  );
}

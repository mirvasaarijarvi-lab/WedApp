import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import FeatureIcon from '../components/FeatureIcon';
import SectionTitle from '../components/SectionTitle';
import { useWedding } from '../lib/WeddingContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../theme/theme';

type BudgetItem = {
  id?: string;
  category: string;
  planned_cents?: number | null;
  actual_cents?: number | null;
  notes?: string | null;
  due_date?: string | null;
};

export default function BudgetScreen() {
  const { weddingId } = useWedding();
  const { colors, spacing, typography } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          padding: spacing.xl,
          gap: spacing.xl,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        headerActions: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        summaryCard: {
          gap: spacing.sm,
        },
        summaryLabel: {
          fontFamily: typography.body,
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontSize: 12,
        },
        summaryValue: {
          fontFamily: typography.heading,
          fontSize: 26,
          color: colors.text,
        },
        summaryMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        summaryRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        card: {
          marginBottom: spacing.md,
          gap: spacing.sm,
        },
        cardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        label: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
          fontSize: 16,
        },
        amount: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 13,
        },
        fieldRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        fieldLabel: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        fieldValue: {
          fontFamily: typography.body,
          color: colors.text,
          fontSize: 12,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: spacing.sm,
          fontFamily: typography.body,
          color: colors.text,
          minWidth: 140,
          textAlign: 'right',
        },
        inputMulti: {
          minHeight: 80,
          textAlignVertical: 'top',
        },
        badgeRow: {
          flexDirection: 'row',
          gap: spacing.xs,
          flexWrap: 'wrap',
        },
        empty: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
          backgroundColor: colors.background,
        },
      }),
    [colors, spacing, typography]
  );

  const categories = [
    'Hair',
    'Make-up',
    'Officiator',
    'DJ',
    'Dress',
    'Suit',
    'Wedding party outfits',
  ];

  const [items, setItems] = useState<Record<string, BudgetItem>>({});
  const [draftPlanned, setDraftPlanned] = useState<Record<string, string>>({});
  const [draftActual, setDraftActual] = useState<Record<string, string>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [draftDue, setDraftDue] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadBudget = async () => {
    if (!weddingId) return;
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select('id,category,planned_cents,actual_cents,notes,due_date')
        .eq('wedding_id', weddingId)
        .in('category', categories);
      if (error) throw error;
      const nextItems: Record<string, BudgetItem> = {};
      const nextPlanned: Record<string, string> = {};
      const nextActual: Record<string, string> = {};
      const nextNotes: Record<string, string> = {};
      const nextDue: Record<string, string> = {};
      categories.forEach((category) => {
        const found = data?.find((item) => item.category === category);
        nextItems[category] = found ? found : { category, planned_cents: null };
        nextPlanned[category] = found?.planned_cents ? String(found.planned_cents / 100) : '';
        nextActual[category] = found?.actual_cents ? String(found.actual_cents / 100) : '';
        nextNotes[category] = found?.notes || '';
        nextDue[category] = found?.due_date || '';
      });
      setItems(nextItems);
      setDraftPlanned(nextPlanned);
      setDraftActual(nextActual);
      setDraftNotes(nextNotes);
      setDraftDue(nextDue);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load budget');
    }
  };

  useEffect(() => {
    loadBudget();
  }, [weddingId]);

  const formatAmount = (cents?: number | null) => {
    if (cents === null || cents === undefined) return 'Amount not set';
    const amount = cents / 100;
    return `€${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const totalPlanned = categories.reduce((sum, category) => {
    const cents = items[category]?.planned_cents || 0;
    return sum + cents;
  }, 0);
  const totalActual = categories.reduce((sum, category) => {
    const cents = items[category]?.actual_cents || 0;
    return sum + cents;
  }, 0);

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    const nextPlanned: Record<string, string> = {};
    const nextActual: Record<string, string> = {};
    const nextNotes: Record<string, string> = {};
    const nextDue: Record<string, string> = {};
    categories.forEach((category) => {
      const cents = items[category]?.planned_cents || 0;
      const actualCents = items[category]?.actual_cents || 0;
      nextPlanned[category] = cents ? String(cents / 100) : '';
      nextActual[category] = actualCents ? String(actualCents / 100) : '';
      nextNotes[category] = items[category]?.notes || '';
      nextDue[category] = items[category]?.due_date || '';
    });
    setDraftPlanned(nextPlanned);
    setDraftActual(nextActual);
    setDraftNotes(nextNotes);
    setDraftDue(nextDue);
    setIsEditing(false);
  };

  const saveBudget = async () => {
    if (!weddingId) {
      Alert.alert('No wedding selected', 'Select a wedding before editing budget items.');
      return;
    }
    setIsSaving(true);
    try {
      const updates = categories.map((category) => {
        const plannedRaw = draftPlanned[category] || '';
        const actualRaw = draftActual[category] || '';
        const plannedNormalized = plannedRaw.replace(/[^0-9.,]/g, '').replace(',', '.');
        const actualNormalized = actualRaw.replace(/[^0-9.,]/g, '').replace(',', '.');
        const plannedAmount = plannedNormalized ? Number(plannedNormalized) : 0;
        const actualAmount = actualNormalized ? Number(actualNormalized) : 0;
        const plannedCents = Number.isFinite(plannedAmount) ? Math.round(plannedAmount * 100) : 0;
        const actualCents = Number.isFinite(actualAmount) ? Math.round(actualAmount * 100) : 0;
        const notes = draftNotes[category]?.trim() || null;
        const dueDate = draftDue[category]?.trim() || null;
        const existingId = items[category]?.id;
        if (existingId) {
          return supabase
            .from('budget_items')
            .update({ planned_cents: plannedCents, actual_cents: actualCents, notes, due_date: dueDate })
            .eq('id', existingId)
            .eq('wedding_id', weddingId);
        }
        return supabase
          .from('budget_items')
          .insert([
            {
              wedding_id: weddingId,
              category,
              planned_cents: plannedCents,
              actual_cents: actualCents,
              notes,
              due_date: dueDate,
            },
          ]);
      });
      const results = await Promise.all(updates);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
      await loadBudget();
      setIsEditing(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save budget');
    } finally {
      setIsSaving(false);
    }
  };

  if (!weddingId) {
    return (
      <View style={styles.empty}>
        <EmptyState
          title="No wedding selected"
          description="Select or create a wedding first to manage the budget."
          illustration="rings"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <SectionTitle>Budget</SectionTitle>
        <FeatureIcon name="budget" />
      </View>

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Planned total</Text>
        <Text style={styles.summaryValue}>{formatAmount(totalPlanned)}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryMeta}>Actual spend</Text>
          <Text style={styles.summaryMeta}>{formatAmount(totalActual)}</Text>
        </View>
        <Text style={styles.summaryMeta}>Update amounts, due dates, and notes anytime.</Text>
        <View style={styles.headerActions}>
          {isEditing ? (
            <>
              <AppButton
                title={isSaving ? 'Saving...' : 'Save'}
                variant="secondary"
                onPress={saveBudget}
                disabled={isSaving}
              />
              <AppButton title="Cancel" variant="outline" onPress={cancelEdit} />
            </>
          ) : (
            <AppButton title="Edit amounts" variant="outline" onPress={startEdit} />
          )}
        </View>
      </Card>

      {categories.map((category) => {
        const item = items[category];
        return (
          <Card key={category} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>{category}</Text>
              {isEditing ? null : <Text style={styles.amount}>{formatAmount(item?.planned_cents ?? null)}</Text>}
            </View>
            {isEditing ? (
              <>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Planned</Text>
                  <TextInput
                    value={draftPlanned[category] ?? ''}
                    onChangeText={(value) => setDraftPlanned((prev) => ({ ...prev, [category]: value }))}
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Actual</Text>
                  <TextInput
                    value={draftActual[category] ?? ''}
                    onChangeText={(value) => setDraftActual((prev) => ({ ...prev, [category]: value }))}
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                  />
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Due date</Text>
                  <TextInput
                    value={draftDue[category] ?? ''}
                    onChangeText={(value) => setDraftDue((prev) => ({ ...prev, [category]: value }))}
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    autoCapitalize="none"
                  />
                </View>
                <TextInput
                  value={draftNotes[category] ?? ''}
                  onChangeText={(value) => setDraftNotes((prev) => ({ ...prev, [category]: value }))}
                  style={[styles.input, styles.inputMulti]}
                  placeholder="Notes"
                  multiline
                />
              </>
            ) : (
              <>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Actual</Text>
                  <Text style={styles.fieldValue}>{formatAmount(item?.actual_cents ?? null)}</Text>
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Due date</Text>
                  <Text style={styles.fieldValue}>{item?.due_date || 'Not set'}</Text>
                </View>
                <Text style={styles.fieldLabel}>{item?.notes ? `Notes: ${item.notes}` : 'Notes not set'}</Text>
                <View style={styles.badgeRow}>
                  <Badge label={item?.planned_cents ? 'Planned set' : 'Set planned'} tone="muted" />
                  <Badge label={item?.actual_cents ? 'Actual set' : 'Set actual'} tone="muted" />
                </View>
              </>
            )}
            {!isEditing && (
              <View style={styles.badgeRow}>
                <Badge label="Editable" tone="muted" />
              </View>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import BrandMark from '../components/BrandMark';
import Card from '../components/Card';
import FeatureIcon from '../components/FeatureIcon';
import SectionTitle from '../components/SectionTitle';
import { useWedding } from '../lib/WeddingContext';
import { useTheme } from '../theme/theme';

export default function DashboardScreen() {
  const { colors, spacing, typography } = useTheme();
  const { weddingId } = useWedding();
  const navigation = useNavigation<any>();
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
        header: {
          gap: spacing.sm,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        kicker: {
          color: colors.secondary,
          fontFamily: typography.bodyMedium,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: 12,
        },
        title: {
          fontFamily: typography.heading,
          fontSize: 30,
          color: colors.primary,
        },
        subtitle: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 14,
        },
        row: {
          flexDirection: 'row',
          gap: spacing.lg,
        },
        sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacing.md,
        },
        sectionMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        statCard: {
          flex: 1,
          gap: spacing.sm,
        },
        statHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        statLabel: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        },
        statValue: {
          fontFamily: typography.heading,
          fontSize: 24,
          color: colors.text,
        },
        budgetCard: {
          flex: 1,
          gap: spacing.sm,
        },
        budgetLabel: {
          fontFamily: typography.body,
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontSize: 12,
        },
        budgetValue: {
          fontFamily: typography.heading,
          fontSize: 22,
          color: colors.text,
        },
        budgetMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        budgetTrack: {
          height: 6,
          borderRadius: 6,
          backgroundColor: colors.border,
          overflow: 'hidden',
        },
        budgetFill: {
          height: 6,
          width: '68%',
          borderRadius: 6,
          backgroundColor: colors.accent,
        },
        breakdownCard: {
          gap: spacing.md,
        },
        breakdownHeaderRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        breakdownItem: {
          gap: spacing.xs,
        },
        breakdownHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        breakdownLabel: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
          fontSize: 14,
        },
        breakdownAmount: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        breakdownHint: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        budgetInput: {
          minWidth: 120,
          textAlign: 'right',
        },
        buttonCompact: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
        },
        breakdownTrack: {
          height: 6,
          borderRadius: 6,
          backgroundColor: colors.border,
          overflow: 'hidden',
        },
        breakdownFill: {
          height: 6,
          borderRadius: 6,
          backgroundColor: colors.primary,
        },
        followupGrid: {
          flexDirection: 'row',
          gap: spacing.md,
        },
        followupCard: {
          flex: 1,
          gap: spacing.sm,
        },
        followupHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        followupLabel: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
          fontSize: 14,
        },
        followupMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        sectionTitle: {
          marginTop: spacing.md,
        },
        focusItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.sm,
        },
        focusTextWrap: {
          flex: 1,
        },
        focusTitle: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
        },
        focusMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        timelineGrid: {
          flexDirection: 'row',
          gap: spacing.md,
        },
        timelineCard: {
          flex: 1,
          gap: spacing.sm,
        },
        timelineTitle: {
          fontFamily: typography.bodyMedium,
          color: colors.text,
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        },
        timelineItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        timelineDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.secondary,
        },
        timelineText: {
          fontFamily: typography.body,
          color: colors.text,
          fontSize: 13,
          flex: 1,
        },
        timelineMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 12,
        },
        eventTitle: {
          fontFamily: typography.heading,
          color: colors.primary,
          fontSize: 20,
          marginBottom: spacing.xs,
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
        eventMeta: {
          fontFamily: typography.body,
          color: colors.muted,
          fontSize: 13,
          marginBottom: spacing.md,
        },
        eventBody: {
          fontFamily: typography.body,
          color: colors.text,
          lineHeight: 20,
          marginBottom: spacing.lg,
        },
        eventActions: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
        },
        footer: {
          alignItems: 'center',
          paddingBottom: spacing.xl,
        },
      }),
    [colors, spacing, typography]
  );
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const [event, setEvent] = useState({
    title: 'Ceremony & Reception',
    date: 'Saturday, June 14',
    time: '4:00 PM',
    location: 'Garden Terrace',
    description:
      'Cocktail hour begins at 4:00 PM, followed by dinner and dancing. All vendors have been notified of the final timeline.',
  });
  const [draftEvent, setDraftEvent] = useState(event);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [budgetItems, setBudgetItems] = useState<Record<string, { id?: string; plannedCents?: number | null }>>({});
  const [draftBudget, setDraftBudget] = useState<Record<string, string>>({});
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isSavingBudget, setIsSavingBudget] = useState(false);

  const budgetCategories = [
    'Hair',
    'Make-up',
    'Officiator',
    'DJ',
    'Dress',
    'Suit',
    'Wedding party outfits',
  ];

  const formatDateParts = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return {
      date: `${String(parsed.getDate()).padStart(2, '0')}${String(parsed.getMonth() + 1).padStart(2, '0')}${parsed.getFullYear()}`,
      time: `${String(parsed.getHours()).padStart(2, '0')}${String(parsed.getMinutes()).padStart(2, '0')}`,
    };
  };

  const parseDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 8) return null;
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    const isoDate = `${year}-${month}-${day}`;
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return isoDate;
  };

  const parseTimeInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 4) return null;
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);
    return { hours, minutes };
  };

  const formatDisplayDate = (value: string) => {
    const iso = parseDateInput(value);
    if (!iso) return value;
    const parsed = new Date(iso);
    return parsed.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatDisplayTime = (value: string) => {
    const time = parseTimeInput(value);
    if (!time) return value;
    const parsed = new Date(`2000-01-01T${time.hours}:${time.minutes}:00`);
    return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const loadEvent = async () => {
    if (!weddingId) return;
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('id,title,start_at,location,notes')
        .eq('wedding_id', weddingId)
        .order('start_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return;
      const parts = formatDateParts(data.start_at);
      setEventId(data.id);
      setEvent({
        title: data.title || 'Upcoming Event',
        date: parts?.date || '',
        time: parts?.time || '',
        location: data.location || 'Location not set',
        description: data.notes || '',
      });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load event');
    }
  };

  const loadBudget = async () => {
    if (!weddingId) return;
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select('id,category,planned_cents')
        .eq('wedding_id', weddingId)
        .in('category', budgetCategories);
      if (error) throw error;
      const nextBudget: Record<string, { id?: string; plannedCents?: number | null }> = {};
      const nextDraft: Record<string, string> = {};
      budgetCategories.forEach((category) => {
        const found = data?.find((item) => item.category === category);
        if (found) {
          nextBudget[category] = { id: found.id, plannedCents: found.planned_cents };
          nextDraft[category] = found.planned_cents ? String(found.planned_cents / 100) : '';
        } else {
          nextBudget[category] = { plannedCents: null };
          nextDraft[category] = '';
        }
      });
      setBudgetItems(nextBudget);
      setDraftBudget(nextDraft);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load budget items');
    }
  };

  useEffect(() => {
    loadEvent();
    loadBudget();
  }, [weddingId]);

  const startEditBudget = () => {
    setIsEditingBudget(true);
  };

  const cancelEditBudget = () => {
    const nextDraft: Record<string, string> = {};
    budgetCategories.forEach((category) => {
      const cents = budgetItems[category]?.plannedCents || 0;
      nextDraft[category] = cents ? String(cents / 100) : '';
    });
    setDraftBudget(nextDraft);
    setIsEditingBudget(false);
  };

  const saveBudget = async () => {
    if (!weddingId) {
      Alert.alert('No wedding selected', 'Select a wedding before editing budget items.');
      return;
    }
    setIsSavingBudget(true);
    try {
      const updates = budgetCategories.map((category) => {
        const raw = draftBudget[category] || '';
        const normalized = raw.replace(/[^0-9.,]/g, '').replace(',', '.');
        const amount = normalized ? Number(normalized) : 0;
        const plannedCents = Number.isFinite(amount) ? Math.round(amount * 100) : 0;
        const existingId = budgetItems[category]?.id;
        if (existingId) {
          return supabase
            .from('budget_items')
            .update({ planned_cents: plannedCents })
            .eq('id', existingId)
            .eq('wedding_id', weddingId);
        }
        return supabase
          .from('budget_items')
          .insert([{ wedding_id: weddingId, category, planned_cents: plannedCents }]);
      });
      const results = await Promise.all(updates);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
      await loadBudget();
      setIsEditingBudget(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save budget');
    } finally {
      setIsSavingBudget(false);
    }
  };

  const formatBudgetAmount = (cents?: number | null) => {
    if (!cents) return 'Amount not set';
    const amount = cents / 100;
    return `€${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const startEditEvent = () => {
    setDraftEvent(event);
    setIsEditingEvent(true);
  };
  const cancelEditEvent = () => {
    setDraftEvent(event);
    setIsEditingEvent(false);
  };
  const saveEditEvent = async () => {
    if (!weddingId) {
      Alert.alert('No wedding selected', 'Select a wedding before editing event details.');
      return;
    }
    const isoDate = parseDateInput(draftEvent.date);
    const time = parseTimeInput(draftEvent.time);
    if (!isoDate || !time) {
      Alert.alert('Invalid date/time', 'Use DDMMYYYY and HHMM.');
      return;
    }
    const parsed = new Date(`${isoDate}T${time.hours}:${time.minutes}:00`);
    if (Number.isNaN(parsed.getTime())) {
      Alert.alert('Invalid date/time', 'Use DDMMYYYY and HHMM.');
      return;
    }
    setIsSavingEvent(true);
    try {
      const payload = {
        title: draftEvent.title.trim() || 'Upcoming Event',
        start_at: parsed.toISOString(),
        location: draftEvent.location.trim() || null,
        notes: draftEvent.description.trim() || null,
      };
      if (eventId) {
        const { error } = await supabase
          .from('timeline_events')
          .update(payload)
          .eq('id', eventId)
          .eq('wedding_id', weddingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('timeline_events')
          .insert([{ wedding_id: weddingId, ...payload }])
          .select('id')
          .single();
        if (error) throw error;
        setEventId(data.id);
      }
      setEvent(draftEvent);
      setIsEditingEvent(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save event');
    } finally {
      setIsSavingEvent(false);
    }
  };
  const eventMetaLine = `${formatDisplayDate(event.date)} · ${formatDisplayTime(event.time)} · ${event.location}`;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <BrandMark size={40} />
          <View>
            <Text style={styles.kicker}>Premium planner</Text>
            <Text style={styles.title}>Wedding Dashboard</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Elegant, minimal, and romantic planning in one place.</Text>
      </View>

      <View style={styles.row}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Guests</Text>
            <FeatureIcon name="guests" />
          </View>
          <Text style={styles.statValue}>128</Text>
          <Badge label="72% RSVP" tone="primary" />
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Tasks Ready</Text>
            <FeatureIcon name="tasks" />
          </View>
          <Text style={styles.statValue}>18</Text>
          <Badge label="6 pending" tone="muted" />
        </Card>
      </View>

      <View style={styles.row}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Vendors</Text>
            <FeatureIcon name="vendors" />
          </View>
          <Text style={styles.statValue}>12</Text>
          <Badge label="3 new leads" tone="accent" />
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Budget</Text>
            <FeatureIcon name="budget" />
          </View>
          <Text style={styles.statValue}>€18.4k</Text>
          <Badge label="On track" tone="primary" />
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <SectionTitle>Budget Overview</SectionTitle>
        <Text style={styles.sectionMeta}>This month</Text>
      </View>
      <View style={styles.row}>
        <Card style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>Total budget</Text>
          <Text style={styles.budgetValue}>€24,000</Text>
          <View style={styles.budgetTrack}>
            <View style={styles.budgetFill} />
          </View>
          <Text style={styles.budgetMeta}>€16,400 spent · 68% used</Text>
          <Badge label="On track" tone="primary" />
        </Card>
        <Card style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>Remaining</Text>
          <Text style={styles.budgetValue}>€7,600</Text>
          <Text style={styles.budgetMeta}>€2,100 due in 14 days</Text>
          <Badge label="3 payments due" tone="accent" />
          <AppButton title="Review budget" variant="outline" />
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <SectionTitle>Budget Breakdown</SectionTitle>
        <Text style={styles.sectionMeta}>Top categories</Text>
      </View>
      <Card style={styles.breakdownCard}>
        <View style={styles.breakdownHeaderRow}>
          <Text style={styles.breakdownHint}>Update amounts anytime.</Text>
          {isEditingBudget ? (
            <View style={styles.eventActions}>
              <AppButton
                title={isSavingBudget ? 'Saving...' : 'Save'}
                variant="secondary"
                onPress={saveBudget}
                disabled={isSavingBudget}
                style={styles.buttonCompact}
              />
              <AppButton title="Cancel" variant="outline" onPress={cancelEditBudget} style={styles.buttonCompact} />
            </View>
          ) : (
            <AppButton title="Edit amounts" variant="outline" onPress={startEditBudget} style={styles.buttonCompact} />
          )}
        </View>
        {budgetCategories.map((category) => {
          const item = budgetItems[category];
          const amountLabel = formatBudgetAmount(item?.plannedCents ?? null);
          return (
            <View key={category} style={styles.breakdownItem}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownLabel}>{category}</Text>
                {isEditingBudget ? (
                  <TextInput
                    value={draftBudget[category] ?? ''}
                    onChangeText={(value) => setDraftBudget((prev) => ({ ...prev, [category]: value }))}
                    style={[styles.input, styles.budgetInput]}
                    placeholder="Amount"
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                  />
                ) : (
                  <Text style={styles.breakdownAmount}>{amountLabel}</Text>
                )}
              </View>
              {!isEditingBudget && (
                <Badge label={amountLabel === 'Amount not set' ? 'Set amount' : 'Amount set'} tone="muted" />
              )}
            </View>
          );
        })}
        {!isEditingBudget && (
          <AppButton title="See full budget" variant="outline" onPress={() => navigation.navigate('Budget')} />
        )}
      </Card>

      <View style={styles.sectionHeader}>
        <SectionTitle>Follow-ups</SectionTitle>
        <Text style={styles.sectionMeta}>Next 7 days</Text>
      </View>
      <View style={styles.followupGrid}>
        <Card style={styles.followupCard}>
          <View style={styles.followupHeader}>
            <Text style={styles.followupLabel}>Vendors</Text>
            <FeatureIcon name="vendors" size={26} />
          </View>
          <Text style={styles.followupMeta}>Team check-ins due</Text>
          <Badge label="2 follow-ups" tone="accent" />
          <Badge label="5 confirmed" tone="muted" />
          <Badge label="Last contact: 3 days ago" tone="muted" />
          <AppButton title="Manage vendors" variant="secondary" />
        </Card>
        <Card style={styles.followupCard}>
          <View style={styles.followupHeader}>
            <Text style={styles.followupLabel}>RSVPs</Text>
            <FeatureIcon name="guests" size={26} />
          </View>
          <Text style={styles.followupMeta}>Final replies pending</Text>
          <Badge label="36 awaiting" tone="accent" />
          <Badge label="12 maybes" tone="muted" />
          <Badge label="Deadline: in 6 days" tone="muted" />
          <AppButton title="Message guests" variant="outline" />
        </Card>
      </View>
      <View style={styles.followupGrid}>
        <Card style={styles.followupCard}>
          <View style={styles.followupHeader}>
            <Text style={styles.followupLabel}>Tasks</Text>
            <FeatureIcon name="tasks" size={26} />
          </View>
          <Text style={styles.followupMeta}>This week's priorities</Text>
          <Badge label="4 due" tone="accent" />
          <Badge label="2 overdue" tone="muted" />
          <Badge label="Next milestone: seating plan" tone="muted" />
          <AppButton title="View tasks" variant="outline" />
        </Card>
        <Card style={styles.followupCard}>
          <View style={styles.followupHeader}>
            <Text style={styles.followupLabel}>Payments</Text>
            <FeatureIcon name="budget" size={26} />
          </View>
          <Text style={styles.followupMeta}>Upcoming payments</Text>
          <Badge label="€2,100 due" tone="accent" />
          <Badge label="2 invoices open" tone="muted" />
          <Badge label="Next invoice: 14 days" tone="muted" />
          <AppButton title="Manage payments" variant="secondary" />
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <SectionTitle>Today's Focus</SectionTitle>
        <Text style={styles.sectionMeta}>3 priorities</Text>
      </View>
      <Card>
        <View style={styles.focusItem}>
          <FeatureIcon name="vendors" size={32} />
          <View style={styles.focusTextWrap}>
            <Text style={styles.focusTitle}>Confirm florist delivery window</Text>
            <Text style={styles.focusMeta}>Vendor · Due in 2 days</Text>
          </View>
        </View>
        <View style={styles.focusItem}>
          <FeatureIcon name="guests" size={32} />
          <View style={styles.focusTextWrap}>
            <Text style={styles.focusTitle}>Send RSVP reminder</Text>
            <Text style={styles.focusMeta}>Guests · 18 awaiting</Text>
          </View>
        </View>
        <View style={styles.focusItem}>
          <FeatureIcon name="timeline" size={32} />
          <View style={styles.focusTextWrap}>
            <Text style={styles.focusTitle}>Finalize seating layout</Text>
            <Text style={styles.focusMeta}>Venue · In review</Text>
          </View>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <SectionTitle>Upcoming Event</SectionTitle>
        <Text style={styles.sectionMeta}>Next 7 days</Text>
      </View>
      <Card>
        {isEditingEvent ? (
          <>
            <TextInput
              value={draftEvent.title}
              onChangeText={(title) => setDraftEvent((prev) => ({ ...prev, title }))}
              style={styles.input}
              placeholder="Event title"
            />
            <TextInput
              value={draftEvent.date}
              onChangeText={(date) => setDraftEvent((prev) => ({ ...prev, date }))}
              style={styles.input}
              placeholder="Date (DDMMYYYY)"
              inputMode="numeric"
            />
            <TextInput
              value={draftEvent.time}
              onChangeText={(time) => setDraftEvent((prev) => ({ ...prev, time }))}
              style={styles.input}
              placeholder="Time (HHMM)"
              inputMode="numeric"
            />
            <TextInput
              value={draftEvent.location}
              onChangeText={(location) => setDraftEvent((prev) => ({ ...prev, location }))}
              style={styles.input}
              placeholder="Location"
            />
            <TextInput
              value={draftEvent.description}
              onChangeText={(description) => setDraftEvent((prev) => ({ ...prev, description }))}
              style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
              placeholder="Event notes"
              multiline
            />
            <View style={styles.eventActions}>
              <AppButton
                title={isSavingEvent ? 'Saving...' : 'Save'}
                variant="secondary"
                onPress={saveEditEvent}
                disabled={isSavingEvent}
              />
              <AppButton title="Cancel" variant="outline" onPress={cancelEditEvent} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventMeta}>{eventMetaLine}</Text>
            <Text style={styles.eventBody}>{event.description}</Text>
            <View style={styles.eventActions}>
              <AppButton title="View timeline" variant="secondary" />
              <AppButton title="Send update" variant="outline" />
              <AppButton title="Edit details" variant="ghost" onPress={startEditEvent} />
            </View>
          </>
        )}
      </Card>

      <View style={styles.sectionHeader}>
        <SectionTitle>Timeline</SectionTitle>
        <Text style={styles.sectionMeta}>Today · Tomorrow · Next week</Text>
      </View>
      <View style={styles.timelineGrid}>
        <Card style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Today</Text>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineText}>Confirm florist delivery window</Text>
          </View>
          <Text style={styles.timelineMeta}>2:00 PM · Vendor call</Text>
        </Card>
        <Card style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Tomorrow</Text>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineText}>Finalize seating layout</Text>
          </View>
          <Text style={styles.timelineMeta}>10:00 AM · Venue walkthrough</Text>
        </Card>
        <Card style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Next week</Text>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineText}>Send RSVP reminder</Text>
          </View>
          <Text style={styles.timelineMeta}>Monday · Guest list</Text>
        </Card>
      </View>

      <Card>
        <View style={styles.eventActions}>
          <AppButton title="Open guest list" variant="secondary" />
          <AppButton title="Add task" variant="outline" />
        </View>
      </Card>

      <View style={styles.footer}>
        <AppButton title="Sign out" variant="ghost" onPress={signOut} />
      </View>
    </ScrollView>
  );
}

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import BrandMark from '../components/BrandMark';
import Card from '../components/Card';
import FeatureIcon from '../components/FeatureIcon';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../theme/theme';

export default function DashboardScreen() {
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
        <Text style={styles.eventTitle}>Ceremony & Reception</Text>
        <Text style={styles.eventMeta}>Saturday, June 14 · 4:00 PM · Garden Terrace</Text>
        <Text style={styles.eventBody}>
          Cocktail hour begins at 4:00 PM, followed by dinner and dancing. All vendors have been notified of the final timeline.
        </Text>
        <View style={styles.eventActions}>
          <AppButton title="View timeline" variant="secondary" />
          <AppButton title="Send update" variant="outline" />
        </View>
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

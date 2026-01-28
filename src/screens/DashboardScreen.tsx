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
        focusText: {
          fontFamily: typography.body,
          color: colors.text,
          flex: 1,
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
        sampleText: {
          fontFamily: typography.body,
          color: colors.muted,
          marginBottom: spacing.md,
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

      <SectionTitle style={styles.sectionTitle}>Today's Focus</SectionTitle>
      <Card>
        <View style={styles.focusItem}>
          <Badge label="Vendor" tone="accent" />
          <Text style={styles.focusText}>Confirm florist delivery window</Text>
        </View>
        <View style={styles.focusItem}>
          <Badge label="Guests" tone="primary" />
          <Text style={styles.focusText}>Send RSVP reminder to undecided guests</Text>
        </View>
        <View style={styles.focusItem}>
          <Badge label="Venue" tone="muted" />
          <Text style={styles.focusText}>Finalize seating layout with coordinator</Text>
        </View>
      </Card>

      <SectionTitle style={styles.sectionTitle}>Upcoming Event</SectionTitle>
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

      <SectionTitle style={styles.sectionTitle}>Component Samples</SectionTitle>
      <Card>
        <Text style={styles.sampleText}>
          Primary, accent, and outline buttons with generous spacing.
        </Text>
        <View style={styles.eventActions}>
          <AppButton title="Primary" variant="primary" />
          <AppButton title="Accent" variant="secondary" />
          <AppButton title="Outline" variant="outline" />
        </View>
      </Card>

      <View style={styles.footer}>
        <AppButton title="Sign out" variant="ghost" onPress={signOut} />
      </View>
    </ScrollView>
  );
}

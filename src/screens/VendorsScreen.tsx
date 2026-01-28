import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import FeatureIcon from '../components/FeatureIcon';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../theme/theme';

export default function VendorsScreen() {
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
          marginBottom: spacing.sm,
        },
        headerRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
        },
        subtitle: {
          fontFamily: typography.body,
          color: colors.muted,
          marginBottom: spacing.lg,
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
          marginBottom: spacing.sm,
        },
        chipRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginBottom: spacing.sm,
        },
        actions: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
        },
        buttonCompact: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
        },
      }),
    [colors, spacing, typography]
  );
  const vendors = [
    {
      id: '1',
      name: 'Garden Terrace Venue',
      type: 'Venue',
      status: 'Confirmed',
      contact: 'Sofia Chen',
      badges: ['Contract signed', 'Deposit paid'],
    },
    {
      id: '2',
      name: 'Luma Floral Studio',
      type: 'Florist',
      status: 'Quote sent',
      contact: 'Lukas Meyer',
      badges: ['Awaiting reply', 'Moodboard shared'],
    },
    {
      id: '3',
      name: 'Aurora Strings Quartet',
      type: 'Music',
      status: 'Shortlist',
      contact: 'Mila Kovac',
      badges: ['Availability checked'],
    },
  ];

  const getStatusTone = (status: string) => {
    if (status === 'Confirmed') return 'primary' as const;
    if (status === 'Quote sent') return 'accent' as const;
    return 'muted' as const;
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <SectionTitle>Vendors</SectionTitle>
        <FeatureIcon name="vendors" />
      </View>
      <Text style={styles.subtitle}>Curate your team with a calm, premium planner view.</Text>
      <AppButton title="Add vendor" variant="secondary" />

      {vendors.length === 0 ? (
        <EmptyState
          title="No vendors yet"
          description="Add venues, suppliers, and trusted partners to your wedding team."
          actionLabel="Add vendor"
          illustration="bouquet"
        />
      ) : (
        vendors.map((vendor) => (
          <Card key={vendor.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{vendor.name}</Text>
              <View style={styles.cardHeaderRight}>
                <Badge label={vendor.status} tone={getStatusTone(vendor.status)} />
                <FeatureIcon name="vendors" size={28} />
              </View>
            </View>
            <Text style={styles.meta}>
              {vendor.type} · {vendor.contact}
            </Text>
            <View style={styles.chipRow}>
              {vendor.badges.map((label) => (
                <Badge key={label} label={label} tone="muted" />
              ))}
            </View>
            <View style={styles.actions}>
              <AppButton title="View details" variant="outline" style={styles.buttonCompact} />
              <AppButton title="Message" variant="ghost" style={styles.buttonCompact} />
              <AppButton title="Call" variant="secondary" style={styles.buttonCompact} />
            </View>
          </Card>
        ))
      )}

    </View>
  );
}

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
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
        actions: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
        },
      }),
    [colors, spacing, typography]
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <SectionTitle>Vendors</SectionTitle>
        <FeatureIcon name="vendors" />
      </View>
      <Text style={styles.subtitle}>Curate your team with a calm, premium planner view.</Text>

      <EmptyState
        title="No vendors yet"
        description="Add venues, suppliers, and trusted partners to your wedding team."
        actionLabel="Add vendor"
        illustration="bouquet"
      />

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>Garden Terrace Venue</Text>
          <FeatureIcon name="vendors" size={28} />
        </View>
        <Text style={styles.meta}>Venue · Confirmed</Text>
        <View style={styles.actions}>
          <AppButton title="View details" variant="secondary" />
          <AppButton title="Message" variant="outline" />
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>Luma Floral Studio</Text>
          <FeatureIcon name="vendors" size={28} />
        </View>
        <Text style={styles.meta}>Florist · Quote sent</Text>
        <View style={styles.actions}>
          <AppButton title="Review quote" variant="secondary" />
          <AppButton title="Follow up" variant="outline" />
        </View>
      </Card>
    </View>
  );
}

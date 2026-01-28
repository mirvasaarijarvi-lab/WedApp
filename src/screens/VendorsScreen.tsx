import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import SectionTitle from '../components/SectionTitle';
import { colors, spacing, typography } from '../theme/tokens';

export default function VendorsScreen() {
  return (
    <View style={styles.container}>
      <SectionTitle style={styles.header}>Vendors</SectionTitle>
      <Text style={styles.subtitle}>Curate your team with a calm, premium planner view.</Text>

      <EmptyState
        title="No vendors yet"
        description="Add venues, suppliers, and trusted partners to your wedding team."
        actionLabel="Add vendor"
      />

      <Card style={styles.card}>
        <Text style={styles.name}>Garden Terrace Venue</Text>
        <Text style={styles.meta}>Venue · Confirmed</Text>
        <View style={styles.actions}>
          <AppButton title="View details" variant="secondary" />
          <AppButton title="Message" variant="outline" />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.name}>Luma Floral Studio</Text>
        <Text style={styles.meta}>Florist · Quote sent</Text>
        <View style={styles.actions}>
          <AppButton title="Review quote" variant="secondary" />
          <AppButton title="Follow up" variant="outline" />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
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
});

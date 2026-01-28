import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import BrandMark from '../components/BrandMark';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import { colors, radius, spacing, typography } from '../theme/tokens';

export default function DesignSystemScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BrandMark size={56} label="W" />
        <Text style={styles.title}>Wedding App Design System</Text>
        <Text style={styles.subtitle}>Elegant modern romantic, kept minimal.</Text>
      </View>

      <SectionTitle>Color Palette</SectionTitle>
      <View style={styles.paletteGrid}>
        {Object.entries(colors).map(([name, value]) => (
          <Card key={name} style={styles.paletteCard} padding="md">
            <View style={[styles.swatch, { backgroundColor: value as string }]} />
            <Text style={styles.paletteName}>{name}</Text>
            <Text style={styles.paletteValue}>{value as string}</Text>
          </Card>
        ))}
      </View>

      <SectionTitle>Typography</SectionTitle>
      <Card>
        <Text style={styles.kicker}>Heading · Playfair Display</Text>
        <Text style={styles.typeHeading}>The quick brown fox</Text>
        <Text style={styles.kicker}>Body · Inter</Text>
        <Text style={styles.typeBody}>
          Clean, modern, and highly readable for body text and UI elements.
        </Text>
      </Card>

      <SectionTitle>Spacing</SectionTitle>
      <Card>
        {Object.entries(spacing).map(([name, value]) => (
          <View key={name} style={styles.spacingRow}>
            <Text style={styles.spacingLabel}>{name}</Text>
            <View style={[styles.spacingBar, { width: value }]} />
            <Text style={styles.spacingValue}>{value}px</Text>
          </View>
        ))}
      </Card>

      <SectionTitle>Radius</SectionTitle>
      <View style={styles.radiusGrid}>
        {Object.entries(radius).map(([name, value]) => (
          <Card key={name} style={styles.radiusCard}>
            <Text style={styles.radiusLabel}>{name}</Text>
            <View style={[styles.radiusShape, { borderRadius: value }]} />
            <Text style={styles.radiusValue}>{value}px</Text>
          </Card>
        ))}
      </View>

      <SectionTitle>Components</SectionTitle>
      <Card>
        <Text style={styles.kicker}>Buttons</Text>
        <View style={styles.rowWrap}>
          <AppButton title="Primary" />
          <AppButton title="Accent" variant="secondary" />
          <AppButton title="Outline" variant="outline" />
        </View>
        <Text style={[styles.kicker, { marginTop: spacing.lg }]}>Badges</Text>
        <View style={styles.rowWrap}>
          <Badge label="RSVP" tone="primary" />
          <Badge label="Premium" tone="accent" />
          <Badge label="Muted" tone="muted" />
        </View>
      </Card>

      <SectionTitle>Example Card</SectionTitle>
      <Card>
        <Text style={styles.eventTitle}>Ceremony & Reception</Text>
        <Text style={styles.eventMeta}>Saturday, June 14 · 4:00 PM</Text>
        <Text style={styles.eventBody}>
          Join us for a beautiful celebration of love at the Garden Terrace.
        </Text>
        <AppButton title="RSVP Now" variant="secondary" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 26,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: typography.body,
    color: colors.muted,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  paletteCard: {
    width: '47%',
    gap: spacing.xs,
  },
  swatch: {
    height: 64,
    borderRadius: radius.button,
  },
  paletteName: {
    fontFamily: typography.bodyMedium,
    color: colors.text,
    textTransform: 'capitalize',
  },
  paletteValue: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 12,
  },
  kicker: {
    fontFamily: typography.bodyMedium,
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  typeHeading: {
    fontFamily: typography.heading,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  typeBody: {
    fontFamily: typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  spacingLabel: {
    width: 40,
    fontFamily: typography.bodyMedium,
    color: colors.text,
  },
  spacingBar: {
    height: 10,
    backgroundColor: colors.accent,
    borderRadius: radius.button,
  },
  spacingValue: {
    fontFamily: typography.body,
    color: colors.muted,
  },
  radiusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  radiusCard: {
    width: '47%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radiusLabel: {
    fontFamily: typography.bodyMedium,
    color: colors.text,
    textTransform: 'capitalize',
  },
  radiusShape: {
    width: 80,
    height: 60,
    backgroundColor: colors.primary,
  },
  radiusValue: {
    fontFamily: typography.body,
    color: colors.muted,
  },
  rowWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  eventTitle: {
    fontFamily: typography.heading,
    fontSize: 20,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  eventMeta: {
    fontFamily: typography.body,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  eventBody: {
    fontFamily: typography.body,
    color: colors.text,
    marginBottom: spacing.lg,
  },
});

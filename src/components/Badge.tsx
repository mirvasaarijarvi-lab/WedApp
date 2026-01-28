import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Props = {
  label: string;
  tone?: 'primary' | 'accent' | 'muted';
};

export default function Badge({ label, tone = 'muted' }: Props) {
  return (
    <View style={[styles.base, toneStyles[tone]]}>
      <Text style={[styles.text, toneTextStyles[tone]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.button,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
  },
});

const toneStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  accent: { backgroundColor: colors.accent },
  muted: { backgroundColor: colors.border },
});

const toneTextStyles = StyleSheet.create({
  primary: { color: colors.surface },
  accent: { color: colors.surface },
  muted: { color: colors.text },
});

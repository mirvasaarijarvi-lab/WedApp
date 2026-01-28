import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/theme';

type Props = {
  label: string;
  tone?: 'primary' | 'accent' | 'muted';
};

export default function Badge({ label, tone = 'muted' }: Props) {
  const { colors, radius, spacing, typography } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        primary: { backgroundColor: colors.primary },
        accent: { backgroundColor: colors.accent },
        muted: { backgroundColor: colors.border },
        textPrimary: { color: colors.surface },
        textAccent: { color: colors.surface },
        textMuted: { color: colors.text },
      }),
    [colors, radius, spacing, typography]
  );
  return (
    <View style={[styles.base, styles[tone]]}>
      <Text
        style={[
          styles.text,
          tone === 'primary' && styles.textPrimary,
          tone === 'accent' && styles.textAccent,
          tone === 'muted' && styles.textMuted,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

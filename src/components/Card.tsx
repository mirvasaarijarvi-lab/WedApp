import React, { useMemo } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../theme/theme';

type Props = ViewProps & {
  padding?: keyof typeof spacing;
};

export default function Card({ style, padding = 'lg', ...rest }: Props) {
  const { colors, radius, shadow, spacing } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.soft,
        },
      }),
    [colors, radius, shadow]
  );
  return <View style={[styles.card, { padding: spacing[padding] }, style]} {...rest} />;
}

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';

type Props = {
  size?: number;
  style?: ViewStyle;
  label?: string;
};

export default function BrandMark({ size = 44, style, label = 'W' }: Props) {
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        ring: {
          borderWidth: 2,
          borderColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
        },
        core: {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        },
        letter: {
          color: colors.surface,
          fontFamily: typography.heading,
          fontSize: 18,
        },
      }),
    [colors, typography]
  );
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <View style={[styles.core, { width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }]}>
        <Text style={styles.letter}>{label}</Text>
      </View>
    </View>
  );
}

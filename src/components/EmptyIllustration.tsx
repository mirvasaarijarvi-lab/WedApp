import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

type Props = {
  size?: number;
};

export default function EmptyIllustration({ size = 96 }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        ring: {
          position: 'absolute',
          borderWidth: 2,
          borderColor: colors.accent,
          backgroundColor: colors.surface,
        },
        core: {
          backgroundColor: colors.primary,
        },
        dot: {
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.secondary,
          opacity: 0.8,
        },
      }),
    [colors]
  );
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]} />
      <View style={[styles.core, { width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3 }]} />
      <View style={[styles.dot, { top: 6, left: size * 0.66 }]} />
      <View style={[styles.dot, { bottom: 10, right: size * 0.66 }]} />
      <View style={[styles.dot, { top: size * 0.56, left: 8 }]} />
    </View>
  );
}

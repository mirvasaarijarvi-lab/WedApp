import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

type Variant = 'rings' | 'calendar' | 'bouquet';

type Props = {
  size?: number;
  variant?: Variant;
};

export default function EmptyIllustration({ size = 96, variant = 'rings' }: Props) {
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
        bar: {
          position: 'absolute',
          width: size * 0.6,
          height: 10,
          borderRadius: 6,
          backgroundColor: colors.secondary,
        },
        bouquet: {
          position: 'absolute',
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.25,
          backgroundColor: colors.primary,
        },
        stem: {
          position: 'absolute',
          width: 10,
          height: size * 0.35,
          borderRadius: 6,
          backgroundColor: colors.accent,
          bottom: size * 0.05,
        },
      }),
    [colors, size]
  );

  if (variant === 'calendar') {
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <View style={[styles.ring, { width: size, height: size, borderRadius: 12 }]} />
        <View style={[styles.bar, { top: 10 }]} />
        <View style={[styles.core, { width: size * 0.6, height: size * 0.4, borderRadius: 10 }]} />
        <View style={[styles.dot, { bottom: 12, left: 14 }]} />
        <View style={[styles.dot, { bottom: 12, right: 14 }]} />
      </View>
    );
  }

  if (variant === 'bouquet') {
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <View style={[styles.bouquet, { top: 8 }]} />
        <View style={[styles.dot, { top: 6, left: 10 }]} />
        <View style={[styles.dot, { top: 18, right: 12 }]} />
        <View style={[styles.dot, { top: 26, left: 20 }]} />
        <View style={[styles.stem, { left: size * 0.46 }]} />
      </View>
    );
  }

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

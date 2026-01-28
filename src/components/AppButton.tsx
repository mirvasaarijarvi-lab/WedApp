import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AppButton({ title, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        stylesByVariant[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, textByVariant[variant]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.85,
  },
});

const stylesByVariant = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.secondary },
  ghost: { backgroundColor: 'transparent' },
});

const textByVariant = StyleSheet.create({
  primary: { color: colors.surface },
  secondary: { color: colors.surface },
  outline: { color: colors.secondary },
  ghost: { color: colors.secondary },
});

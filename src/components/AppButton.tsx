import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AppButton({ title, onPress, variant = 'primary', disabled, style }: Props) {
  const { colors, radius, spacing, typography } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        primary: { backgroundColor: colors.primary },
        secondary: { backgroundColor: colors.secondary },
        outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.secondary },
        ghost: { backgroundColor: 'transparent' },
        textPrimary: { color: colors.surface },
        textSecondary: { color: colors.surface },
        textOutline: { color: colors.secondary },
        textGhost: { color: colors.secondary },
      }),
    [colors, radius, spacing, typography]
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'primary' && styles.textPrimary,
          variant === 'secondary' && styles.textSecondary,
          variant === 'outline' && styles.textOutline,
          variant === 'ghost' && styles.textGhost,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

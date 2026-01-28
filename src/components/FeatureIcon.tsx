import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';

type Props = {
  name: 'guests' | 'tasks' | 'vendors' | 'timeline' | 'budget';
  size?: number;
};

const iconMap: Record<Props['name'], keyof typeof Feather.glyphMap> = {
  guests: 'users',
  tasks: 'check-square',
  vendors: 'briefcase',
  timeline: 'clock',
  budget: 'credit-card',
};

export default function FeatureIcon({ name, size = 36 }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors, size]
  );
  return (
    <View style={styles.wrap}>
      <Feather name={iconMap[name]} color={colors.secondary} size={size * 0.5} />
    </View>
  );
}

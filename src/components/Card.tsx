import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/tokens';

type Props = ViewProps & {
  padding?: keyof typeof spacing;
};

export default function Card({ style, padding = 'lg', ...rest }: Props) {
  return <View style={[styles.card, { padding: spacing[padding] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import EmptyIllustration from './EmptyIllustration';
import { colors, spacing, typography } from '../theme/tokens';

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <EmptyIllustration size={96} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel ? <AppButton title={actionLabel} variant="outline" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
});

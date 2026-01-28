import React, { useMemo } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../theme/theme';

export default function SectionTitle(props: TextProps) {
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontFamily: typography.heading,
          fontSize: 20,
          color: colors.text,
        },
      }),
    [colors, typography]
  );
  return <Text {...props} style={[styles.title, props.style]} />;
}

import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { colors, typography } from '../theme/tokens';

export default function SectionTitle(props: TextProps) {
  return <Text {...props} style={[styles.title, props.style]} />;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.heading,
    fontSize: 20,
    color: colors.text,
  },
});

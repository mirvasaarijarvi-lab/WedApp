import React from 'react';
import { View, Text } from 'react-native';

export default function VendorsScreen({ title = 'Vendors' }: { title?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>{title}</Text>
    </View>
  );
}

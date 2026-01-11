import React from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function DashboardScreen() {
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24 }}>Dashboard</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Auth: undefined;
  Verify: { email: string };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      Alert.alert('Check your email', 'Enter the code you received.');
      navigation.navigate('Verify', { email });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Welcome</Text>
      <Text>Enter your email to sign in or create an account.</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <Button title={loading ? 'Sendingâ€¦' : 'Send code'} onPress={sendCode} disabled={loading || !email} />
    </View>
  );
}

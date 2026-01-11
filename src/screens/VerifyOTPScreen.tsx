import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Auth: undefined;
  Verify: { email: string };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Verify'>;

export default function VerifyOTPScreen({ route }: Props) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
      if (error) throw error;
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Enter code</Text>
      <Text>We sent a 6-digit code to {email}.</Text>
      <TextInput
        keyboardType="number-pad"
        placeholder="123456"
        value={code}
        onChangeText={setCode}
        maxLength={6}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, letterSpacing: 4 }}
      />
      <Button title={loading ? 'Verifyingâ€¦' : 'Verify'} onPress={verify} disabled={loading || code.length < 4} />
    </View>
  );
}

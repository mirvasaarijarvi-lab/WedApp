import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Params = {
  EnterWeddingCode: { weddingId: string };
};

type Props = NativeStackScreenProps<Params, 'EnterWeddingCode'>;

const ROLES = [
  { key: 'bride_groom', label: 'Bride/Groom' },
  { key: 'best_man', label: 'Best man' },
  { key: 'maid_of_honor', label: 'Maid of honor' },
  { key: 'bridesmaid', label: 'Bridesmaid' },
  { key: 'groomsman', label: 'Groomsman' },
  { key: 'planner', label: 'Wedding planner' },
  { key: 'officiant', label: 'Officiant / Priest' },
  { key: 'guest', label: 'Guest' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'venue', label: 'Venue' },
];

export default function EnterWeddingCodeScreen({ route }: Props) {
  const { weddingId } = route.params;
  const { setWeddingId } = useWedding();
  const [code, setCode] = useState('');
  const [role, setRole] = useState(ROLES[0].key);
  const [loading, setLoading] = useState(false);

  const onJoin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('join_wedding_with_code', {
        wid: weddingId,
        role_in: role,
        code_in: code,
      });
      if (error) throw error;
      if (!data) throw new Error('Invalid code');
      await setWeddingId(weddingId);
      Alert.alert('Joined', 'You now have access to this wedding.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Enter wedding password</Text>
      <Text>Select your role, then enter the password provided by the couple.</Text>

      <View style={{ gap: 8 }}>
        {ROLES.map((r) => (
          <Button
            key={r.key}
            title={`${role === r.key ? '• ' : ''}${r.label}`}
            onPress={() => setRole(r.key)}
          />
        ))}
      </View>

      <TextInput
        secureTextEntry
        placeholder="Wedding password"
        value={code}
        onChangeText={setCode}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginTop: 12 }}
      />

      <Button title={loading ? 'Joining…' : 'Join'} onPress={onJoin} disabled={loading || !code} />
    </View>
  );
}


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';
import { useNavigation } from '@react-navigation/native';

export default function WeddingsScreen() {
  const { setWeddingId } = useWedding();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const [signingOut, setSigningOut] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('wedding_members')
      .select('wedding_id, weddings(title, date, venue)')
      .eq('user_id', user.id)
      .order('wedding_id');
    if (error) Alert.alert('Error', error.message);
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const signOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      await setWeddingId(null);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to sign out');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Your weddings</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Button title="Create new" onPress={() => navigation.navigate('CreateWedding')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title={signingOut ? 'Signing out…' : 'Sign out'} onPress={signOut} disabled={signingOut} />
        </View>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.wedding_id}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontSize: 16 }}>{item.weddings?.title}</Text>
            <Button title="Open" onPress={() => navigation.navigate('EnterWeddingCode', { weddingId: item.wedding_id })} />
          </View>
        )}
        ListEmptyComponent={<Text>No weddings yet.</Text>}
      />
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';
import { Session } from '@supabase/supabase-js';

export default function CreateWeddingScreen() {
  const { setWeddingId } = useWedding();
  const [title, setTitle] = useState('Our Wedding');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = (session as Session | null)?.user?.id;
      if (!userId) throw new Error('No user');

      const { data: wedding, error: wErr } = await supabase
        .from('weddings')
        .insert([{ title, date: date || null, venue: venue || null }])
        .select()
        .single();
      if (wErr) throw wErr;

      const { error: mErr } = await supabase
        .from('wedding_members')
        .insert([{ wedding_id: wedding.id, user_id: userId, role: 'owner' }]);
      if (mErr) throw mErr;

      await setWeddingId(wedding.id);
      Alert.alert('Wedding created');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Create wedding</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Venue" value={venue} onChangeText={setVenue} style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }} />
      <Button title={loading ? 'Creatingâ€¦' : 'Create'} onPress={onCreate} disabled={loading || !title} />
    </View>
  );
}

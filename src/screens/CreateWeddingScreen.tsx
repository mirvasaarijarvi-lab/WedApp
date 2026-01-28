import React, { useEffect, useState } from 'react';
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
  const [debug, setDebug] = useState<{ userId?: string | null; email?: string | null; role?: string | null }>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setDebug({
        userId: data.session?.user?.id ?? null,
        email: data.session?.user?.email ?? null,
        role: data.session?.user?.role ?? null,
      });
    });
  }, []);

  const parseDateInput = (value: string) => {
    if (!value) return null;
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 8) return null;
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    const iso = `${year}-${month}-${day}`;
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return null;
    return iso;
  };

  const onCreate = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = (session as Session | null)?.user?.id;
      if (!userId) throw new Error('No user');

      const parsedDate = parseDateInput(date);
      if (date && !parsedDate) throw new Error('Date must be DDMMYYYY');

      const { data: wedding, error: wErr } = await supabase
        .from('weddings')
        .insert([{ title, date: parsedDate, venue: venue || null }])
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
      <View style={{ backgroundColor: '#f2f2f2', padding: 12, borderRadius: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 4 }}>Debug</Text>
        <Text style={{ fontSize: 12 }}>User ID: {debug.userId || 'none'}</Text>
        <Text style={{ fontSize: 12 }}>Email: {debug.email || 'none'}</Text>
        <Text style={{ fontSize: 12 }}>Role: {debug.role || 'none'}</Text>
      </View>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }} />
      <TextInput
        placeholder="Date (DDMMYYYY)"
        value={date}
        onChangeText={setDate}
        inputMode="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <TextInput placeholder="Venue" value={venue} onChangeText={setVenue} style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }} />
      <Button title={loading ? 'Creatingâ€¦' : 'Create'} onPress={onCreate} disabled={loading || !title} />
    </View>
  );
}

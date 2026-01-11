import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useWedding } from '../lib/WeddingContext';

type Guest = {
  id: string;
  wedding_id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export default function GuestsScreen() {
  const { weddingId } = useWedding();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEditingId(null);
  };

  const load = async () => {
    if (!weddingId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('name');
    if (error) Alert.alert('Error', error.message);
    setGuests((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [weddingId]);

  const onSubmit = async () => {
    if (!weddingId || !name) return;
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('guests')
          .update({ name, email: email || null, phone: phone || null })
          .eq('id', editingId)
          .eq('wedding_id', weddingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guests')
          .insert([{ wedding_id: weddingId, name, email: email || null, phone: phone || null }]);
        if (error) throw error;
      }
      resetForm();
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save guest');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (g: Guest) => {
    setEditingId(g.id);
    setName(g.name);
    setEmail(g.email || '');
    setPhone(g.phone || '');
  };

  const onDelete = async (id: string) => {
    if (!weddingId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('guests').delete().eq('id', id).eq('wedding_id', weddingId);
      if (error) throw error;
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to delete guest');
    } finally {
      setLoading(false);
    }
  };

  const setRsvp = async (guestId: string, status: 'yes' | 'no' | 'maybe') => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('rsvps')
        .upsert({ guest_id: guestId, status }, { onConflict: 'guest_id' });
      if (error) throw error;
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to set RSVP');
    } finally {
      setLoading(false);
    }
  };

  if (!weddingId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          Select or create a wedding first to manage guests.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Guests</Text>

      <View style={{ gap: 8, marginBottom: 12 }}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          inputMode="email"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          inputMode="tel"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title={editingId ? 'Save' : 'Add'} onPress={onSubmit} disabled={loading || !name} />
          {editingId ? <Button title="Cancel" onPress={resetForm} /> : null}
        </View>
      </View>

      <FlatList
        data={guests}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            {!!item.email && <Text style={{ color: '#666' }}>{item.email}</Text>}
            {!!item.phone && <Text style={{ color: '#666' }}>{item.phone}</Text>}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Button title="Edit" onPress={() => onEdit(item)} />
              <Button title="Delete" onPress={() => onDelete(item.id)} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Button title="RSVP Yes" onPress={() => setRsvp(item.id, 'yes')} />
              <Button title="RSVP No" onPress={() => setRsvp(item.id, 'no')} />
              <Button title="RSVP Maybe" onPress={() => setRsvp(item.id, 'maybe')} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No guests yet.</Text>}
      />
    </View>
  );
}

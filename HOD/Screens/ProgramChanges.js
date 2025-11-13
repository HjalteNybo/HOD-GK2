import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../Context/Auth';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function ProgramChanges() {
  const { user, isStaff } = useAuth();
  const db = getFirestore();

  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'programChanges'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const createChange = async () => {
    if (!text.trim()) return;
    try {
      setSaving(true);
      await addDoc(collection(db, 'programChanges'), {
        text: text.trim(),
        active: true,
        createdAt: serverTimestamp(),
        authorUid: user?.uid || null,
        authorEmail: user?.email || null,
      });
      setText('');
    } catch (e) {
      Alert.alert('Fejl', String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await updateDoc(doc(db, 'programChanges', item.id), { active: !item.active });
    } catch (e) {
      Alert.alert('Fejl', String(e?.message || e));
    }
  };

  const removeItem = async (item) => {
    Alert.alert('Slet ændring', 'Er du sikker?', [
      { text: 'Annuller' },
      {
        text: 'Slet',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'programChanges', item.id));
          } catch (e) {
            Alert.alert('Fejl', String(e?.message || e));
          }
        }
      }
    ]);
  };

  if (!isStaff) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}>
        <Text style={{ fontWeight:'700', fontSize:16 }}>Kun personale kan redigere programændringer.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex:1 }} edges={['top','bottom']}>
      <View style={{ flex:1, padding:16, paddingTop: 12, gap:12 }}>

      <TextInput
        placeholder="Skriv en ændring (vises på startskærmen)"
        value={text}
        onChangeText={setText}
        multiline
        style={{
          borderWidth:1, borderColor:'#D9C9A6', borderRadius:10,
          padding:12, minHeight:80, backgroundColor:'#fff'
        }}
      />

      <Pressable
        onPress={createChange}
        disabled={saving || !text.trim()}
        style={({pressed}) => [
          { backgroundColor:'#3E6B39', padding:12, borderRadius:10, alignItems:'center', opacity: (saving || !text.trim()) ? 0.7 : 1 },
          pressed && { opacity:0.9 }
        ]}
        accessibilityLabel="Gem ændring"
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'800' }}>Gem ændring</Text>}
      </Pressable>

      <View style={{ height:12 }} />

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height:10 }} />}
        renderItem={({ item }) => (
          <View style={{
            borderWidth:1, borderColor:'#D9C9A6', borderRadius:12, padding:12,
            backgroundColor: item.active ? '#F7FFF4' : '#FFF8F4'
          }}>
            <Text style={{ marginBottom:8 }}>{item.text}</Text>
            <Text style={{ fontSize:12, color:'#666', marginBottom:8 }}>
              {item.authorEmail ? `Oprettet af: ${item.authorEmail}` : 'Oprettet'}
            </Text>

            <View style={{ flexDirection:'row', gap:8 }}>
              <Pressable
                onPress={() => toggleActive(item)}
                style={({pressed}) => [
                  { backgroundColor: item.active ? '#F28C38' : '#3E6B39', padding:10, borderRadius:10, alignItems:'center' },
                  pressed && { opacity:0.9 }
                ]}
                accessibilityLabel={item.active ? 'Skjul ændring' : 'Gør aktiv'}
              >
                <Text style={{ color:'#fff', fontWeight:'700' }}>
                  {item.active ? 'Skjul fra forsiden' : 'Vis på forsiden'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => removeItem(item)}
                style={({pressed}) => [
                  { backgroundColor:'#C23B22', padding:10, borderRadius:10, alignItems:'center' },
                  pressed && { opacity:0.9 }
                ]}
                accessibilityLabel="Slet ændring"
              >
                <Text style={{ color:'#fff', fontWeight:'700' }}>Slet</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
   </SafeAreaView>
  );
}
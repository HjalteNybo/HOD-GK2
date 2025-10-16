import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseApp';

const COLS = 3;
const GAP = 6;

export default function Forum({ navigation }) {
  const [items, setItems] = useState(null);   // null = loading
  const [error, setError] = useState(null);

  const size = useMemo(() => {
    const w = Dimensions.get('window').width;
    const pad = GAP * (COLS + 1);
    return Math.floor((w - pad) / COLS);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'media'),
      orderBy('uploadedAt', 'desc'),
      limit(60) // fint til start – kan udvides senere
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map(d => {
          const data = d.data() || {};
          const ts = data.uploadedAt;
          return {
            id: d.id,
            downloadURL: data.downloadURL,
            type: data.type || 'image',      // 'image' | 'video'
            caption: data.caption || '',
            uploadedByEmail: data.uploadedByEmail || '',
            uploadedAtMillis: ts?.toMillis ? ts.toMillis() : 0, // serialiserbar
            visible: data.visible !== false,
          };
        }).filter(x => x.visible && x.downloadURL);
        setItems(list);
        setError(null);
      },
      (err) => {
        setError(err?.message || 'Kunne ikke hente galleri.');
        setItems([]);
      }
    );
    return () => unsub();
  }, []);

  if (items === null) {
    return (
      <View style={s.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Henter galleri…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.center}>
        <Text style={{ color: '#C23B22' }}>{error}</Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={s.center}>
        <Text>Endnu ingen uploads – kom tilbage senere ✨</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('MediaViewer', { media: item })} // kun serialiserbare felter
      style={{ width: size, height: size, margin: GAP, borderRadius: 10, overflow: 'hidden', backgroundColor: '#eee' }}
    >
      <Image
        source={{ uri: item.downloadURL }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        accessible
        accessibilityLabel={item.caption || (item.type === 'video' ? 'Video' : 'Billede')}
      />
      {item.type === 'video' && (
        <View style={s.videoBadge}>
          <Text style={{ color:'#fff', fontWeight:'800' }}>▶︎</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={{ flex:1, paddingTop: GAP }}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        numColumns={COLS}
        contentContainerStyle={{ paddingHorizontal: GAP, paddingBottom: 24 }}
        removeClippedSubviews
        initialNumToRender={18}
        windowSize={10}
      />
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex:1, alignItems:'center', justifyContent:'center', padding:16 },
  videoBadge: {
    position:'absolute', right:6, top:6,
    backgroundColor:'rgba(0,0,0,0.45)',
    paddingHorizontal:8, paddingVertical:4, borderRadius:8
  }
});
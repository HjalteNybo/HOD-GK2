import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseApp';
import s from '../Styles/GalleriStyles';

const COLS = 3;
const GAP = 6; // mellemrum

export default function Galleri({ navigation }) {
  const [items, setItems] = useState(null);   // null = loading
  const [error, setError] = useState(null);

  // Breddeberegning: vi har (COLS - 1) mellemrum imellem + 2 * padding ved kanter
  // Vi bruger margin = GAP/2 pr. tile, så samlet imellem tiles bliver = GAP.
  const size = useMemo(() => {
    const w = Dimensions.get('window').width;
    const pad = GAP * (COLS + 1); // (COLS - 1) mellemrum + venstre og højre kant
    return Math.floor((w - pad) / COLS);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'media'),
      orderBy('uploadedAt', 'desc'),
      limit(60)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map(d => {
            const data = d.data() || {};
            const ts = data.uploadedAt;
            return {
              id: d.id,
              downloadURL: data.downloadURL,
              type: data.type || 'image',
              caption: data.caption || '',
              uploadedByEmail: data.uploadedByEmail || '',
              uploadedAtMillis: ts?.toMillis ? ts.toMillis() : 0,
              visible: data.visible !== false,
            };
          })
          .filter(x => x.visible && x.downloadURL);
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
      <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={s.centerText}>Henter galleri…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!items.length) {
    return (
      <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
        <View style={s.center}>
          <Text style={s.centerText}>Endnu ingen uploads – kom tilbage senere ✨</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('MediaViewer', { media: item })}
      style={[s.tile, { width: size, height: size, margin: GAP / 2 }]} // ← halv margin
    >
      <Image
        source={{ uri: item.downloadURL }}
        style={s.image}
        resizeMode="cover"
        accessible
        accessibilityLabel={item.caption || (item.type === 'video' ? 'Video' : 'Billede')}
      />
      {item.type === 'video' && (
        <View style={s.videoBadge}>
          <Text style={s.videoBadgeText}>▶︎</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        numColumns={COLS}
        contentContainerStyle={[s.gridContent, { paddingHorizontal: GAP }]} // ← kant-indrykning
        removeClippedSubviews
        initialNumToRender={18}
        windowSize={10}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
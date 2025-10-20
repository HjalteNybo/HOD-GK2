import React, { useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import styles from "../Styles/MedieViewerStyles";

// Komponent der viser et slide med enten billede eller video og styrer afspilning efter aktiv status
function Slide({ item, isActive, width, height }) {
  const isVideo = item?.type === 'video';
  const player = useVideoPlayer(isVideo ? item.downloadURL : null, (p) => {
    if (isActive) p.play();
  });

  useEffect(() => {
    if (!isVideo || !player) return;
    if (isActive) player.play();
    else player.pause();
  }, [isActive, isVideo, player]);

  return (
    <View style={[styles.slide, { width, height }]}>
      {isVideo ? (
        <VideoView
          style={styles.media}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
      ) : (
        <Image
          source={{ uri: item.downloadURL }}
          style={styles.media}
          resizeMode="contain"
          accessible
          accessibilityLabel={item.caption || 'Billede'}
        />
      )}
    </View>
  );
}

// Komponent der viser et swipebart galleri for billeder/videoer, holder styr på aktivt slide/startindeks, opdaterer header-titel og viser caption/meta i footer
export default function MediaViewer({ route, navigation }) {
  const insets = useSafeAreaInsets();

  // Bagudkompatibel med tidligere navigation: enten {items, startIndex} eller bare {media}
  const incomingMedia = route?.params?.media;
  const incomingItems = route?.params?.items;
  const startIndexParam = route?.params?.startIndex ?? 0;

  const items = useMemo(() => {
    if (Array.isArray(incomingItems) && incomingItems.length) return incomingItems;
    if (incomingMedia) return [incomingMedia];
    return [];
  }, [incomingItems, incomingMedia]);

  const [index, setIndex] = useState(
    Math.min(Math.max(startIndexParam, 0), Math.max(items.length - 1, 0))
  );

  const flatRef = useRef(null);
  const { width, height } = Dimensions.get('window');

  const getItemLayout = useCallback(
    (_data, i) => ({ length: width, offset: width * i, index: i }),
    [width]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: items.length ? `${index + 1} / ${items.length}` : 'Galleri',
      headerLargeTitle: false,
      headerTintColor: '#fff',
      headerStyle: { backgroundColor: '#000' },
    });
  }, [index, items.length, navigation]);

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      setIndex(viewableItems[0].index ?? 0);
    }
  });

  const onScrollToIndexFailed = useCallback((info) => {
    setTimeout(() => {
      flatRef.current?.scrollToIndex({ index: info.index, animated: false });
    }, 10);
  }, []);

  if (!items.length) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Indlæser…</Text>
      </SafeAreaView>
    );
  }

  const current = items[index] || {};

  const dateStr = current.uploadedAtMillis
    ? new Date(current.uploadedAtMillis).toLocaleString()
    : '';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      {/* SWIPER – fylder alt pladsen over footeren */}
      <View style={styles.swiperArea}>
        <FlatList
          ref={flatRef}
          data={items}
          keyExtractor={(it) => it.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index: i }) => (
            <Slide item={item} isActive={i === index} width={width} height={height} />
          )}
          initialScrollIndex={index}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          removeClippedSubviews
          windowSize={3}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged.current}
        />
      </View>

      {/* FOOTER – caption/meta under billedet (ikke overlay), så mediet forbliver centreret */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {!!current.caption && <Text style={styles.caption}>{current.caption}</Text>}
        <Text style={styles.meta}>
          {current.uploadedByEmail ? `Uploadet af ${current.uploadedByEmail}` : 'Uploadet'}
          {dateStr ? ` — ${dateStr}` : ''}
        </Text>
      </View>
    </SafeAreaView>
  );
}

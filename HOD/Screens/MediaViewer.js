import React, { useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import styles from "../Styles/MedieViewerStyles";

// Én slide (billede eller video)
function Slide({ item, isActive, containerW, containerH }) {
  const isVideo = item && item.type === "video";

  const [ratio, setRatio] = useState(null);
  const isPortrait = useMemo(() => (ratio ? ratio < 1 : false), [ratio]);

  useEffect(() => {
    if (!isVideo && item?.downloadURL) {
      Image.getSize(
        item.downloadURL,
        (w, h) => setRatio(w / h),
        () => setRatio(null)
      );
    }
  }, [isVideo, item?.downloadURL]);

  const PORTRAIT_FRAC = 0.82;
  const LANDSCAPE_FRAC = 0.72;
  const boxH = Math.round(
    containerH * (isPortrait ? PORTRAIT_FRAC : LANDSCAPE_FRAC)
  );

  // Video player
  const player = useVideoPlayer(isVideo ? item?.downloadURL : null, (p) => {
    if (isActive) p.play();
  });

  useEffect(() => {
    if (!isVideo || !player) return;
    if (isActive) player.play();
    else player.pause();
  }, [isActive, isVideo, player]);

  // Skjul ikke-aktiv slide for A11Y, så skærmlæser ikke oplæser alt
  const a11yHiddenProps = isActive
    ? {}
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility:
          Platform.OS === "android" ? "no-hide-descendants" : "no-hide-descendants",
      };

  return (
    <View
      style={[styles.slide, { width: containerW, height: containerH }]}
      {...a11yHiddenProps}
    >
      <View
        style={{
          width: containerW,
          height: boxH,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isVideo ? (
          // Pak VideoView ind i en container med label
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={item?.caption ? `${item.caption} (video)` : "Video"}
            style={{ width: "100%", height: "100%" }}
          >
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="contain"
            />
          </View>
        ) : (
          <Image
            source={{ uri: item?.downloadURL }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            accessible
            accessibilityRole="image"
            accessibilityLabel={item?.caption || "Billede"}
          />
        )}
      </View>
    </View>
  );
}

// Hovedkomponent
export default function MediaViewer({ route, navigation }) {
  const insets = useSafeAreaInsets();

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
  const { width: screenW, height: screenH } = Dimensions.get("window");
  const [viewerH, setViewerH] = useState(0);

  const getItemLayout = useCallback(
    (_data, i) => ({ length: screenW, offset: screenW * i, index: i }),
    [screenW]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: items.length ? `${index + 1} / ${items.length}` : "Galleri",
      headerLargeTitle: false,
      headerTintColor: "#fff",
      headerStyle: { backgroundColor: "#000" },
    });
  }, [index, items.length, navigation]);

  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 50 }),
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      const next = viewableItems[0].index ?? 0;
      if (typeof next === "number" && next !== index) setIndex(next);
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
        <Text style={{ marginTop: 8, color: "#fff" }}>Indlæser…</Text>
      </SafeAreaView>
    );
  }

  const current = items[index] || {};
  const dateStr = current.uploadedAtMillis
    ? new Date(current.uploadedAtMillis).toLocaleString()
    : "";

  return (
    <SafeAreaView
      style={styles.root}
      edges={["top", "left", "right", "bottom"]}
      accessible
      accessibilityLabel="Medievisning. Stryg vandret for at skifte billede eller video."
    >
      <View
        style={styles.swiperArea}
        onLayout={(e) => setViewerH(e.nativeEvent.layout.height)}
      >
        <FlatList
          ref={flatRef}
          data={items}
          keyExtractor={(it, i) => String(it?.id ?? i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index: i }) => (
            <Slide
              item={item}
              isActive={i === index}
              containerW={screenW}
              containerH={viewerH || screenH}
            />
          )}
          initialScrollIndex={index}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          removeClippedSubviews
          windowSize={3}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged.current}
          accessibilityRole="list"
          accessibilityLabel={`Galleri med ${items.length} elementer`}
        />
      </View>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel="Mediedetaljer"
      >
        {!!current.caption && <Text style={styles.caption}>{current.caption}</Text>}
        <Text style={styles.meta}>
          {current.uploadedByEmail
            ? `Uploadet af ${current.uploadedByEmail}`
            : "Uploadet"}
          {dateStr ? ` — ${dateStr}` : ""}
        </Text>
      </View>
    </SafeAreaView>
  );
}

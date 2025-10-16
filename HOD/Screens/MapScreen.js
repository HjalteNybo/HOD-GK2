import React, { useMemo } from "react";
import { View, ImageBackground, Pressable, Text, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../Styles/GlobalStyles";

// Gestures & Reanimated (SDK 54+)
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

// TODO: Ret/udvid listen så den matcher jeres boder/events
const HOTSPOTS = [
  { id: "SCENE", label: "Scene", xPct: 62, yPct: 28, r: 22 },
  { id: "KAFFE", label: "Kaffebod", xPct: 18, yPct: 42, r: 20 },
  { id: "MAD",   label: "Madbod", xPct: 75, yPct: 63, r: 22 },
  // ... flere hotspots
];

export default function MapScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const aspect = 16 / 9; 
  const height = width / aspect;

  // Zoom / pan state
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, Math.min(3, e.scale)); // begræns zoom mellem 1x og 3x
    })
    .onEnd(() => {
      // snap lidt tilbage hvis under/over grænser
      if (scale.value < 1) scale.value = withTiming(1);
      if (scale.value > 3) scale.value = withTiming(3); 
    });

  let lastX = 0;
  let lastY = 0;
  const pan = Gesture.Pan()
    .onBegin(() => {
      lastX = translateX.value;
      lastY = translateY.value;
    })
    .onUpdate((e) => {
      // begræns pan lidt
      const limX = (width * (scale.value - 1)) / 2 + 40;
      const limY = (height * (scale.value - 1)) / 2 + 40;
      const nx = Math.max(-limX, Math.min(limX, lastX + e.translationX));
      const ny = Math.max(-limY, Math.min(limY, lastY + e.translationY));
      translateX.value = nx;
      translateY.value = ny;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const imgStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Beregn absolute positions for hotspots (afhængigt af width/height)
  const hotspotRects = useMemo(() => {
    return HOTSPOTS.map((h) => {
      const left = (h.xPct / 100) * width - h.r;
      const top = (h.yPct / 100) * height - h.r;
      return { ...h, left, top };
    });
  }, [width, height]);

  const onPressHotspot = (id) => {
    navigation.navigate("Program", { boothId: id });
  };

  return (
    <View style={[GlobalStyles.screen, { padding: 0 }]}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[{ width, height, alignSelf: "center", overflow: "hidden" }, imgStyle]}>
          <ImageBackground
            source={require("../assets/hod-plads.png")}
            style={{ width, height }}
            resizeMode="cover"
            accessible
            accessibilityLabel="Pladsoversigt"
          >
            {hotspotRects.map((h) => (
              <Pressable
                key={h.id}
                onPress={() => onPressHotspot(h.id)}
                accessibilityRole="button"
                accessibilityLabel={`${h.label}. Tryk for at åbne program`}
                style={{
                  position: "absolute",
                  left: h.left,
                  top: h.top,
                  width: h.r * 2,
                  height: h.r * 2,
                  borderRadius: h.r,
                  backgroundColor: "rgba(53,88,166,0.88)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "white",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{h.label}</Text>
              </Pressable>
            ))}
          </ImageBackground>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

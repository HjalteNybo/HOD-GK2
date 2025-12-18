import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Image, Pressable, Text, Animated, StyleSheet } from "react-native";
import { PinchGestureHandler, TapGestureHandler, PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../Styles/ClassicMapStyles";
import { colors } from "../Styles/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { Image as RNImage } from "react-native";

const MAP_IMAGE = require("../assets/pladsen.png");
const FILTERS_KEY = "classicmap_filters_v1";

const PLACES = {
  "Hovedområde": { boothId: "Hovedområde", label: "Hovedområde", short: "Hovedområde", xPct: 50, yPct: 18, color: "#FF6B00", icon: "home" },
  "Scene":       { boothId: "Scene",       label: "Main Scene",  short: "Scene",        xPct: 62, yPct: 28, color: "#7C4DFF", icon: "musical-notes" },
  "Sanseområdet":{ boothId: "Sanseområdet",label: "Sanseområdet",short: "Sanse",        xPct: 30, yPct: 45, color: "#00BCD4", icon: "color-wand" },
  "Telt A":      { boothId: "Telt A",      label: "Telt A",      short: "Telt A",       xPct: 40, yPct: 60, color: "#4CAF50", icon: "pricetag" },
  "Fællesområde":{ boothId: "Fællesområde",label: "Fællesområde",short: "Fælles",       xPct: 55, yPct: 70, color: "#FFC107", icon: "people" },
};
const PLACE_ORDER = ["Hovedområde", "Scene", "Sanseområdet", "Telt A", "Fællesområde"];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function ClassicMapCompat() {
  const navigation = useNavigation();

  // --- filters (persistent)
  const [activeFilters, setActiveFilters] = useState(() => new Set(PLACE_ORDER));
  useEffect(() => { (async () => {
    try { const raw = await AsyncStorage.getItem(FILTERS_KEY); if (raw) setActiveFilters(new Set(JSON.parse(raw))); } catch {} })();
  }, []);
  useEffect(() => { (async () => { try { await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify([...activeFilters])); } catch {} })(); }, [activeFilters]);
  const toggleFilter = (k) => setActiveFilters(prev => {
    const next = new Set(prev); next.has(k) ? next.delete(k) : next.add(k);
    return next.size === 0 ? new Set(PLACE_ORDER) : next;
  });

  // --- layout
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [content, setContent] = useState({ w: 0, h: 0 });
  const imgRatioRef = useRef(1);
  const onLayout = (e) => {
    const { width } = e.nativeEvent.layout;
    setViewport({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
    const ratio = imgRatioRef.current || 1;
    const targetW = width;
    const targetH = targetW / ratio;
    setContent({ w: targetW, h: targetH });
  };
  useEffect(() => {
    try {
      const src = RNImage.resolveAssetSource(MAP_IMAGE);
      if (src?.width && src?.height) imgRatioRef.current = src.width / src.height;
    } catch {}
  }, []);

  // --- JS Animated zoom + pan (pan only when zoomed)
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  const doubleTapRef = useRef(null);

  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(baseScale, pinchScale);
  const lastScaleRef = useRef(1);
  const [zoomed, setZoomed] = useState(false);

  const translationX = useRef(new Animated.Value(0)).current;
  const translationY = useRef(new Animated.Value(0)).current;
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);

  const animateTo = (val) => {
    Animated.timing(baseScale, { toValue: val, duration: 180, useNativeDriver: true }).start();
    lastScaleRef.current = val;
    setZoomed(val > 1.01);
    if (val <= 1.01) {
      // reset pan when back to 1x
      offsetXRef.current = 0; offsetYRef.current = 0;
      translationX.setOffset(0); translationX.setValue(0);
      translationY.setOffset(0); translationY.setValue(0);
    }
  };

  // pinch
  const onPinchEvent = Animated.event([{ nativeEvent: { scale: pinchScale } }], { useNativeDriver: true });
  const onPinchStateChange = (e) => {
    if (e.nativeEvent.state === State.END || e.nativeEvent.oldState === State.ACTIVE) {
      let next = lastScaleRef.current * e.nativeEvent.scale;
      next = clamp(next, 1, 3);
      pinchScale.setValue(1);
      animateTo(next);
    }
  };

  // double-tap
  const onDoubleTapActivated = () => {
    const target = lastScaleRef.current > 1.2 ? 1 : 2;
    animateTo(target);
  };

  // pan (only when zoomed)
  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX, translationY } }],
    { useNativeDriver: true }
  );
  const getPanBounds = () => {
    const s = lastScaleRef.current || 1;
    const scaledW = content.w * s;
    const scaledH = content.h * s;
    const vw = viewport.w || 0;
    const vh = viewport.h || 0;
    const maxX = Math.max(0, (scaledW - vw) / 2);
    const maxY = Math.max(0, (scaledH - vh) / 2);
    return { maxX, maxY };
  };
  const onPanStateChange = (e) => {
    if (!zoomed) {
      translationX.setOffset(0); translationX.setValue(0);
      translationY.setOffset(0); translationY.setValue(0);
      offsetXRef.current = 0; offsetYRef.current = 0;
      return;
    }
    if (e.nativeEvent.state === State.BEGAN) {
      translationX.setOffset(offsetXRef.current);
      translationY.setOffset(offsetYRef.current);
    }
    if (e.nativeEvent.state === State.END || e.nativeEvent.oldState === State.ACTIVE) {
      offsetXRef.current += e.nativeEvent.translationX;
      offsetYRef.current += e.nativeEvent.translationY;

      const { maxX, maxY } = getPanBounds();
      offsetXRef.current = clamp(offsetXRef.current, -maxX, maxX);
      offsetYRef.current = clamp(offsetYRef.current, -maxY, maxY);

      translationX.setOffset(offsetXRef.current);
      translationX.setValue(0);
      translationY.setOffset(offsetYRef.current);
      translationY.setValue(0);
    }
  };

  // transform (pan -> scale)
  const transformStyle = {
    transform: [
      { translateX: translationX },
      { translateY: translationY },
      { scale },
    ],
  };

  // --- modal over map (fade/scale)
  const [selected, setSelected] = useState(null);
  const modalAnim = useRef(new Animated.Value(0)).current;
  const openModal = (key) => {
    setSelected(key);
    requestAnimationFrame(() => {
      modalAnim.setValue(0);
      Animated.timing(modalAnim, { toValue: 1, duration: 160, useNativeDriver: true }).start();
    });
  };
  const closeModal = () => {
    Animated.timing(modalAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setSelected(null);
    });
  };
  const modalStyle = {
    opacity: modalAnim,
    transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
  };
  const navigateToProgram = (boothId) => navigation.navigate("Program", { boothId });

  const filteredPlaceKeys = useMemo(
    () => PLACE_ORDER.filter((k) => activeFilters.has(k)),
    [activeFilters]
  );

  return (
    <View style={styles.root} onLayout={onLayout} accessibilityLabel="Plads-kort (compat)">
      {/* === GESTURE AREA (fills available height) === */}
      <TapGestureHandler
        ref={doubleTapRef}
        numberOfTaps={2}
        onActivated={onDoubleTapActivated}
        simultaneousHandlers={[pinchRef, panRef]}
      >
        <View style={{ flex: 1 }}>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            onHandlerStateChange={onPinchStateChange}
            simultaneousHandlers={[doubleTapRef, panRef]}
          >
            <Animated.View style={{ flex: 1 }} collapsable={false}>
              <PanGestureHandler
                ref={panRef}
                enabled={zoomed}
                minDist={5}
                onGestureEvent={onPanEvent}
                onHandlerStateChange={onPanStateChange}
                simultaneousHandlers={[pinchRef, doubleTapRef]}
              >
                <Animated.View style={{ flex: 1 }} collapsable={false}>
                  <View style={styles.canvasHost} pointerEvents="box-none">
                    <Animated.View
                      style={[styles.canvasContent, { width: content.w, height: content.h }, transformStyle]}
                      collapsable={false}
                    >
                      <Image
                        source={MAP_IMAGE}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="contain"
                        accessibilityIgnoresInvertColors
                        accessibilityLabel="Kort over pladsen"
                      />
                      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                        {filteredPlaceKeys.map((key) => {
                          const p = PLACES[key];
                          const left = (p.xPct / 100) * content.w;
                          const top = (p.yPct / 100) * content.h;
                          return (
                            <Pressable
                              key={key}
                              style={[styles.pin, { left, top }]}
                              onPress={() => openModal(key)}
                              accessibilityRole="button"
                              accessibilityLabel={`${p.label}. Tryk for detaljer og program.`}
                            >
                              <View style={[styles.pinBubble, { backgroundColor: p.color }]}>
                                <Ionicons name={p.icon} size={16} color={"#fff"} />
                              </View>
                              <Text style={styles.pinLabel} numberOfLines={1}>{p.short || p.label}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </Animated.View>
                  </View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </View>
      </TapGestureHandler>

      {/* === CHIPS UNDER THE IMAGE === */}
      <View style={styles.filterBarBottom} accessibilityRole="tablist">
        {PLACE_ORDER.map((k) => {
          const isOn = activeFilters.has(k);
          return (
            <Pressable
              key={k}
              onPress={() => toggleFilter(k)}
              style={({ pressed }) => [
                styles.chip,
                isOn ? styles.chipOn : styles.chipOff,
                pressed && styles.chipPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isOn }}
              accessibilityLabel={`Filter ${k} ${isOn ? "til" : "fra"}`}
            >
              <Ionicons name={PLACES[k].icon} size={16} color={isOn ? colors.white : colors.text} style={{ marginRight: 6 }} />
              <Text style={[styles.chipText, isOn ? styles.chipTextOn : styles.chipTextOff]}>{k}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* MODAL overlay */}
      {selected && (
        <View style={styles.modalHost} pointerEvents="box-none">
          <Pressable
            style={styles.modalBackdrop}
            onPress={closeModal}
            accessibilityRole="button"
            accessibilityLabel="Luk"
          />
          <Animated.View
            style={[styles.modalCard, modalStyle]}
            accessible
            accessibilityLabel={`${PLACES[selected].label} detaljer`}
            accessibilityHint="Tryk udenfor for at lukke. Aktiver knappen for at se programmet."
            accessibilityViewIsModal={true}
            importantForAccessibility="yes"
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{PLACES[selected].label}</Text>
              <Pressable onPress={closeModal} accessibilityRole="button" accessibilityLabel="Luk">
                <Ionicons name="close" size={22} color={colors.white} />
              </Pressable>
            </View>

            <Text style={styles.modalText}>
              Se aktiviteter og tider for <Text style={{ fontWeight: "600", color: "#fff" }}>{PLACES[selected].label}</Text> i programmet.
            </Text>

            <Pressable
              onPress={() => { closeModal(); navigateToProgram(PLACES[selected].boothId); }}
              style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Vis ${PLACES[selected].label} i Program`}
            >
              <Ionicons name="list" size={16} style={{ marginRight: 8 }} color="#fff" />
              <Text style={styles.modalButtonText}>Vis i Program</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

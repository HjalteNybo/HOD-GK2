// HOD/Screens/MapScreen.js
import React, { useMemo } from "react";
import { View, ImageBackground, Pressable, Text, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../Styles/GlobalStyles";

const HOTSPOTS = [
  { id: "SCENE", label: "Scene", xPct: 62, yPct: 28, r: 22 },
  { id: "KAFFE", label: "Kaffebod", xPct: 18, yPct: 42, r: 20 },
  { id: "MAD", label: "Madbod", xPct: 75, yPct: 63, r: 22 },
  // tilføj flere boder efter behov
];

export default function MapScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // fast højde/bredde-forhold (tilpas hvis kortet er mere kvadratisk)
  const aspect = 16 / 9;
  const height = width / aspect;

  const hotspots = useMemo(
    () =>
      HOTSPOTS.map((h) => ({
        ...h,
        left: (h.xPct / 100) * width - h.r,
        top: (h.yPct / 100) * height - h.r,
      })),
    [width, height]
  );

  return (
    <View style={[GlobalStyles.screen, { padding: 0, alignItems: "center" }]}>
      <ImageBackground
        source={require("../assets/hod-plads.png")}
        style={{ width, height }}
        resizeMode="cover"
      >
        {hotspots.map((h) => (
          <Pressable
            key={h.id}
            onPress={() => navigation.navigate("Program", { boothId: h.id })}
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
              borderColor: "#fff",
            }}
            accessibilityRole="button"
            accessibilityLabel={`${h.label}. Tryk for at åbne program`}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
              {h.label}
            </Text>
          </Pressable>
        ))}
      </ImageBackground>
    </View>
  );
}

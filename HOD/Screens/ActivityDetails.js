import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, AccessibilityInfo, findNodeHandle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../Styles/ActivityDetailsStyles";
import { Ionicons } from "@expo/vector-icons";

// Skærm med detaljer om en aktivitet i programmet
export default function ActivityDetails({ route, navigation }) {
  const { activity } = route.params || {};
  const { id, title, timeLabel, type, description } = activity || {};

  const titleRef = useRef(null);
  useEffect(() => {
    const tag = findNodeHandle(titleRef.current);
    if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
  }, []);

  return (
    <SafeAreaView style={Styles.container} edges={['top','left','right']}>
      <View style={Styles.headerRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Tilbage"
          accessibilityHint="Går tilbage til forrige skærm"
          style={({ pressed }) => [Styles.backBtn, pressed && Styles.backBtnPressed]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          <Text style={Styles.backText}>Tilbage</Text>
        </Pressable>
      </View>

      <Text
        ref={titleRef}
        style={Styles.title}
        accessibilityRole="header"
      >
        {title || "Aktivitet"}
      </Text>

      <View
        style={Styles.metaCard}
        accessible
        accessibilityLabel={`Tid: ${timeLabel || "Ukendt tid"}. Sted: Se på kortet eller spørg i Info-teltet.`}
      >
        <Text style={Styles.metaLine}>
          Tid: <Text style={Styles.metaStrong}>{timeLabel || "Ukendt tid"}</Text>
        </Text>
        <Text style={Styles.metaHint}>Sted: Se på kortet</Text>
      </View>

      {!!description && (
        <View>
          <Text style={Styles.sectionHeader}>Beskrivelse</Text>
          <Text style={Styles.description}>{description}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [Styles.findButton, pressed && Styles.findButtonPressed]}
        onPress={() => navigation.navigate("Plads", { fromActivityId: id, fromTitle: title, type })}
        accessibilityRole="button"
        accessibilityLabel="Find vej på kortet"
        accessibilityHint="Åbner kortet med placeringen for aktiviteten"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={Styles.findButtonText}>Find vej på kortet</Text>
      </Pressable>
    </SafeAreaView>
  );
}

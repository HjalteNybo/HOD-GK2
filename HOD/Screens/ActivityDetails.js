import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from "../Styles/ActivityDetailsStyles";
import { Ionicons } from "@expo/vector-icons";

export default function ActivityDetails({ route, navigation }) {
  const { activity } = route.params || {};
  const { id, title, timeLabel, type, description } = activity || {};

  return (
    <SafeAreaView style={Styles.container} edges={['top','left','right']}>
      {/* Custom header med tilbage-knap */}
      <View style={Styles.headerRow} accessible accessibilityRole="header">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Tilbage"
          style={({ pressed }) => [Styles.backBtn, pressed && Styles.backBtnPressed]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          <Text style={Styles.backText}>Tilbage</Text>
        </Pressable>
      </View>

      {/* Indhold */}
      <Text style={Styles.title}>{title}</Text>

      <View style={Styles.metaCard}>
        <Text style={Styles.metaLine}>
          Tid: <Text style={Styles.metaStrong}>{timeLabel}</Text>
        </Text>
        <Text style={Styles.metaHint}>Sted: Se på kortet eller spørg i Info-teltet</Text>
      </View>

      {description ? (
        <>
          <Text style={Styles.sectionHeader}>Beskrivelse</Text>
          <Text style={Styles.description}>{description}</Text>
        </>
      ) : null}

      <Pressable
        style={({ pressed }) => [Styles.findButton, pressed && Styles.findButtonPressed]}
        onPress={() => navigation.navigate("Kort", { fromActivityId: id, fromTitle: title, type })}
        accessibilityRole="button"
        accessibilityLabel="Find vej på kortet"
      >
        <Text style={Styles.findButtonText}>Find vej på kortet</Text>
      </Pressable>
    </SafeAreaView>
  );
}
import React from "react";
import { View, Text } from "react-native";
import Styles from "../Styles/EventDetailsStyles";

export default function EventDetails({ route }) {
  const { event } = route.params || {};
  if (!event) {
    return (
      <View style={Styles.container}>
        <Text style={Styles.title}>Ingen eventsdata tilgængelig.</Text>
      </View>
    );
  }

  const title = event.title || "Aktivitet";
  const stage = event.stage || "Ukendt område";
  const time = event.time || "Ukendt tid";
  const description = event.description || "Ingen beskrivelse.";
  const isAccessible = !!event.accessible;

  return (
    <View style={Styles.container}>
      <Text style={Styles.title} accessibilityRole="header">
        {title}
      </Text>

      <Text
        style={Styles.meta}
        accessible
        accessibilityLabel={`Sted: ${stage}. Tid: ${time}.`}
      >
        {stage} • {time}
      </Text>

      <Text style={Styles.sectionTitle}>Om aktiviteten</Text>
      <Text style={Styles.body}>{description}</Text>

      {isAccessible ? (
        <View
          style={Styles.badge}
          accessible
          accessibilityRole="status"
          accessibilityLabel="Tilgængelig aktivitet"
        >
          <Text style={Styles.badgeText}>Tilgængelig</Text>
        </View>
      ) : null}
    </View>
  );
}
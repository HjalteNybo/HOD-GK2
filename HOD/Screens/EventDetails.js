import React from "react";
import { View, Text } from "react-native";
import Styles from "../Styles/EventDetailsStyles";

// Komponent til at vise detaljer for en enkelt aktivitet
export default function EventDetails({ route }) {
    const { event } = route.params || {};
    if (!event) {
        return (
            <View style={Styles.container}>
                <Text style={Styles.title}>Ingen eventsdata tilgængelig.</Text>
            </View>
        );
    };

    return (
        <View style={Styles.container} accessible accessibilityLabel={`Detaljer for ${event.title}`}>
            <Text style={Styles.title}>{event.title}</Text>
            <Text style={Styles.meta}>{event.stage} • {event.time}</Text>
            <Text style={Styles.sectionTitle}>Om aktiviteten</Text>
            <Text style={Styles.body}>{event.description}</Text>

            {event.accessible ? (
                <View style={Styles.badge} accessibilityLabel="Tilgængelig aktivitet">
                    <Text style={Styles.badgeText}>Tilgængelig</Text>
                </View>
            ) : null}

        </View>
    );

};
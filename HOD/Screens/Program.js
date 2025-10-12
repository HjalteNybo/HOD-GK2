import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Styles from "../Styles/ProgramStyles";
import { GlobalStyles } from "../Styles/GlobalStyles";

export default function Program({ navigation: navProp }) {
  // Brug navigation-prop hvis den findes; ellers hook (fallback)
  const navigation = navProp || useNavigation();

  const events = useMemo(
    () => [
      {
        id: "1",
        title: "Åbningstale",
        time: "10:00–10:30",
        stage: "Hovedscenen",
        description:
          "Festivalen åbnes med en velkomsttale og kort programoverblik.",
        accessible: true,
      },
      {
        id: "2",
        title: "Sansesti – guidet tur",
        time: "11:00–11:45",
        stage: "Sanseområdet",
        description:
          "Rolig, guidet tur gennem sansestien med fokus på nærvær og tryghed.",
        accessible: true,
      },
      {
        id: "3",
        title: "Koncert: Drømmebandet",
        time: "19:00–20:00",
        stage: "Hovedscenen",
        description: "Energi og glæde fra festivalens hovednavn.",
        accessible: true,
      },
      {
        id: "4",
        title: "Workshop: Rolig Zone",
        time: "14:30–15:15",
        stage: "Stillezonen",
        description:
          "Skab ro: vejrtrækning, grounding og sansetræning.",
        accessible: true,
      },
    ],
    []
  );

  const openDetails = (item) => {
    navigation.navigate("EventDetails", { event: item });
  };

  return (
    <View style={[GlobalStyles.screen, { paddingTop: 0 }]}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={Styles.divider} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openDetails(item)}
            accessibilityRole="button"
            accessibilityLabel={`Åbn detaljer for ${item.title}`}
          >
            <View style={Styles.row}>
              <Text style={Styles.rowTitle}>{item.title}</Text>
              <Text style={Styles.rowMeta}>
                {item.stage} • {item.time}
              </Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
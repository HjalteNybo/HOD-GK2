import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from "../Styles/ProgramStyles";
import { useRoute } from "@react-navigation/native";

// Funktion der beregner festivaldatoen som falder 4 uger efter første torsdag i august
function getFestivalDate(year) {
  const augustFirst = new Date(year, 7, 1);
  const day = augustFirst.getDay(); // 0=søn ... 4=tors
  const offsetToThursday = (4 - day + 7) % 7;
  const firstThursday = new Date(augustFirst);
  firstThursday.setDate(augustFirst.getDate() + offsetToThursday);
  const potential = new Date(firstThursday);
  potential.setDate(firstThursday.getDate() + 28);
  return (potential.getMonth() === 7)
    ? potential
    : new Date(firstThursday.setDate(firstThursday.getDate() + 21));
}

// Funktion der returnerer et nyt Date-objekt med angivet klokkeslæt på en given dato
function timeOnDate(date, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
}
const pad2 = (x) => String(x).padStart(2, "0");
const fmtHM = (dt) => `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;

// Funktion der tjekker om to datoer ligger på samme kalenderdag
function isSameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Funktion der opretter en tidsplan med aktiviteter for festivaldagen
function buildScheduled(festivalDate) {
  const S = (t) => timeOnDate(festivalDate, t);
  return [
    { id: "a1", title: "Velkomst ved borgerrådet og Henrik", start: S("10:00"), end: S("10:05"), place: "Hovedområde" },
    { id: "a2", title: "Sunshine Band", start: S("10:05"), end: S("10:30"), place: "Scene" },
    { id: "a3", title: "Yoga", start: S("10:30"), end: S("10:50"), place: "Sanseområdet" },
    { id: "a4", title: "Karaoke", start: S("10:50"), end: S("12:00"), place: "Telt A" },
    { id: "a5", title: "Pause", start: S("12:00"), end: S("12:30"), place: "Fællesområde" },
    { id: "a6", title: "DJ Denner", start: S("12:30"), end: S("13:00"), place: "Scene" },
    { id: "a7", title: "Karaoke", start: S("13:00"), end: S("14:00"), place: "Telt A" },
  ];
}
// Data for aktiviteter der varer hele dagen
const allDayActivities = [
  { id: "d1", title: "3-kamp", type: "allDay", description: "Deltag i hyggelig 3-kamp hele dagen." },
  { id: "d2", title: "Klap et dyr (hund, kanin, hest)", type: "allDay", description: "Rolig dyrestund med frivillige." },
  { id: "d3", title: "Prøv VR-briller", type: "allDay", description: "Oplev trygge VR-oplevelser." },
  { id: "d4", title: "Cykeltur", type: "allDay", description: "Guidede små ture ved området." },
  { id: "d5", title: "Lav mad i køkkenet", type: "allDay", description: "Små madaktiviteter for alle." },
  { id: "d6", title: "Håb & Drømme-bod", type: "allDay", description: "Skriv dine håb og drømme – vi hænger dem op." },
];
//
export default function Program({ navigation }) {
  const now = new Date();
  const route = useRoute();
  const boothId = route?.params?.boothId || null;


  const festivalDate = useMemo(() => {
    const thisYear = getFestivalDate(now.getFullYear());
    return thisYear > now ? thisYear : getFestivalDate(now.getFullYear() + 1);
  }, [now]);

  const open = useMemo(() => timeOnDate(festivalDate, "10:00"), [festivalDate]);
  const close = useMemo(() => timeOnDate(festivalDate, "14:00"), [festivalDate]);

  const scheduled = useMemo(() => buildScheduled(festivalDate), [festivalDate]);
  const items = useMemo(
    () => scheduled.slice().sort((a, b) => a.start - b.start),
    [scheduled]
  );

  // Filtrering efter valgt bod/event fra kortet 
  const filteredItems = useMemo(() => {
    if (!boothId) return items;
    // match på place-feltet 
    return items.filter(
      (it) =>
        it.place?.toLowerCase() === boothId.toLowerCase() ||
        it.title?.toLowerCase().includes(boothId.toLowerCase())
    );
  }, [boothId, items]);

// Bestemmer om det er festivaldag, finder næste aktivitet og formaterer dato til læsevenlig tekst
  const isFestivalDay = isSameCalendarDay(now, open);
  const firstUpcoming = isFestivalDay ? items.find((a) => now < a.start) : null;
  const firstUpcomingId = firstUpcoming?.id;

  const niceDate = festivalDate.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Funktion der renderer hver planlagt aktivitet som et trykbart kort med tid, titel og sted
  const renderScheduled = ({ item }) => {
    const isNow = isFestivalDay && now >= item.start && now < item.end;
    const isNext = isFestivalDay && item.id === firstUpcomingId;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('ActivityDetails', {
            activity: {
              id: item.id,
              title: item.title,
              type: 'scheduled',
              timeLabel: `${fmtHM(item.start)}–${fmtHM(item.end)}`,          // string
              place: item.place,  // string
              description: '',    // valgfrit felt, hold det som string
            },
          })
        }
        style={({ pressed }) => [Styles.card, pressed && Styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} ${fmtHM(item.start)}–${fmtHM(item.end)}. Åbn detaljer.`}
      >
        <View style={Styles.cardRowTop}>
          <Text style={Styles.time}>{fmtHM(item.start)}–{fmtHM(item.end)}</Text>
          {isNow && <Text style={[Styles.badge, Styles.badgeNow]}>NU</Text>}
          {!isNow && isNext && <Text style={[Styles.badge, Styles.badgeNext]}>NÆSTE</Text>}
        </View>
        <Text style={Styles.title}>{item.title}</Text>
        <Text style={Styles.place}>{item.place}</Text>
      </Pressable>
    );
  };

  // Funktion der renderer aktiviteter, som varer hele dagen, som trykbare kort med titel og label
  const renderAllDay = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate('ActivityDetails', {
          activity: {
            id: item.id,
            title: item.title,
            type: 'allDay',
            timeLabel: 'Hele dagen', // <- string
            description: item.description || '',
          },
        })
      }
      style={({ pressed }) => [Styles.miniCard, pressed && Styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. Hele dagen. Åbn detaljer og find vej.`}
    >
      <Text style={Styles.miniTitle}>{item.title}</Text>
      <View style={Styles.miniMetaRow}>
        <Text style={Styles.miniTime}>Hele dagen</Text>
        <Text style={[Styles.badgeChip, Styles.badgeAllDay]}>ALL DAY</Text>
      </View>
    </Pressable>
  );

  // Returnerer hovedlayoutet for programskærmen med overskrift, tidsplan og heldagsaktiviteter
  return (
    <SafeAreaView style={Styles.container} edges={['top', 'left', 'right']}>
      <View style={Styles.container}>
        {/* Header */}
        <View style={Styles.header}>
          <Text style={Styles.pageTitle}>Dagens program</Text>
          <Text style={Styles.sub}>
            {niceDate} • Åbent {fmtHM(open)}–{fmtHM(close)}
          </Text>
        </View>

        {/* Tidsplan */}
        <Text style={Styles.sectionHeader}>Tidsplan</Text>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderScheduled}
          contentContainerStyle={{ paddingBottom: 12 }}
        />

        {/* All day section */}
        <View style={Styles.allDayHeaderRow}>
          <Text style={Styles.sectionHeader}>Aktiviteter hele dagen</Text>
          <Text style={Styles.allDayPill}>Hele dagen</Text>
        </View>
        <FlatList
          data={allDayActivities}
          keyExtractor={(it) => it.id}
          renderItem={renderAllDay}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}
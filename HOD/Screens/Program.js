import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../Styles/ProgramStyles";
import { useRoute } from "@react-navigation/native";

// Festivaldato = 4 uger efter første torsdag i august
function getFestivalDate(year) {
  const augustFirst = new Date(year, 7, 1);
  const day = augustFirst.getDay(); 
  const offsetToThursday = (4 - day + 7) % 7;
  const firstThursday = new Date(augustFirst);
  firstThursday.setDate(augustFirst.getDate() + offsetToThursday);
  const potential = new Date(firstThursday);
  potential.setDate(firstThursday.getDate() + 28);
  return potential.getMonth() === 7
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

// Tjekker om to datoer er på samme kalenderdag
function isSameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

//tidsplan for HOD (taget som eksempel, kan ændres senere)
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
//Aktiviteter for HOD
const allDayActivities = [
  { id: "d1", title: "3-kamp", type: "allDay", description: "Deltag i hyggelig 3-kamp hele dagen." },
  { id: "d2", title: "Klap et dyr (hund, kanin, hest)", type: "allDay", description: "Rolig dyrestund med frivillige." },
  { id: "d3", title: "Prøv VR-briller", type: "allDay", description: "Oplev trygge VR-oplevelser." },
  { id: "d4", title: "Cykeltur", type: "allDay", description: "Guidede små ture ved området." },
  { id: "d5", title: "Lav mad i køkkenet", type: "allDay", description: "Små madaktiviteter for alle." },
  { id: "d6", title: "Håb & Drømme-bod", type: "allDay", description: "Skriv dine håb og drømme – vi hænger dem op." },
];

// Hovedkomponent for program-skærmen
export default function Program({ navigation }) {
  const now = new Date();
  const route = useRoute();
  const boothId = route?.params?.boothId || null;

  const [tab, setTab] = useState("schedule"); 

  const festivalDate = useMemo(() => {
    const thisYear = getFestivalDate(now.getFullYear());
    return thisYear > now ? thisYear : getFestivalDate(now.getFullYear() + 1);
  }, [now]);

  const open = useMemo(() => timeOnDate(festivalDate, "10:00"), [festivalDate]);
  const close = useMemo(() => timeOnDate(festivalDate, "14:00"), [festivalDate]);

  const scheduled = useMemo(() => buildScheduled(festivalDate), [festivalDate]);
  const items = useMemo(() => scheduled.slice().sort((a, b) => a.start - b.start), [scheduled]);

  const filteredItems = useMemo(() => {
    if (!boothId) return items;
    return items.filter(
      (it) =>
        it.place?.toLowerCase() === boothId.toLowerCase() ||
        it.title?.toLowerCase().includes(boothId.toLowerCase())
    );
  }, [boothId, items]);

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
          navigation.navigate("ActivityDetails", {
            activity: {
              id: item.id,
              title: item.title,
              type: "scheduled",
              timeLabel: `${fmtHM(item.start)}–${fmtHM(item.end)}`,
              place: item.place,
              description: "",
            },
          })
        }
        style={({ pressed }) => [Styles.card, pressed && Styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} ${fmtHM(item.start)}–${fmtHM(item.end)}. Åbn detaljer.`}
      >
        <View style={Styles.cardRowTop}>
          <Text style={Styles.time}>
            {fmtHM(item.start)}–{fmtHM(item.end)}
          </Text>
          {isNow && <Text style={[Styles.badge, Styles.badgeNow]}>NU</Text>}
          {!isNow && isNext && <Text style={[Styles.badge, Styles.badgeNext]}>NÆSTE</Text>}
        </View>
        <Text style={Styles.title}>{item.title}</Text>
        <Text style={Styles.place}>{item.place}</Text>
      </Pressable>
    );
  };

  const renderAllDay = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("ActivityDetails", {
          activity: {
            id: item.id,
            title: item.title,
            type: "allDay",
            timeLabel: "Hele dagen",
            description: item.description || "",
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
        <Text style={[Styles.badgeChip, Styles.badgeAllDay]}>HELE DAGEN</Text>
      </View>
    </Pressable>
  );

  const Empty = ({ label }) => (
    <View style={Styles.emptyWrap} accessible accessibilityLabel="Ingen aktiviteter fundet">
      <Text style={Styles.emptyTitle}>Ingen {label}</Text>
      <Text style={Styles.emptySub}>Prøv at fjerne filtre eller kig forbi Info-teltet.</Text>
    </View>
  );

  return (
    <SafeAreaView style={Styles.container} edges={["top", "left", "right"]}>
      <View style={Styles.container}>
        <View style={Styles.header}>
          <Text style={Styles.pageTitle}>Dagens program</Text>
          <Text style={Styles.sub}>
            {niceDate} • Åbent {fmtHM(open)}–{fmtHM(close)}
          </Text>
        </View>

        <View style={Styles.segmented} accessibilityRole="tablist">
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "schedule" }}
            onPress={() => setTab("schedule")}
            style={[Styles.segmentBtn, tab === "schedule" && Styles.segmentBtnActive]}
          >
            <Text style={[Styles.segmentLabel, tab === "schedule" && Styles.segmentLabelActive]}>
              Tidsplan
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "allday" }}
            onPress={() => setTab("allday")}
            style={[Styles.segmentBtn, tab === "allday" && Styles.segmentBtnActive]}
          >
            <Text style={[Styles.segmentLabel, tab === "allday" && Styles.segmentLabelActive]}>
              Aktiviteter hele dagen
            </Text>
          </Pressable>
        </View>

        <View style={Styles.contentWrap}>
          {tab === "schedule" ? (
            <FlatList
              data={filteredItems}
              keyExtractor={(it) => it.id}
              renderItem={renderScheduled}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={<Empty label="planlagte aktiviteter" />}
              accessibilityLabel="Liste over planlagte aktiviteter"
            />
          ) : (
            <FlatList
              data={allDayActivities}
              keyExtractor={(it) => it.id}
              renderItem={renderAllDay}
              contentContainerStyle={{ paddingBottom: 24 }}
              ListEmptyComponent={<Empty label="heldagsaktiviteter" />}
              accessibilityLabel="Liste over heldagsaktiviteter"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
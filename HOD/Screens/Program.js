import React, { useMemo, useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../Styles/ProgramStyles";
import { useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

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

function timeOnDate(date, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
}
const pad2 = (x) => String(x).padStart(2, "0");
const fmtHM = (dt) => `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;

function isSameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// eksempelprogram (kan ændres)
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

const allDayActivities = [
  { id: "d1", title: "3-kamp", type: "allDay", description: "Deltag i hyggelig 3-kamp hele dagen." },
  { id: "d2", title: "Klap et dyr (hund, kanin, hest)", type: "allDay", description: "Rolig dyrestund med frivillige." },
  { id: "d3", title: "Prøv VR-briller", type: "allDay", description: "Oplev trygge VR-oplevelser." },
  { id: "d4", title: "Cykeltur", type: "allDay", description: "Guidede små ture ved området." },
  { id: "d5", title: "Lav mad i køkkenet", type: "allDay", description: "Små madaktiviteter for alle." },
  { id: "d6", title: "Håb & Drømme-bod", type: "allDay", description: "Skriv dine håb og drømme – vi hænger dem op." },
];

// --- Notifikationer (throttle så vi ikke spammer) ---
const PROGRAM_UPDATE_KEY = "program:lastChangeId";
const PROGRAM_NOTIFY_THROTTLE_KEY = "program:lastNotifiedAtMs";
const THROTTLE_MINUTES = 10;

async function ensureNotifPermissionAndChannel() {
  try {
    const existing = await Notifications.getPermissionsAsync();
    let granted =
      existing.granted ||
      (existing.ios && existing.ios.status === Notifications.IosAuthorizationStatus.AUTHORIZED);

    if (!granted) {
      const req = await Notifications.requestPermissionsAsync();
      granted =
        req.granted ||
        (req.ios && req.ios.status === Notifications.IosAuthorizationStatus.AUTHORIZED);
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("program-updates", {
        name: "Programopdateringer",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    return granted;
  } catch {
    return false;
  }
}

async function throttled() {
  const now = Date.now();
  const raw = await AsyncStorage.getItem(PROGRAM_NOTIFY_THROTTLE_KEY);
  const last = raw ? parseInt(raw, 10) : 0;
  const diffMin = (now - last) / 60000;
  if (diffMin < THROTTLE_MINUTES) return true;
  await AsyncStorage.setItem(PROGRAM_NOTIFY_THROTTLE_KEY, String(now));
  return false;
}

export default function Program({ navigation }) {
  const now = new Date();
  const route = useRoute();
  const boothId = (route && route.params && route.params.boothId) ? route.params.boothId : null;

  const [tab, setTab] = useState("schedule");
  const db = getFirestore();

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
    const key = String(boothId).toLowerCase();
    return items.filter(
      (it) =>
        (it.place && it.place.toLowerCase() === key) ||
        (it.title && it.title.toLowerCase().includes(key))
    );
  }, [boothId, items]);

  const isFestivalDay = isSameCalendarDay(now, open);
  const firstUpcoming = isFestivalDay ? items.find((a) => now < a.start) : null;
  const firstUpcomingId = firstUpcoming ? firstUpcoming.id : null;

  const niceDate = festivalDate.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Lyt efter seneste program-ændring og vis én lokal notifikation
  useEffect(() => {
    const qRef = query(
      collection(db, "programChanges"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(qRef, async (snap) => {
      try {
        const doc = snap.docs[0];
        if (!doc) return;

        const lastId = await AsyncStorage.getItem(PROGRAM_UPDATE_KEY);
        if (lastId === doc.id) return;

        await AsyncStorage.setItem(PROGRAM_UPDATE_KEY, doc.id);
        if (await throttled()) return;

        const ok = await ensureNotifPermissionAndChannel();
        if (!ok) return;

        const data = doc.data() || {};
        const body = data.text ? String(data.text).slice(0, 140) : "Tjek dagens program i appen.";

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Program opdateret",
            body,
            data: { type: "program_updated", changeId: doc.id },
          },
          trigger: null,
        });
      } catch {
        // ignorer i dev
      }
    });
    return () => unsub();
  }, [db]);

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
        accessibilityLabel={`${item.title}. ${fmtHM(item.start)}–${fmtHM(item.end)}. ${item.place}.`}
        accessibilityHint="Åbner detaljer om aktiviteten"
        hitSlop={8}
      >
        <View style={Styles.cardRowTop}>
          <Text style={Styles.time}>
            {fmtHM(item.start)}–{fmtHM(item.end)}
          </Text>
          {isNow ? (
            <Text style={[Styles.badge, Styles.badgeNow]}>NU</Text>
          ) : isNext ? (
            <Text style={[Styles.badge, Styles.badgeNext]}>NÆSTE</Text>
          ) : null}
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
      accessibilityLabel={`${item.title}. Hele dagen.`}
      accessibilityHint="Åbner detaljer og find vej"
      hitSlop={8}
    >
      <Text style={Styles.miniTitle}>{item.title}</Text>
      <View style={Styles.miniMetaRow}>
        <Text style={Styles.miniTime}>Hele dagen</Text>
        <Text style={[Styles.badgeChip, Styles.badgeAllDay]}>HELE DAGEN</Text>
      </View>
    </Pressable>
  );

  const Empty = ({ label }) => (
    <View
      style={Styles.emptyWrap}
      accessibilityRole="status"
      accessibilityLabel={`Ingen ${label}`}
    >
      <Text style={Styles.emptyTitle}>Ingen {label}</Text>
      <Text style={Styles.emptySub}>Prøv at fjerne filtre eller kig forbi Info-teltet.</Text>
    </View>
  );

  const listCount =
    tab === "schedule" ? filteredItems.length : allDayActivities.length;

  return (
    <SafeAreaView style={Styles.container} edges={["top", "left", "right"]}>
      <View style={Styles.container}>
        <View style={Styles.header}>
          <Text style={Styles.pageTitle} accessibilityRole="header">
            Dagens program
          </Text>
          <Text style={Styles.sub}>
            {niceDate} • Åbent {fmtHM(open)}–{fmtHM(close)}
          </Text>
        </View>

        <View style={Styles.segmented} accessibilityRole="tablist">
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "schedule" }}
            accessibilityLabel="Tidsplan"
            accessibilityHint="Viser planlagte aktiviteter i tidsrækkefølge"
            onPress={() => setTab("schedule")}
            style={[Styles.segmentBtn, tab === "schedule" && Styles.segmentBtnActive]}
            hitSlop={8}
          >
            <Text style={[Styles.segmentLabel, tab === "schedule" && Styles.segmentLabelActive]}>
              Tidsplan
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "allday" }}
            accessibilityLabel="Aktiviteter hele dagen"
            accessibilityHint="Viser aktiviteter, der kører hele dagen"
            onPress={() => setTab("allday")}
            style={[Styles.segmentBtn, tab === "allday" && Styles.segmentBtnActive]}
            hitSlop={8}
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
              accessibilityRole="list"
              accessibilityLabel={`Liste over planlagte aktiviteter. ${listCount} elementer.`}
            />
          ) : (
            <FlatList
              data={allDayActivities}
              keyExtractor={(it) => it.id}
              renderItem={renderAllDay}
              contentContainerStyle={{ paddingBottom: 24 }}
              ListEmptyComponent={<Empty label="heldagsaktiviteter" />}
              accessibilityRole="list"
              accessibilityLabel={`Liste over heldagsaktiviteter. ${listCount} elementer.`}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

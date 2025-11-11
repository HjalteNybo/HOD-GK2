import React, { useMemo, useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../Styles/ProgramStyles";
import { useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, query, where, orderBy, onSnapshot, limit, } from "firebase/firestore";


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

// -------- Notifikations-hjælpere (program-opdateret) --------
const PROGRAM_UPDATE_KEY = "program:lastChangeId";
const PROGRAM_NOTIFY_THROTTLE_KEY = "program:lastNotifiedAtMs";
const THROTTLE_MINUTES = 10; // undgå spam – justér efter behov

async function ensureNotifPermissionAndChannel() {
  const existing = await Notifications.getPermissionsAsync();
  let granted =
    existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted || req.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("program-updates", {
      name: "Programopdateringer",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return granted;
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

// Hovedkomponent for program-skærmen
export default function Program({ navigation }) {
  const now = new Date();
  const route = useRoute();
  const boothId = route?.params?.boothId || null;

  const [tab, setTab] = useState("schedule"); 
  const db = getFirestore();

  const festivalDate = useMemo(() => {
    const thisYear = getFestivalDate(now.getFullYear());
    return thisYear > now ? thisYear : getFestivalDate(now.getFullYear() + 1);
  }, [now]);

  const open = useMemo(() => timeOnDate(festivalDate, "10:00"), [festivalDate]);
  const close = useMemo(() => timeOnDate(festivalDate, "14:00"), [festivalDate]);

  const dayStart = useMemo(
    () => new Date(festivalDate.getFullYear(), festivalDate.getMonth(), festivalDate.getDate(), 0, 0, 0),
    [festivalDate]
  );
  const nextDayStart = useMemo(
    () => new Date(festivalDate.getFullYear(), festivalDate.getMonth(), festivalDate.getDate() + 1, 0, 0, 0),
    [festivalDate]
  );
  const dayKey = useMemo(() => {
    const y = festivalDate.getFullYear();
    const m = String(festivalDate.getMonth() + 1).padStart(2, "0");
    const d = String(festivalDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [festivalDate]);

  const [events, setEvents] = useState([]); // tidsbestemte punkter
  const [allDay, setAllDay] = useState([]); // heldagsaktiviteter
  
     // Hent dagens tidsbestemte events
  useEffect(() => {
    const db = getFirestore();
    const q = query(
      collection(db, "events"),
      where("start", ">=", dayStart),
      where("start", "<", nextDayStart),
      orderBy("start", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEvents(list);
      },
      (err) => console.warn("events listen error:", err)
    );
    return unsub;
  }, [dayStart, nextDayStart]);

  // Hent dagens heldagsaktiviteter
  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "allday"), where("dayKey", "==", dayKey));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        setAllDay(list);
      },
      (err) => console.warn("allday listen error:", err)
    );
    return unsub;
  }, [dayKey]);

    const items = events; // allerede sorteret i query
  const filteredItems = useMemo(() => {
    if (!boothId) return items;
    return items.filter(
      (it) =>
        it.place?.toLowerCase() === boothId.toLowerCase() ||
        it.title?.toLowerCase().includes(boothId.toLowerCase())
    );
  }, [boothId, items]);

    const isFestivalDay = isSameCalendarDay(now, open);
  const firstUpcoming = isFestivalDay
    ? items.find((a) => {
        const s = a.start?.toDate ? a.start.toDate() : new Date(a.start);
        return now < s;
      })
    : null;
  const firstUpcomingId = firstUpcoming?.id;

  const niceDate = festivalDate.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // --- Lyt efter admin-ændringer i programmet og vis én notifikation ---
  useEffect(() => {
    const q = query(
      collection(db, "programChanges"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsub = onSnapshot(q, async (snap) => {
      const doc = snap.docs[0];
      if (!doc) return;

      const lastId = await AsyncStorage.getItem(PROGRAM_UPDATE_KEY);
      if (lastId === doc.id) return; // samme ændring som sidst → ignorér

      // gem nyeste id så vi ikke duplikerer
      await AsyncStorage.setItem(PROGRAM_UPDATE_KEY, doc.id);

      // undgå spam
      if (await throttled()) return;

      // tilladelse + kanal
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
        trigger: null, // vis nu
      });
    });

    return () => unsub();
  }, [db]);

  // Funktion der renderer hver planlagt aktivitet som et trykbart kort med tid, titel og sted
  const renderScheduled = ({ item }) => {
    const start = item.start?.toDate ? item.start.toDate() : new Date(item.start);
    const end = item.end?.toDate ? item.end.toDate() : new Date(item.end);
    const isNow = isFestivalDay && now >= start && now < end;
    const isNext = isFestivalDay && item.id === firstUpcomingId;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ActivityDetails", {
            activity: {
              id: item.id,
              title: item.title,
              type: "scheduled",
              timeLabel: `${fmtHM(start)}–${fmtHM(end)}`,
              place: item.place,
              description: item.description || "",
            },
          })
        }
        style={({ pressed }) => [Styles.card, pressed && Styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} ${fmtHM(start)}–${fmtHM(end)}. Åbn detaljer.`}
      >
        <View style={Styles.cardRowTop}>
          <Text style={Styles.time}>
            {fmtHM(start)}–{fmtHM(end)}
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
              data={allDay}
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
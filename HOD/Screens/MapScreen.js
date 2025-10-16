// HOD/Screens/MapScreen.js
import React, { useMemo } from "react";
import {
  View,
  ImageBackground,
  Pressable,
  Text,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../Styles/GlobalStyles";

/* ===================== Helpers (samme logik som i Program) ===================== */
function getFestivalDate(year) {
  const augustFirst = new Date(year, 7, 1);
  const day = augustFirst.getDay(); // 0=søn ... 4=tors
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

function buildScheduled(festivalDate) {
  const S = (t) => timeOnDate(festivalDate, t);
  return [
    { id: "a1", title: "Velkomst ved borgerrådet og Henrik", start: S("10:00"), end: S("10:05"), place: "Hovedområde" },
    { id: "a2", title: "Sunshine Band",                       start: S("10:05"), end: S("10:30"), place: "Sunshine Band" },
    { id: "a3", title: "Yoga",                                 start: S("10:30"), end: S("10:50"), place: "Sanseområdet" },
    { id: "a4", title: "Karaoke",                              start: S("10:50"), end: S("12:00"), place: "Karaoke" },
    { id: "a5", title: "Pause",                                start: S("12:00"), end: S("12:30"), place: "Fællesområde" },
    { id: "a6", title: "DJ Denner",                            start: S("12:30"), end: S("13:00"), place: "Scene" },
    { id: "a7", title: "Karaoke",                              start: S("13:00"), end: S("14:00"), place: "Telt A" },
  ];
}

/* ===================== Pladsens hotspots (procentkoordinater) ===================== */
/* Justér xPct/yPct/r så de passer til jeres billede */
const PLACE_MAP = {
  Hovedområde:  { xPct: 50, yPct: 18, r: 22, label: "Hovedområde" },
  Scene:        { xPct: 62, yPct: 28, r: 22, label: "Scene" },
  Sanseområdet: { xPct: 30, yPct: 45, r: 22, label: "Sanseområdet" },
  "Telt A":     { xPct: 40, yPct: 60, r: 22, label: "Telt A" },
  Fællesområde: { xPct: 55, yPct: 70, r: 22, label: "Fællesområde" },
};

/* ===================== Hjælp til nested navigation ===================== */
/* Finder navnet på tab’en som indeholder ProgramStack (fx 'Program' eller 'ProgramTab') */
function resolveProgramTabName(navigation) {
  try {
    const state = navigation.getState?.();
    const names = Array.isArray(state?.routes) ? state.routes.map((r) => r.name) : [];
    if (names.includes("Program")) return "Program";
    if (names.includes("ProgramTab")) return "ProgramTab";
  } catch {}
  // Fallback – mest sandsynligt i din kodebase er 'Program'
  return "Program";
}

/* ===================== Komponent ===================== */
export default function MapScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const aspect = 16 / 9;           // dit billede er bredt; justér hvis nødvendigt
  const height = width / aspect;

  const now = new Date();
  const festivalDate = useMemo(() => {
    const thisYear = getFestivalDate(now.getFullYear());
    return thisYear > now ? thisYear : getFestivalDate(now.getFullYear() + 1);
  }, [now]);

  const scheduled = useMemo(
    () => buildScheduled(festivalDate).slice().sort((a, b) => a.start - b.start),
    [festivalDate]
  );

  const hotspots = useMemo(() => {
    return Object.entries(PLACE_MAP).map(([place, cfg]) => {
      const { xPct, yPct, r, label } = cfg;
      const left = (xPct / 100) * width - r;
      const top = (yPct / 100) * height - r;
      return { place, label, r, left, top };
    });
  }, [width, height]);

  function openNextActivityAt(place) {
    const atPlace = scheduled.filter((a) => a.place === place);
    if (atPlace.length === 0) {
      Alert.alert(place, "Ingen planlagte aktiviteter på dette sted.");
      return;
    }
    const upcoming = atPlace.find((a) => now < a.start) || atPlace[0];

    const activity = {
      id: upcoming.id,
      title: upcoming.title,
      type: "scheduled",
      timeLabel: `${fmtHM(upcoming.start)}–${fmtHM(upcoming.end)}`,
      place: upcoming.place,
      description: "",
    };

    const programTab = resolveProgramTabName(navigation);

    // Navigér ind i Program-tabben og videre til ActivityDetails i dens stack
    navigation.navigate(programTab, {
      screen: "ActivityDetails",
      params: { activity },
    });
  }

  return (
    <View style={[GlobalStyles.screen, { padding: 0, alignItems: "center" }]}>
      <ImageBackground
        source={require("../assets/hod-plads.png")}
        style={{ width, height }}
        resizeMode="cover"
      >
        {hotspots.map((h) => (
          <Pressable
            key={h.place}
            onPress={() => openNextActivityAt(h.place)}
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
            accessibilityLabel={`${h.label}. Tryk for at åbne næste aktivitet`}
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

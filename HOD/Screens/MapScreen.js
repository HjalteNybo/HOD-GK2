import React, { useMemo } from "react";
import {
  View,
  ImageBackground,
  Pressable,
  Text,
  useWindowDimensions,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../Styles/MapScreenStyles";
import { colors } from "../Styles/GlobalStyles";

/* midlertidige ikoner */
const ICON_SCENE = require("../assets/adaptive-icon.png");
const ICON_SANSE = require("../assets/adaptive-icon.png");
const ICON_TELT  = require("../assets/adaptive-icon.png");
const ICON_HOVED = require("../assets/adaptive-icon.png");
const ICON_FAE   = require("../assets/adaptive-icon.png");

/* helper-funktioner */
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

const PLACE_MAP = {
  Hovedområde:   { xPct: 50, yPct: 18, r: 22, label: "Hovedområde",   icon: ICON_HOVED },
  Scene:         { xPct: 62, yPct: 28, r: 22, label: "Scene",         icon: ICON_SCENE },
  Sanseområdet:  { xPct: 30, yPct: 45, r: 22, label: "Sanseområdet",  icon: ICON_SANSE },
  "Telt A":      { xPct: 40, yPct: 60, r: 22, label: "Telt A",        icon: ICON_TELT },
  Fællesområde:  { xPct: 55, yPct: 70, r: 22, label: "Fællesområde",  icon: ICON_FAE },
};

function resolveProgramTabName(navigation) {
  try {
    const state = navigation.getState?.();
    const names = Array.isArray(state?.routes) ? state.routes.map((r) => r.name) : [];
    if (names.includes("Program")) return "Program";
    if (names.includes("ProgramTab")) return "ProgramTab";
  } catch {}
  return "Program";
}

export default function MapScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const aspect = 16 / 9;
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
      const { xPct, yPct, r, label, icon } = cfg;
      const left = (xPct / 100) * width - r;
      const top  = (yPct / 100) * height - r;
      return { place, label, icon, r, left, top };
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
    navigation.navigate(programTab, {
      screen: "ActivityDetails",
      params: { activity },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <View style={styles.topBar}>
          <Text style={styles.title}>HOD Kort</Text>
          <Text style={styles.subtitle}>Tryk på et område for at se næste aktivitet</Text>
        </View>

        <ImageBackground
          source={require("../assets/hod-plads.png")}
          style={[styles.backgroundImage, { width, height }]}
        >
          {hotspots.map((h) => (
            <Pressable
              key={h.place}
              onPress={() => openNextActivityAt(h.place)}
              style={[
                styles.hallButton,
                { left: h.left, top: h.top, width: h.r * 2, height: h.r * 2 },
              ]}
            >
              {/* Grøn ydre ring */}
              <View
                style={[
                  styles.hallOuterRing,
                  { width: h.r * 2, height: h.r * 2, borderRadius: h.r },
                ]}
              >
                {/* Ikon */}
                <View
                  style={[
                    styles.hallIconWrap,
                    {
                      width: h.r * 1.4,
                      height: h.r * 1.4,
                      borderRadius: (h.r * 1.4) / 2,
                    },
                  ]}
                >
                  <Image
                    source={h.icon}
                    style={{ width: "80%", height: "80%", borderRadius: 999 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </Pressable>
          ))}
        </ImageBackground>
      </View>

      <View style={styles.legendBelowCard}>
        <Text style={styles.legendTitle}>Farver og symboler</Text>

        <View style={styles.legendRow}>
          <Image source={ICON_SCENE} style={styles.legendRowIcon} />
          <Text style={styles.legendText}>Scene-logo er hovedscenen</Text>
        </View>
        <View style={styles.legendRow}>
          <Image source={ICON_SANSE} style={styles.legendRowIcon} />
          <Text style={styles.legendText}>Sanse-logo markerer sanseområdet</Text>
        </View>
        <View style={styles.legendRow}>
          <Image source={ICON_TELT} style={styles.legendRowIcon} />
          <Text style={styles.legendText}>Telt-logo markerer telte (fx “Telt A”)</Text>
        </View>
        <View style={styles.legendRow}>
          <Image source={ICON_HOVED} style={styles.legendRowIcon} />
          <Text style={styles.legendText}>Hovedområde-logo markerer hovedområdet</Text>
        </View>
        <View style={styles.legendRow}>
          <Image source={ICON_FAE} style={styles.legendRowIcon} />
          <Text style={styles.legendText}>Fællesområde-logo markerer fællesarealet</Text>
        </View>
      </View>
    </View>
  );
}

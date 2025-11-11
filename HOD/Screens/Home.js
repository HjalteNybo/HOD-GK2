import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, AccessibilityInfo, Pressable, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../Styles/HomeStyles';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';


//finder datoen for “sidste torsdag i august” i et givent år
function getFestivalDate(year) {
  const augustFirst = new Date(year, 7, 1); 
  const day = augustFirst.getDay(); 
  const offsetToThursday = (4 - day + 7) % 7;
  const firstThursday = new Date(augustFirst);
  firstThursday.setDate(augustFirst.getDate() + offsetToThursday);

  const potential = new Date(firstThursday);
  potential.setDate(firstThursday.getDate() + 28);
  return (potential.getMonth() === 7)
    ? potential
    : new Date(firstThursday.setDate(firstThursday.getDate() + 21));
}

//returnerer en Date på samme kalenderdag som `date`, men med klokkeslæt HH:MM
function timeOnDate(date, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
}

//padder et tal til to cifre (fx 7 → "07")
function pad2(x) { return String(x).padStart(2, '0'); }
// Formatterer en Date som "HH:MM"
function fmtHM(dt) { return `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`; }

// Returnerer om vi er før dagen, på dagen (mellem åbne/luk) eller efter dagen
function getDayState(now, festStart, festEnd) {
  const ymd = (d) => [d.getFullYear(), d.getMonth(), d.getDate()].join('-');
  const todayKey = ymd(now), festKey = ymd(festStart);
  const sameCalendarDay = todayKey === festKey;
  return {
    isBeforeDay: now < festStart && !sameCalendarDay,
    isFestivalDay: sameCalendarDay && now < festEnd && now >= festStart,
    isAfterDay: (sameCalendarDay && now >= festEnd) || todayKey > festKey
  };
}


// Kontakt (midlertidige numre)
const SIGNUP_PHONE = '88888888';
const SIGNUP_EMAIL = 'info@haabogdroemme.dk';
const CONTACTS = [
  { name: 'Anna', phone: '88888888' },
  { name: 'Jonas', phone: '88888888' },
  { name: 'Info-teltet', phone: '88888888' },
];

export default function Home({ navigation }) {
  // Find næste festivaldato dynamisk
  const festivalDate = useMemo(() => {
    const today = new Date();
    const thisYear = getFestivalDate(today.getFullYear());
    return (thisYear > today) ? thisYear : getFestivalDate(today.getFullYear() + 1);
  }, []);

  // Åbning/luk tider
  const festivalOpen = useMemo(() => timeOnDate(festivalDate, '10:00'), [festivalDate]);
  const festivalClose = useMemo(() => timeOnDate(festivalDate, '14:00'), [festivalDate]);

  //program med konkrete datoer
const toDate = (t) => (t?.toDate ? t.toDate() : new Date(t));

const dayStart = useMemo(
  () => new Date(festivalDate.getFullYear(), festivalDate.getMonth(), festivalDate.getDate(), 0, 0, 0),
  [festivalDate]
);
const nextDayStart = useMemo(
  () => new Date(festivalDate.getFullYear(), festivalDate.getMonth(), festivalDate.getDate() + 1, 0, 0, 0),
  [festivalDate]
);

const [events, setEvents] = useState([]);

useEffect(() => {
  const db = getFirestore();
  const q = query(
    collection(db, 'events'),
    where('start', '>=', dayStart),
    where('start', '<', nextDayStart),
    orderBy('start', 'asc')
  );
  const unsub = onSnapshot(q, (snap) => {
    setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (err) => console.warn('events listen error:', err));
  return unsub;
}, [dayStart, nextDayStart]);

  //udregner tid der er tilbage til åbningstid (bruges af nedtællingen)
  const getTimeLeft = () => {
    const now = new Date();
    const diff = festivalOpen.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, done: false };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [now, setNow] = useState(new Date());

  // Ticker der opdaterer nedtælling og “nu” hvert sekund
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft());
      setNow(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, [festivalOpen]);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility?.('Nedtælling til Håb & Drømme Festivalen.');
  }, []);

  //tjekker om vi er før/under/efter festivaldagen ud fra nuværende tid
  const { isBeforeDay, isFestivalDay } = getDayState(now, festivalOpen, festivalClose);

  //finder igangværende aktivitet eller næste aktivitet i dag
  let nowOrNext = null;
if (isFestivalDay && events.length) {
  const current = events.find(a => now >= toDate(a.start) && now < toDate(a.end));
  if (current) {
    nowOrNext = { mode: 'now', item: current };
  } else {
    const upcoming = events.find(a => now < toDate(a.start));
    if (upcoming) nowOrNext = { mode: 'next', item: upcoming };
  }
}
  //læsevenlig dato-tekst
  const niceDate = festivalDate.toLocaleDateString('da-DK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    const db = getFirestore(); // bruger default app (du har den allerede igang til storage)
    // Vis kun aktive ændringer, nyeste først
    const q = query(
      collection(db, 'programChanges'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setChanges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  //header, nedtælling/“i dag”, ændringer, beskrivelse, genveje og kontakt
  return (
    <SafeAreaView style={Styles.container} edges={['top']}>
    <ScrollView
      style={Styles.container}
      contentContainerStyle={Styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={Styles.header}>
        <Text style={Styles.title}>Håb & Drømme Festival</Text>
        <View style={Styles.accentBar} />
      </View>

      <Text style={Styles.dateText}>
        Sidste torsdag i august — {niceDate}
      </Text>

      {isBeforeDay && (
        <>
          <Text style={Styles.countdownIntro}>Vi ses om</Text>
          <View style={Styles.countdownCard} accessible accessibilityRole="timer" accessibilityLabel="Nedtælling til festivalstart">
            <View style={Styles.countdownRow}>
              <View style={Styles.timeBlock}>
                <Text style={Styles.timeNumber}>{timeLeft.days}</Text>
                <Text style={Styles.timeLabel}>Dage</Text>
              </View>
              <View style={Styles.timeBlock}>
                <Text style={Styles.timeNumber}>{timeLeft.hours}</Text>
                <Text style={Styles.timeLabel}>Timer</Text>
              </View>
              <View style={Styles.timeBlock}>
                <Text style={Styles.timeNumber}>{timeLeft.minutes}</Text>
                <Text style={Styles.timeLabel}>Min</Text>
              </View>
              <View style={Styles.timeBlock}>
                <Text style={Styles.timeNumber}>{timeLeft.seconds}</Text>
                <Text style={Styles.timeLabel}>Sek</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {isFestivalDay && (
  <View style={Styles.todayCard}>
    <Text style={Styles.todayHeader}>
      Velkommen! Festivalen er åben kl. {fmtHM(festivalOpen)}–{fmtHM(festivalClose)}
    </Text>

    {nowOrNext ? (
      nowOrNext.mode === 'now' ? (
        <Text style={Styles.todayLine}>
          <Text style={Styles.todayStrong}>Nu: </Text>
          {nowOrNext.item.title} • slutter {fmtHM(toDate(nowOrNext.item.end))}
        </Text>
      ) : (
        <Text style={Styles.todayLine}>
          <Text style={Styles.todayStrong}>Næste: </Text>
          {nowOrNext.item.title} {fmtHM(toDate(nowOrNext.item.start))}–{fmtHM(toDate(nowOrNext.item.end))}
        </Text>
      )
    ) : (
      <Text style={Styles.todayLineStrong}>Dagens program er slut. Tak for i dag!</Text>
    )}
  </View>
)}

      {changes.length > 0 && (
    <View style={Styles.alertCard} accessibilityLabel="Vigtige ændringer">
     {changes.map((c) => (
      <Text key={c.id} style={Styles.alertText}>{c.text}</Text>
     ))}
   </View>
    )}
      <View style={Styles.quickRow} accessible accessibilityRole="menu">
        <Pressable
          style={({ pressed }) => [Styles.quickButton, pressed && Styles.quickButtonPressed]}
          onPress={() => navigation.navigate('Program')}
          accessibilityRole="button"
          accessibilityLabel="Se programmet"
        >
        <Text style={Styles.quickButtonText}>Program</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [Styles.quickButtonOrange, pressed && Styles.quickButtonPressed]}
          onPress={() => navigation.navigate('Galleri')} 
          accessibilityRole="button"
          accessibilityLabel="Åbn galleri"
        >
          <Text style={Styles.quickButtonTextLight}>Galleri</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [Styles.quickButton, pressed && Styles.quickButtonPressed]}
          onPress={() => navigation.navigate('Pladsen')} 
          accessibilityRole="button"
          accessibilityLabel="Åbn kort"
        >
          <Text style={Styles.quickButtonText}>Kort</Text>
        </Pressable>
      </View>

{/* Tilmelding / billet-info */}
<View style={Styles.signupCard} accessible accessibilityRole="summary" accessibilityLabel="Tilmelding til festival">
  <Text style={Styles.signupTitle}>Har du ikke billet endnu?</Text>
  <Text style={Styles.signupText}>
    Meld dig til ved at ringe på {SIGNUP_PHONE.replace(/(\d{2})(?=\d)/g, '$1 ')}{" "}
    eller skrive en mail til {SIGNUP_EMAIL}.
  </Text>

  <View style={Styles.signupRow}>
    <Pressable
      onPress={() => Linking.openURL(`tel:${SIGNUP_PHONE}`)}
      accessibilityRole="button"
      accessibilityLabel={`Ring ${SIGNUP_PHONE}`}
      style={({ pressed }) => [Styles.signupButton, pressed && Styles.signupButtonPressed]}
    >
      <Text style={Styles.signupButtonText}>Ring</Text>
    </Pressable>

    <Pressable
      onPress={() => Linking.openURL(
        `mailto:${SIGNUP_EMAIL}?subject=Tilmelding%20til%20H%C3%A5b%20%26%20Dr%C3%B8mme%20Festival`
      )}
      accessibilityRole="button"
      accessibilityLabel={`Skriv mail til ${SIGNUP_EMAIL}`}
      style={({ pressed }) => [Styles.signupButtonAlt, pressed && Styles.signupButtonPressed]}
    >
      <Text style={Styles.signupButtonText}>Skriv mail</Text>
    </Pressable>
  </View>
</View>

     <View style={Styles.helpCard} accessible accessibilityRole="summary">
  <View style={Styles.helpHeaderRow}>
    <Text style={Styles.helpTitle}>Har du brug for hjælp?</Text>
    <Text style={Styles.helpSub}>Ring til en pædagog</Text>
  </View>

  <View style={Styles.contactList} accessible accessibilityLabel="Kontakt pædagoger">
    {CONTACTS.map((c, i) => (
      <Pressable
        key={i}
        onPress={() => Linking.openURL(`tel:${c.phone}`)}
        accessibilityRole="button"
        accessibilityLabel={`Ring til ${c.name}`}
        style={({ pressed }) => [
          Styles.contactButton,
          pressed && Styles.contactButtonPressed,
        ]}
      >
        <Text style={Styles.contactButtonText}>
          {c.name} — {c.phone.replace(/(\d{2})(?=\d)/g, '$1 ')}
        </Text>
      </Pressable>
    ))}
  </View>
</View>
    </ScrollView>
    </SafeAreaView>
  );
}
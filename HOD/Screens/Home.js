import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, AccessibilityInfo, Pressable } from 'react-native';
import Styles from '../Styles/HomeStyles';

// Hjemmeskærm med nedtælling, festivalbeskrivelse og navigation til program
export default function Home({ Navigation }) {
    // Dato for festivalen (14. august 2026)
    const targetDate = useMemo(() => new Date(2026, 7, 14, 0, 0, 0), []);

    // Funktion til at beregne hvor lang tid der er tilbage
    const getTimeLeft = () => {
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();
        // Hvis festivalen allerede er i gang eller overstået
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return { days, hours, minutes, seconds, done: false };
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    // Effekt-hook der opdaterer nedtællingen hvert sekund
    useEffect(() => {
        const id = setInterval(() => {
            const next = getTimeLeft();
            setTimeLeft(next);
        }, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    useEffect(() => {
        AccessibilityInfo.announceForAccessibility?.('Nedtælling til Håb og Drømme Festivalen.');
    }, []);

    return (
    <View style={Styles.container} accessible accessibilityLabel="Hjemmeskærm med nedtælling og festivalbeskrivelse">
      {/* festival titel*/}
      <View style={Styles.header}>
        <Text style={Styles.title}>Håb & Drømme Festival</Text>
        <View style={Styles.accentBar} />
      </View>
      <Text style={Styles.countdownIntro}>Vi ses om</Text>

      {/* COUNTDOWN */}
      <View style={Styles.countdownCard} accessible accessibilityRole="timer" accessibilityLabel="Nedtælling til festivalstart">
        {timeLeft.done ? (
          <Text style={Styles.timeNumber}>Festivalen er i gang! 🎉</Text>
        ) : (
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
        )}
      </View>

      {/* festivalbeskrivelse */}
      <Text style={Styles.descriptionTitle}>Hvad er Håb & Drømme Festivalen?</Text>
      <Text style={Styles.description}>
        Håb & Drømme er en årlig inkluderende festival, der samler mennesker i alle aldre
        til fællesskab, fordybelse og sanseoplevelser. Festivalen byder på guidede
        sansestier, kreative workshops og rolige zoner, hvor man kan finde nærvær og
        tryghed. Her er plads til alle – uanset baggrund eller behov.
      </Text>
       <Pressable
        style={Styles.button}
        onPress={() => Navigation.navigate('Program')}
        accessibilityRole="button"
        accessibilityLabel="Se programmet"
 >
        <Text style={Styles.buttonText}>Se program</Text>
      </Pressable>
    </View>
  );

};
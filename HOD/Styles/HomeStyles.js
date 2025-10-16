import { StyleSheet } from 'react-native';

// Farver fra plakaten
const Colors = {
  background: '#F5E8C8', // sand/beige
  surface: '#FFFFFF',
  primary: '#3E6B39',    // mørk skovgrøn
  secondary: '#F28C38',  // varm orange
  accent: '#F6C65B',     // gul badge/dato
  text: '#1E1E1E',       // primær tekst
  mutedText: '#5C7E8C',  // blågrå sekundær tekst
  success: '#B9D08B',    // lys græsgrøn (rolige flader)
  alert: '#C23B22',      // rød (ændringer)
  alertBg: '#F7D6D0',    // lys rød baggrund til alerts
};

export default StyleSheet.create({
  /* Layout & header */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  accentBar: {
    height: 6,
    width: 72,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginTop: 8,
  },
  dateLine: {
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },

  /* Countdown */
  countdownIntro: {
    fontSize: 16,
    color: Colors.mutedText,
    marginTop: 6,
    marginBottom: 6,
  },
  countdownCard: {
    backgroundColor: Colors.success,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBlock: {
    alignItems: 'center',
    minWidth: 64,
  },
  timeNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  timeLabel: {
    color: Colors.text,
  },

  /* Today (på dagen) */
  todayCard: {
    backgroundColor: Colors.accent, // tydeligt banner på dagen
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  todayTitle: {
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  todayLine: {
    fontSize: 16,
    color: Colors.text,
  },
  todayLineEnd: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  bold: {
    fontWeight: '800',
  },

  /* Alert / ændringer */
  alertCard: {
    backgroundColor: Colors.alertBg,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.alert,
  },
  alertText: {
    color: Colors.alert,
    marginBottom: 4,
  },

  /* Beskrivelse */
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 6,
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: Colors.mutedText,
    marginBottom: 12,
  },

  /* Hurtige genveje */
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  quickButton: {
  flex: 1,
  borderWidth: 1,
  borderColor: 'transparent',
  backgroundColor: '#3E6B39', // primary (mørk grøn) — udfyldt
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 8,
  alignItems: 'center',
  marginHorizontal: 4,

  // lidt “card”-fornemmelse
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
},
quickButtonText: {
  fontWeight: '700',
  color: '#FFFFFF', // hvid tekst for kontrast
},
quickButtonPressed: {
  opacity: 0.9, // visuel feedback ved tryk
},
quickButtonOrange: {
  flex: 1,
  borderWidth: 1,
  borderColor: 'transparent',
  backgroundColor: '#F28C38', // varm orange
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 8,
  alignItems: 'center',
  marginHorizontal: 4,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
},
quickButtonTextLight: {
  fontWeight: '700',
  color: '#FFFFFF',
},
quickButtonPressed: {
  opacity: 0.9,
},

  /* Kontakt & hjælp */
  helpSection: {
    marginTop: 8,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 10,
  },
  helpItem: {
    paddingVertical: 6,
  },
  helpItemText: {
    fontWeight: '600',
    color: Colors.text,
  },
});
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
  success: '#B9D08B',    // lys græsgrøn 
  alert: '#C23B22',      // rød (ændringer)
  alertBg: '#F7D6D0',    // lys rød baggrund til alerts
};

export default StyleSheet.create({
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
  todayCard: {
    backgroundColor: Colors.secondary,
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
  backgroundColor: '#3E6B39', 
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
quickButtonText: {
  fontWeight: '700',
  color: '#FFFFFF', 
},
quickButtonPressed: {
  opacity: 0.9, 
},
quickButtonOrange: {
  flex: 1,
  borderWidth: 1,
  borderColor: 'transparent',
  backgroundColor: '#F28C38', 
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
dateText: {
  fontWeight: '600',
  color: Colors.text,
  marginBottom: 8,
},
preInfoTagline: {
  fontSize: 16,
  color: Colors.mutedText,
  marginBottom: 10,
},
helpCard: {
  backgroundColor: Colors.surface,
  borderRadius: 16,
  padding: 14,
  borderWidth: 1,
  borderColor: '#D9C9A6',
  marginTop: 6,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
},
helpHeaderRow: {
  marginBottom: 8,
},
helpTitle: {
  fontSize: 18,
  fontWeight: '800',
  color: Colors.primary,
},
helpSub: {
  color: Colors.mutedText,
  marginTop: 2,
},
helpActionsRow: {
  flexDirection: 'row',
  gap: 8,
  marginTop: 8,
},
helpAction: {
  flex: 1,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 10,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 8,
  borderWidth: 1,
},
helpActionPrimary: {
  backgroundColor: Colors.primary,
  borderColor: Colors.primary,
},
helpActionSecondary: {
  backgroundColor: Colors.secondary,
  borderColor: Colors.secondary,
},
helpActionSurface: {
  backgroundColor: Colors.surface,
  borderColor: '#D9C9A6',
},
helpActionPressed: { opacity: 0.92 },
helpActionIconWrap: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: 'rgba(255,255,255,0.18)',
  alignItems: 'center',
  justifyContent: 'center',
},
helpActionIconWrapSurface: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: 'rgba(62,107,57,0.12)',
  alignItems: 'center',
  justifyContent: 'center',
},
helpActionText: {
  fontWeight: '700',
  color: Colors.primary,
},
helpActionTextLight: {
  fontWeight: '700',
  color: '#FFFFFF',
},
emergencyButton: {
  backgroundColor: Colors.alert,
  borderColor: Colors.alert,
},

contactList: {
  marginTop: 6,
  gap: 8,
},

contactButton: {
  backgroundColor: Colors.primary, 
  borderColor: Colors.primary,
  borderWidth: 1,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 12,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
},

contactButtonPressed: {
  opacity: 0.92,
},

contactButtonText: {
  fontWeight: '800',
  color: '#FFFFFF',     
},
signupCard: {
  marginTop: 16,
  marginHorizontal: 0,
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#D9C9A6',
  backgroundColor: '#ffffffff',
  gap: 8,
},
signupTitle: {
  fontSize: 18,
  fontWeight: '800',
  color: Colors.primary,
},
signupText: {
  fontSize: 14,
  lineHeight: 20,
},
signupRow: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 6,
},
signupButton: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: '#3E6B39', 
},
signupButtonAlt: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: '#F28C38', 
},
signupButtonText: {
  color: '#fff',
  fontWeight: '800',
},
signupButtonPressed: {
  opacity: 0.9,
},
todayHeaderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
},

nowPill: {
  backgroundColor: '#2E7D32', 
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
},
nowPillText: {
  color: '#ffffffff',
  fontWeight: '800',
  fontSize: 12,
  letterSpacing: 0.4,
},

eventTitleLarge: {
  fontSize: 20,
  fontWeight: '800',
  color: '#1F2937',
  marginBottom: 6,
},

metaRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 10,
  flexWrap: 'wrap',
},

placeChip: {
  backgroundColor: '#E3F2FD', 
  color: '#0F4C81',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  fontWeight: '700',
},
timeRange: {
  color: '#374151',
  fontWeight: '600',
},

progressWrap: {
  height: 8,
  backgroundColor: '#E5E7EB',
  borderRadius: 999,
  overflow: 'hidden',
},
progressInner: {
  height: '100%',
  backgroundColor: '#4CAF50',
  borderRadius: 999,
},
progressHint: {
  marginTop: 6,
  color: '#4B5563',
  fontSize: 12,
},

nextRow: {
  marginTop: 14,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
  gap: 2,
},
nextLabel: {
  color: '#6B7280',
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 0.3,
  textTransform: 'uppercase',
},
nextTitle: {
  color: '#111827',
  fontSize: 16,
  fontWeight: '700',
},
nextWhen: {
  color: '#374151',
  fontSize: 13,
},

ctasRow: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 14,
},
ctaBtn: {
  backgroundColor: '#3E6B39',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 10,
},
ctaText: {
  color: '#fff',
  fontWeight: '800',
},
ctaBtnAlt: {
  backgroundColor: '#F3F4F6',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 10,
},
ctaTextAlt: {
  color: '#111827',
  fontWeight: '800',
},
});
import { StyleSheet } from "react-native";

const Colors = {
  background: "#F5E8C8",
  surface: "#FFFFFF",
  primary: "#3E6B39",    
  secondary: "#F28C38",  
  accent: "#F6C65B",     
  text: "#1E1E1E",
  mutedText: "#5C7E8C",
  alert: "#C23B22",
  success: "#B9D08B",
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
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  sub: {
    color: Colors.mutedText,
    marginTop: 2,
    marginBottom: 8,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
    marginVertical: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#D9C9A6",
  },
  cardPressed: { opacity: 0.9 },
  cardRowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  time: {
    fontWeight: "700",
    color: Colors.text,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 2,
  },
  place: {
    color: Colors.mutedText,
  },

  badge: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontWeight: "800",
    overflow: "hidden",
  },
  badgeNow: {
    backgroundColor: Colors.accent,
    color: Colors.text,
  },
  badgeNext: {
    backgroundColor: Colors.accent,
    color: Colors.text,
  },
  allDayHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  allDayPill: {
    marginLeft: 8,
    backgroundColor: Colors.secondary,
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "800",
    overflow: "hidden",
  },
  miniCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D9C9A6",
  },
  miniTitle: {
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  miniMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniTime: {
    color: Colors.mutedText,
  },
  badgeChip: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontWeight: "800",
    overflow: "hidden",
  },
  badgeAllDay: {
    backgroundColor: Colors.secondary,
    color: "#FFFFFF",
  },
  segmented: {
  flexDirection: "row",
  backgroundColor: Colors.surface,
  borderRadius: 12,
  padding: 4,
  marginHorizontal: 0,
  marginTop: 8,
  gap: 6,
  borderWidth: 1,
  borderColor: "#D9C9A6",
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 6,
  elevation: 1,
},
segmentBtn: {
  flex: 1,
  borderRadius: 10,
  paddingVertical: 10,
  alignItems: "center",
},
segmentBtnActive: {
  backgroundColor: Colors.primary,
},
segmentLabel: {
  fontSize: 14,
  fontWeight: "700",
  color: Colors.primary,
},
segmentLabelActive: {
  color: Colors.surface,
},

contentWrap: {
  paddingHorizontal: 0,
  paddingTop: 12,
  flex: 1,
},

emptyWrap: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 32,
},
emptyTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: Colors.text,
  marginBottom: 4,
},
emptySub: {
  fontSize: 14,
  color: Colors.mutedText,
},
});
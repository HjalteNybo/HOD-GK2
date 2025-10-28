import { StyleSheet } from "react-native";
import { colors, spacing, font } from "../Styles/GlobalStyles";

export default StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background ?? "#0b0b0b" },

  // (OLD overlay bar kept for reference but unused)
  filterBar: {
    position: "absolute",
    zIndex: 30,
    left: spacing.m,
    right: spacing.m,
    top: spacing.m,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // NEW: chips below the image
  filterBarBottom: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: spacing.m,
    borderTopWidth: 1,
    borderColor: "#1f1f1f",
    backgroundColor: colors.background ?? "#0b0b0b",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // Map host/content
  canvasHost: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  canvasContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Pins
  pin: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  pinBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  pinLabel: {
    marginTop: 4,
    color: colors.white ?? "#fff",
    fontSize: 12,
    fontFamily: font?.medium ?? undefined,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 4,
  },

  // Chip buttons
  pressed: { opacity: 0.85 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  chipOn: {
    backgroundColor: colors.primary ?? "#3558A6",
    borderWidth: 1,
    borderColor: "#173a7a",
  },
  chipOff: {
    backgroundColor: colors.surface ?? "#1c1c1c",
    borderWidth: 1,
    borderColor: colors.muted ?? "#3a3a3a",
  },
  chipPressed: { transform: [{ scale: 0.98 }] },
  chipText: { fontSize: 13, fontFamily: font?.medium ?? undefined },
  chipTextOn: { color: "#fff" },
  chipTextOff: { color: colors.text ?? "#d7d7d7" },

  // (sheet styles kept if you use elsewhere)
  sheet: {
    position: "absolute",
    left: spacing.m,
    right: spacing.m,
    bottom: spacing.m,
    backgroundColor: "#111",
    padding: spacing.m,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.s,
  },
  sheetTitle: {
    color: colors.white ?? "#fff",
    fontSize: 16,
    fontFamily: font?.semibold ?? undefined,
  },
  sheetText: {
    color: colors.text ?? "#ddd",
    fontSize: 14,
    marginBottom: spacing.s,
  },
  sheetButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.accent ?? "#FFEE00",
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sheetButtonText: { color: "#000", fontFamily: font?.semibold ?? undefined, fontSize: 14 },

  // Modal overlay
  modalHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: {
    width: "86%",
    maxWidth: 420,
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    color: colors.white ?? "#fff",
    fontSize: 16,
    fontFamily: font?.semibold ?? undefined,
  },
  // Make description text pure white now
  modalText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary ?? "#3558A6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: font?.semibold ?? undefined,
  },
});

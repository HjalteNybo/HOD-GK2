import { StyleSheet, Platform } from "react-native";
import { colors, spacing, font } from "./GlobalStyles";

const shadowCard = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 6 },
});

const shadowLite = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 4 },
});

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },

  /** TOP-BOKS */
  topBar: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg * 2.2,
    marginBottom: spacing.md,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...shadowCard,
  },
  title: {
    fontSize: font.title,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.mutedText ?? "#5C7E8C",
  },

  /** HOTSPOTS */
  hallButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  // Ydre grøn ring
  hallOuterRing: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.primary, // grøn kant
    borderRadius: 999,
    backgroundColor: colors.surface,
    ...shadowLite,
  },

  // Ikoncontainer
  hallIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    overflow: "hidden",
  },

  /** LEGEND */
  legendBelowCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...shadowCard,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  legendRowIcon: {
    width: 32, // større ikoner
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.primary,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: colors.mutedText ?? "#5C7E8C",
  },
});

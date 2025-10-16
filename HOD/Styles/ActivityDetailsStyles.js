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
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },
  metaCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D9C9A6",
  },
  metaLine: {
    color: Colors.text,
    marginBottom: 4,
  },
  metaStrong: {
    fontWeight: "800",
    color: Colors.text,
  },
  metaHint: {
    color: Colors.mutedText,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 6,
  },
  description: {
    color: Colors.text,
    marginBottom: 16,
  },

  findButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  findButtonPressed: { opacity: 0.9 },
  findButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E6B39', // primary grøn
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    minWidth: 72,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backBtnPressed: { opacity: 0.9 },
  backText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '800',
    color: '#1E1E1E',
    marginHorizontal: 8,
  },
});
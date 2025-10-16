import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  primary: '#3558A6',
  //Det er disse farver der skal bruges i appen(nedenfor)
  background: '#F5E8C8',
  surface: '#FFFFFF',
  primary: '#3E6B39',
  secondary: '#F28C38',
  accent: '#F6C65B',
  text: '#1E1E1E',
  mutedText: '#5C7E8C',
  alert: '#C23B22',
  success: '#B9D08B',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24
};

export const font = {
  title: 24,
  body: 16
};

export const GlobalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg
  },
  title: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md
  }
});
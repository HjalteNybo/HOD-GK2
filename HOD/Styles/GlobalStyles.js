import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  primary: '#3558A6'
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
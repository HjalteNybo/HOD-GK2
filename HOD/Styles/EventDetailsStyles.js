import { StyleSheet } from 'react-native';
import { colors, spacing, font } from './GlobalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg
  },
  title: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm
  },
  meta: {
    color: colors.muted,
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: font.body + 2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm
  },
  body: {
    fontSize: font.body,
    color: colors.text,
    lineHeight: 22
  },
  badge: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#DCFCE7'
  },
  badgeText: {
    color: '#166534',
    fontWeight: '600'
  }
});
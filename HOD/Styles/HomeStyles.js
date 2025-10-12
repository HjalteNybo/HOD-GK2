import { StyleSheet } from 'react-native';
import { colors, spacing, font } from './GlobalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg
  },

  /* HEADER / HERO */
  header: {
    marginBottom: spacing.lg
  },
  title: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3
  },
  accentBar: {
    height: 4,
    width: 56,
    backgroundColor: colors.primary,
    borderRadius: 999,
    marginTop: spacing.sm
  },
  countdownCard: {
    backgroundColor: '#F8FAFC',  
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center'
  },
  timeNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums']
  },
  timeLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.4
  },
  descriptionTitle: {
    fontSize: font.body + 2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm
  },
  description: {
    fontSize: font.body,
    color: colors.text,
    lineHeight: 22
  },
  note: {
    marginTop: spacing.md,
    color: colors.muted
  },
  button: {
  backgroundColor: colors.primary,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: 12,
  marginTop: spacing.lg,
  alignItems: 'center'
},
buttonText: {
  color: '#fff',
  fontSize: font.body,
  fontWeight: '600'
},
countdownIntro: {
  fontSize: 16,
  fontWeight: '600',
  color: colors.text,
  marginBottom: spacing.sm
},

});
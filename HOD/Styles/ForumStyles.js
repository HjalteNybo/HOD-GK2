import { StyleSheet } from 'react-native';
import { colors, spacing, font } from './GlobalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: font.body,
    marginBottom: spacing.sm
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: font.body
  },
  post: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  postText: {
    fontSize: font.body,
    color: colors.text
  },
  empty: {
    color: colors.muted,
    fontStyle: 'italic'
  }
});
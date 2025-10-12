import { StyleSheet } from 'react-native';
import { colors, spacing, font } from './GlobalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.md
  },
  row: {
    paddingVertical: spacing.md
  },
  rowTitle: {
    fontSize: font.body + 2,
    fontWeight: '600',
    color: colors.text
  },
  rowMeta: {
    marginTop: 4,
    color: colors.muted
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0'
  }
});
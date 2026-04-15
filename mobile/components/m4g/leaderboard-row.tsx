import { StyleSheet, Text, View } from 'react-native'

import type { RankingRow } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

type LeaderboardRowProps = {
  entry: RankingRow
  position: number
}

export function LeaderboardRow({ entry, position }: LeaderboardRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.leftBlock}>
        <View style={styles.positionPill}>
          <Text style={styles.positionText}>{position}</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.name}>{entry.name}</Text>
          <Text style={styles.meta}>{entry.meta}</Text>
        </View>
      </View>

      <View style={styles.rightBlock}>
        <Text style={styles.badge}>{entry.badge}</Text>
        <Text style={styles.value}>{entry.value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: m4gTheme.radii.md,
    padding: m4gTheme.spacing.md,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  positionPill: {
    height: 38,
    width: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
  },
  positionText: {
    color: m4gTheme.colors.indigo,
    fontSize: 15,
    fontWeight: '900',
  },
  textBlock: {
    gap: 2,
    flex: 1,
  },
  name: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  meta: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
  },
  rightBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  badge: {
    color: m4gTheme.colors.indigo,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  value: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
})

import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Star, Users } from 'lucide-react-native'

import type { MockGame } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

type GameCardProps = {
  game: MockGame
  compact?: boolean
}

export function GameCard({ game, compact = false }: GameCardProps) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <LinearGradient
        colors={game.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cover, compact && styles.coverCompact]}>
        <View style={styles.topRow}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{game.tag}</Text>
          </View>
          <View style={styles.ratingPill}>
            <Star color={m4gTheme.colors.amber} fill={m4gTheme.colors.amber} size={13} />
            <Text style={styles.ratingText}>{game.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.coverTitle}>{game.title}</Text>
        <Text style={styles.coverSubtitle}>{game.blurb}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.genre}>{game.genre}</Text>
        <View style={styles.playersRow}>
          <Users color={m4gTheme.colors.textMuted} size={15} />
          <Text style={styles.playersText}>{game.players.toLocaleString()} players</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: m4gTheme.radii.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  cardCompact: {
    width: 286,
  },
  cover: {
    minHeight: 176,
    padding: m4gTheme.spacing.lg,
    justifyContent: 'space-between',
  },
  coverCompact: {
    minHeight: 210,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tagText: {
    color: m4gTheme.colors.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(2, 6, 23, 0.62)',
  },
  ratingText: {
    color: m4gTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  coverTitle: {
    color: m4gTheme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  coverSubtitle: {
    color: 'rgba(248, 250, 252, 0.88)',
    fontSize: 14,
    lineHeight: 21,
  },
  body: {
    gap: 8,
    padding: m4gTheme.spacing.lg,
  },
  title: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  genre: {
    color: m4gTheme.colors.lime,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playersText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 13,
  },
})

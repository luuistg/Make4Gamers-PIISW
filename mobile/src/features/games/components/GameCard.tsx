import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronRight, Star, Users } from 'lucide-react-native'

import type { CatalogGame } from '@/src/features/games/types/catalog-game'
import {
  canOpenRemoteGameUrl,
} from '@/src/features/games/services/gameLaunch'
import { getGameStatusLabel } from '@/src/features/games/services/catalogGame.mapper'
import { m4gTheme } from '@/src/shared/theme'

type GameCardProps = {
  game: CatalogGame
  compact?: boolean
  onPress?: () => void
}

export function GameCard({ game, compact = false, onPress }: GameCardProps) {
  const isLocalPlayable = Boolean(game.localRoute)
  const isRemotePlayable = canOpenRemoteGameUrl(game.game_url)
  const canPlay = isLocalPlayable || isRemotePlayable
  const footerLabel = canPlay ? 'Jugar ahora' : 'Ver ficha del juego'

  const content = (
    <>
      <LinearGradient
        colors={game.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cover, compact && styles.coverCompact]}>
        <View style={styles.topRow}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{game.tag}</Text>
          </View>
          {typeof game.rating === 'number' ? (
            <View style={styles.ratingPill}>
              <Star color={m4gTheme.colors.amber} fill={m4gTheme.colors.amber} size={13} />
              <Text style={styles.ratingText}>{game.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.coverBody}>
          <Text style={styles.coverTitle}>{game.title}</Text>
          <Text style={styles.coverSubtitle}>{game.blurb}</Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{game.title}</Text>
            <Text style={styles.genre}>{game.genre ?? 'Sin genero'}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{getGameStatusLabel(game.status).toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.developerText}>por {game.developerName}</Text>

        <View style={styles.playersRow}>
          <Users color={m4gTheme.colors.textMuted} size={15} />
          <Text style={styles.playersText}>
            {(game.players ?? 0).toLocaleString()} jugadores
          </Text>
        </View>

        <Text style={styles.releaseLabel}>{game.releaseLabel}</Text>

        <View style={[styles.footerRow, canPlay && styles.footerRowPlayable]}>
          <Text style={[styles.footerText, canPlay && styles.footerTextPlayable]}>
            {footerLabel}
          </Text>
          <ChevronRight
            color={canPlay ? m4gTheme.colors.indigo : m4gTheme.colors.textMuted}
            size={18}
          />
        </View>
      </View>
    </>
  )

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${game.title}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          compact && styles.cardCompact,
          pressed && styles.cardPressed,
        ]}>
        {content}
      </Pressable>
    )
  }

  return <View style={[styles.card, compact && styles.cardCompact]}>{content}</View>
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
  cardPressed: {
    transform: [{ scale: 0.985 }],
    borderColor: m4gTheme.colors.borderStrong,
  },
  cardCompact: {
    width: 302,
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
  coverBody: {
    gap: 8,
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
    gap: 9,
    padding: m4gTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
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
  statusPill: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  statusText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  developerText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
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
  releaseLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  footerRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: m4gTheme.radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  footerRowPlayable: {
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
    borderColor: 'rgba(99, 102, 241, 0.24)',
  },
  footerText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  footerTextPlayable: {
    color: m4gTheme.colors.indigo,
  },
})

import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Crown, Layers3, Search, Trophy } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { CategoryChip } from '@/components/m4g/category-chip'
import { LeaderboardRow } from '@/components/m4g/leaderboard-row'
import { SectionHeading } from '@/components/m4g/section-heading'
import { gameRankings, globalRanking } from '@/src/features/ranking/data/mock-ranking'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

const podiumLabels = ['1', '2', '3']
const podiumHeights = [196, 150, 132]

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export default function RankingPage() {
  const [selectedBoardId, setSelectedBoardId] = useState(gameRankings[0]?.gameId ?? '')
  const [gameSearch, setGameSearch] = useState('')

  const filteredBoards = useMemo(() => {
    const normalizedSearch = normalizeText(gameSearch)

    if (!normalizedSearch) {
      return gameRankings
    }

    return gameRankings.filter((board) => normalizeText(board.gameTitle).includes(normalizedSearch))
  }, [gameSearch])

  const selectedBoard = useMemo(
    () => filteredBoards.find((board) => board.gameId === selectedBoardId) ?? filteredBoards[0],
    [filteredBoards, selectedBoardId],
  )

  const podiumEntries = globalRanking.slice(0, 3)
  const maxLevel = Math.max(...globalRanking.map((entry) => entry.level))
  const totalPlayers = globalRanking.length + gameRankings.reduce((sum, board) => sum + board.entries.length, 0)

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
      </View>

      <LinearGradient
        colors={['rgba(99, 102, 241, 0.18)', 'rgba(30, 41, 59, 0.14)', 'rgba(15, 23, 42, 0.94)']}
        style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Trophy color={m4gTheme.colors.indigo} size={28} />
        </View>
        <Text style={styles.heroTitle}>Rankings</Text>
        <Text style={styles.heroText}>
          Sigue el nivel global de los jugadores y cambia entre tablas por videojuego para ver
          donde destaca cada comunidad.
        </Text>

        <View style={styles.heroStats}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{globalRanking.length}</Text>
            <Text style={styles.heroStatLabel}>Top global</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{gameRankings.length}</Text>
            <Text style={styles.heroStatLabel}>Rankings por juego</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{maxLevel}</Text>
            <Text style={styles.heroStatLabel}>Nivel maximo</Text>
          </View>
        </View>
      </LinearGradient>

      <SectionHeading
        title="Ranking global"
        subtitle="Este bloque ordena a los jugadores por nivel general dentro de la plataforma."
      />

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Crown color={m4gTheme.colors.indigo} size={18} />
          <Text style={styles.summaryTitle}>Lider global</Text>
          <Text style={styles.summaryValue}>{globalRanking[0]?.name}</Text>
          <Text style={styles.summaryText}>{globalRanking[0]?.value}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Layers3 color={m4gTheme.colors.indigo} size={18} />
          <Text style={styles.summaryTitle}>Actividad</Text>
          <Text style={styles.summaryValue}>{totalPlayers}</Text>
          <Text style={styles.summaryText}>perfiles listados en tablas</Text>
        </View>
      </View>

      <View style={styles.podiumRow}>
        {podiumEntries.map((entry, index) => {
          const isLeader = index === 0

          return (
            <View
              key={entry.id}
              style={[
                styles.podiumCard,
                { height: podiumHeights[index] },
                isLeader && styles.podiumCardCenter,
              ]}>
              <Text style={styles.podiumPlace}>#{podiumLabels[index]}</Text>
              <Text style={styles.podiumName}>{entry.name}</Text>
              <Text style={styles.podiumBadge}>{entry.badge}</Text>
              <Text style={styles.podiumPoints}>Nivel {entry.level}</Text>
              <Text style={styles.podiumMeta}>{entry.mainGame}</Text>
            </View>
          )
        })}
      </View>

      <View style={styles.table}>
        {globalRanking.map((entry, index) => (
          <LeaderboardRow key={entry.id} entry={entry} position={index + 1} />
        ))}
      </View>

      <SectionHeading
        title="Por videojuego"
        subtitle="Busca un juego concreto o cambia entre tablas con metricas distintas segun su tipo."
      />

      <View style={styles.searchShell}>
        <Search color={m4gTheme.colors.textMuted} size={18} />
        <TextInput
          value={gameSearch}
          onChangeText={setGameSearch}
          placeholder="Busca un videojuego"
          placeholderTextColor={m4gTheme.colors.textMuted}
          autoCapitalize="none"
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {filteredBoards.map((board) => (
          <CategoryChip
            key={board.gameId}
            label={board.gameTitle}
            active={selectedBoard?.gameId === board.gameId}
            onPress={() => setSelectedBoardId(board.gameId)}
          />
        ))}
      </ScrollView>

      {selectedBoard ? (
        <>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.16)', 'rgba(15, 23, 42, 0.92)']}
            style={styles.boardHero}>
            <Text style={styles.boardTag}>{selectedBoard.category}</Text>
            <Text style={styles.boardTitle}>{selectedBoard.gameTitle}</Text>
            <Text style={styles.boardText}>{selectedBoard.description}</Text>

            <View style={styles.boardStats}>
              <View style={styles.boardStatCard}>
                <Text style={styles.boardStatValue}>{selectedBoard.metricLabel}</Text>
                <Text style={styles.boardStatLabel}>Metrica principal</Text>
              </View>
              <View style={styles.boardStatCard}>
                <Text style={styles.boardStatValue}>{selectedBoard.resetLabel}</Text>
                <Text style={styles.boardStatLabel}>Ciclo</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.table}>
            {selectedBoard.entries.map((entry, index) => (
              <LeaderboardRow key={entry.id} entry={entry} position={index + 1} />
            ))}
          </View>
        </>
      ) : gameSearch.trim().length > 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No hay rankings para esa busqueda</Text>
          <Text style={styles.emptyText}>
            Prueba con nombres como Pilot Adventure, Tic Tac Toe o GameClicker.
          </Text>
        </View>
      ) : null}
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    gap: 14,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  heroIcon: {
    height: 52,
    width: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
  },
  heroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 10,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: m4gTheme.radii.md,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.48)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 5,
  },
  heroStatValue: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  heroStatLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 8,
  },
  summaryTitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  summaryText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  podiumCard: {
    flex: 1,
    borderRadius: m4gTheme.radii.lg,
    padding: 14,
    justifyContent: 'flex-end',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  podiumCardCenter: {
    backgroundColor: m4gTheme.colors.cardStrong,
    borderColor: m4gTheme.colors.borderStrong,
  },
  podiumPlace: {
    color: m4gTheme.colors.indigo,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  podiumName: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  podiumBadge: {
    color: m4gTheme.colors.indigo,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  podiumPoints: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  podiumMeta: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  chipsRow: {
    gap: 10,
    paddingRight: 20,
  },
  searchShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: m4gTheme.radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  searchInput: {
    flex: 1,
    color: m4gTheme.colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  boardHero: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    gap: 10,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  boardTag: {
    color: m4gTheme.colors.indigo,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  boardTitle: {
    color: m4gTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  boardText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  boardStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  boardStatCard: {
    flex: 1,
    borderRadius: m4gTheme.radii.md,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.52)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 5,
  },
  boardStatValue: {
    color: m4gTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  boardStatLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  table: {
    gap: 12,
  },
  emptyState: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 8,
  },
  emptyTitle: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
})

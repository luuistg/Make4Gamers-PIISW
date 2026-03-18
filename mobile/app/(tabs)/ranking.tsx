import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Flame, Trophy } from 'lucide-react-native'

import { AppScreen } from '@/components/m4g/app-screen'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { LeaderboardRow } from '@/components/m4g/leaderboard-row'
import { SectionHeading } from '@/components/m4g/section-heading'
import { ranking } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

const podiumOrder = [ranking[1], ranking[0], ranking[2]]
const podiumLabels = ['2', '1', '3']
const podiumHeights = [150, 196, 132]

export default function RankingScreen() {
  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
        <View style={styles.topPill}>
          <Flame color={m4gTheme.colors.lime} size={14} />
          <Text style={styles.topPillText}>TEMPORADA ALPHA</Text>
        </View>
      </View>

      <LinearGradient
        colors={['rgba(190, 242, 100, 0.18)', 'rgba(99, 102, 241, 0.08)', 'rgba(15, 23, 42, 0.94)']}
        style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Trophy color={m4gTheme.colors.lime} size={28} />
        </View>
        <Text style={styles.heroTitle}>Ranking competitivo</Text>
        <Text style={styles.heroText}>
          Aqui fijamos el tono visual del podio y de la tabla. Mas adelante lo alimentaremos con datos reales.
        </Text>
      </LinearGradient>

      <SectionHeading
        title="Podio"
        subtitle="Tres bloques con altura variable para reforzar jerarquia visual desde la primera iteracion."
      />

      <View style={styles.podiumRow}>
        {podiumOrder.map((entry, index) => {
          const isCenter = index === 1

          return (
            <View
              key={entry.id}
              style={[
                styles.podiumCard,
                { height: podiumHeights[index] },
                isCenter && styles.podiumCardCenter,
              ]}>
              <Text style={styles.podiumPlace}>#{podiumLabels[index]}</Text>
              <Text style={styles.podiumName}>{entry.name}</Text>
              <Text style={styles.podiumBadge}>{entry.badge}</Text>
              <Text style={styles.podiumPoints}>{entry.points.toLocaleString()} pts</Text>
            </View>
          )
        })}
      </View>

      <SectionHeading
        title="Clasificacion"
        subtitle="Las filas quedan listas para paginacion, filtros o modos de temporada en la siguiente fase."
      />

      <View style={styles.table}>
        {ranking.map((entry, index) => (
          <LeaderboardRow key={entry.id} entry={entry} position={index + 1} />
        ))}
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  topPillText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heroCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    gap: 12,
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
    color: m4gTheme.colors.lime,
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
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  table: {
    gap: 12,
  },
})

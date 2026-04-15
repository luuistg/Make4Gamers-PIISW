import { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'expo-image'
import { Link, useRouter, type Href } from 'expo-router'
import { ArrowRight, Trophy } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { FeaturePanelCard } from '@/components/m4g/feature-panel'
import { LogoMark } from '@/components/m4g/logo-mark'
import { SectionHeading } from '@/components/m4g/section-heading'
import { GameCard } from '@/src/features/games/components/GameCard'
import { newsBriefs } from '@/src/features/landing/data/news-briefs'
import { canOpenRemoteGameUrl } from '@/src/features/games/services/gameLaunch'
import { getGames, type CatalogGame } from '@/src/features/games/services/getGames'
import { featurePanels } from '@/src/features/landing/data/feature-panels'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

export default function HomePage() {
  const router = useRouter()
  const [games, setGames] = useState<CatalogGame[]>([])

  useEffect(() => {
    const loadGames = async () => {
      const gamesData = await getGames()
      setGames(gamesData)
    }

    loadGames()
  }, [])

  const featuredGames = useMemo(
    () => games.filter((game) => game.featured).slice(0, 4),
    [games],
  )

  const heroStats = useMemo(
    () => [
      { label: 'Juegos destacados', value: String(featuredGames.length) },
      {
        label: 'Builds web',
        value: String(games.filter((game) => canOpenRemoteGameUrl(game.game_url)).length),
      },
      { label: 'Studios activos', value: String(new Set(games.map((game) => game.developerName)).size) },
    ],
    [featuredGames.length, games],
  )

  const openGame = (game: CatalogGame) => {
    router.push(`/game/${game.id}` as Href)
  }

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
      </View>

      <LinearGradient
        colors={['rgba(79, 70, 229, 0.32)', 'rgba(15, 23, 42, 0.92)', 'rgba(2, 6, 23, 0.98)']}
        locations={[0, 0.56, 1]}
        style={styles.heroCard}>
        <Text style={styles.heroTitle}>
          Made
          <Text style={styles.heroAccent}>4Gamers</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Pilot Adventure, la ladder semanal y las nuevas fichas de studios marcan una portada mas
          centrada en noticias, actividad y juegos destacados.
        </Text>

        <View style={styles.orbWrap}>
          <View style={styles.orbOuter} />
          <View style={styles.orbMid} />
          <View style={styles.orbCore}>
            <LogoMark color={m4gTheme.colors.indigo} size={100} />
          </View>
        </View>

        <View style={styles.heroActions}>
          <Link href="/games" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Ver juegos</Text>
              <ArrowRight color={m4gTheme.colors.text} size={17} />
            </Pressable>
          </Link>
          <Link href="/ranking" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Ver ranking</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.statsRow}>
          {heroStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <SectionHeading
        title="Noticias del dia"
        subtitle="La portada se mueve con ranking, studios y juegos que estan creciendo en visibilidad."
      />

      <View style={styles.newsGrid}>
        {newsBriefs.map((brief) => (
          <View key={brief.id} style={styles.newsCard}>
            <View style={styles.newsMedia}>
              <Image source={brief.image} contentFit="cover" style={StyleSheet.absoluteFillObject} />
              <LinearGradient
                colors={['rgba(2, 6, 23, 0.08)', 'rgba(2, 6, 23, 0.74)']}
                locations={[0.22, 1]}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.newsMediaTag}>{brief.tag}</Text>
            </View>
            <Text style={styles.newsTag}>{brief.tag}</Text>
            <Text style={styles.newsTitle}>{brief.title}</Text>
            <Text style={styles.newsSummary}>{brief.summary}</Text>
          </View>
        ))}
      </View>

      <SectionHeading
        title="En portada"
        subtitle="Cuatro focos que resumen la semana entre actividad, novedades y presion competitiva."
      />

      {featurePanels.map((panel) => (
        <FeaturePanelCard key={panel.id} panel={panel} />
      ))}

      <SectionHeading
        title="Juegos destacados"
        subtitle="Los titulos con mejor traccion y mas visibilidad dentro de la plataforma."
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {featuredGames.map((game) => (
          <GameCard key={game.id} game={game} compact onPress={() => openGame(game)} />
        ))}
      </ScrollView>

      <LinearGradient
        colors={['rgba(99, 102, 241, 0.18)', 'rgba(30, 41, 59, 0.16)', 'rgba(15, 23, 42, 0.92)']}
        style={styles.callout}>
        <View style={styles.calloutIcon}>
          <Trophy color={m4gTheme.colors.indigo} size={24} />
        </View>
        <Text style={styles.calloutTitle}>Lo mas seguido de la semana</Text>
        <Text style={styles.calloutText}>
          Action, arcade y adventure empujan la actividad de estos dias mientras el ranking entra
          en su fase mas ajustada antes del cierre.
        </Text>
        <View style={styles.calloutActions}>
          <Link href="/games" asChild>
            <Pressable style={styles.inlineLink}>
              <Text style={styles.inlineLinkText}>Explorar juegos</Text>
            </Pressable>
          </Link>
          <Link href="/ranking" asChild>
            <Pressable style={styles.inlineLink}>
              <Text style={styles.inlineLinkText}>Seguir ladder</Text>
            </Pressable>
          </Link>
        </View>
      </LinearGradient>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCard: {
    borderRadius: m4gTheme.radii.xl,
    padding: m4gTheme.spacing.xl,
    gap: m4gTheme.spacing.md,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    ...m4gTheme.shadows.glow,
  },
  heroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 43,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: -2.3,
  },
  heroAccent: {
    color: m4gTheme.colors.indigo,
  },
  heroSubtitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 340,
  },
  orbWrap: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbOuter: {
    position: 'absolute',
    height: 190,
    width: 190,
    borderRadius: 999,
    backgroundColor: 'rgba(79, 70, 229, 0.16)',
  },
  orbMid: {
    position: 'absolute',
    height: 152,
    width: 152,
    borderRadius: 999,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  orbCore: {
    height: 118,
    width: 118,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: m4gTheme.colors.indigoStrong,
  },
  primaryButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  secondaryButtonText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 15,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    gap: 6,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  statValue: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  newsGrid: {
    gap: 12,
  },
  newsCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.md,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 8,
  },
  newsMedia: {
    height: 152,
    borderRadius: m4gTheme.radii.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: m4gTheme.spacing.md,
    backgroundColor: m4gTheme.colors.backgroundElevated,
  },
  newsMediaTag: {
    color: m4gTheme.colors.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  newsTag: {
    color: m4gTheme.colors.indigo,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  newsTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
  },
  newsSummary: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  carousel: {
    gap: 16,
    paddingRight: 20,
  },
  callout: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    gap: 12,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  calloutIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.84)',
  },
  calloutTitle: {
    color: m4gTheme.colors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
  },
  calloutText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  inlineLink: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(2, 6, 23, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inlineLinkText: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
})

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { ArrowRight, Sparkles, Trophy } from 'lucide-react-native'

import { AppScreen } from '@/components/m4g/app-screen'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { FeaturePanelCard } from '@/components/m4g/feature-panel'
import { GameCard } from '@/components/m4g/game-card'
import { HeroLines } from '@/components/m4g/hero-lines'
import { LogoMark } from '@/components/m4g/logo-mark'
import { SectionHeading } from '@/components/m4g/section-heading'
import { featurePanels, games } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

const heroStats = [
  { label: 'Pantallas base', value: '5' },
  { label: 'Backend conectado', value: '0' },
  { label: 'Estilo web', value: '100%' },
]

export default function HomeScreen() {
  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>MOBILE ALPHA</Text>
        </View>
      </View>

      <LinearGradient
        colors={['rgba(79, 70, 229, 0.32)', 'rgba(15, 23, 42, 0.92)', 'rgba(2, 6, 23, 0.98)']}
        locations={[0, 0.56, 1]}
        style={styles.heroCard}>
        <View style={styles.heroPill}>
          <Sparkles color={m4gTheme.colors.lime} size={16} />
          <Text style={styles.heroPillText}>Challenge the Top</Text>
        </View>

        <Text style={styles.heroTitle}>
          Made
          <Text style={styles.heroAccent}>4Gamers</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          La base movil arranca con la atmosfera de la web: competitiva, oscura y directa.
        </Text>

        <View style={styles.orbWrap}>
          <View style={styles.orbOuter} />
          <View style={styles.orbMid} />
          <View style={styles.orbCore}>
            <LogoMark color={m4gTheme.colors.indigo} size={100} />
          </View>
        </View>

        <HeroLines />

        <View style={styles.heroActions}>
          <Link href="/login" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
              <ArrowRight color={m4gTheme.colors.text} size={17} />
            </Pressable>
          </Link>
          <Link href="/register" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
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
        title="Sube de nivel"
        subtitle="Estos bloques traducen el mensaje de la landing web al formato movil sin tocar logica."
      />

      {featurePanels.map((panel) => (
        <FeaturePanelCard key={panel.id} panel={panel} />
      ))}

      <SectionHeading
        title="Juegos destacados"
        subtitle="Tarjetas mock para fijar tono, densidad y composicion antes de conectar datos reales."
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {games.slice(0, 4).map((game) => (
          <GameCard key={game.id} game={game} compact />
        ))}
      </ScrollView>

      <LinearGradient
        colors={['rgba(190, 242, 100, 0.16)', 'rgba(99, 102, 241, 0.1)', 'rgba(15, 23, 42, 0.92)']}
        style={styles.callout}>
        <View style={styles.calloutIcon}>
          <Trophy color={m4gTheme.colors.lime} size={24} />
        </View>
        <Text style={styles.calloutTitle}>Todo listo para crecer</Text>
        <Text style={styles.calloutText}>
          El siguiente paso ya no es rehacer estilos: es conectar backend, detalle de juego y estados reales encima de esta base.
        </Text>
        <View style={styles.calloutActions}>
          <Link href="/games" asChild>
            <Pressable style={styles.inlineLink}>
              <Text style={styles.inlineLinkText}>Ver catalogo</Text>
            </Pressable>
          </Link>
          <Link href="/ranking" asChild>
            <Pressable style={styles.inlineLink}>
              <Text style={styles.inlineLinkText}>Ver ranking</Text>
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
    justifyContent: 'space-between',
  },
  topBadge: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  topBadgeText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroCard: {
    borderRadius: m4gTheme.radii.xl,
    padding: m4gTheme.spacing.xl,
    gap: m4gTheme.spacing.md,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    ...m4gTheme.shadows.glow,
  },
  heroPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.56)',
  },
  heroPillText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
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
    backgroundColor: 'rgba(232, 121, 249, 0.16)',
  },
  orbMid: {
    position: 'absolute',
    height: 152,
    width: 152,
    borderRadius: 999,
    backgroundColor: 'rgba(99, 102, 241, 0.22)',
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

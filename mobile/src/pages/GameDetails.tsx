import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'
import { useLocalSearchParams, useRouter, type Href } from 'expo-router'
import { ArrowLeft, Gamepad2, Layers3, Star, Upload } from 'lucide-react-native'

import { AchievementUnlockModal } from '@/components/m4g/achievement-unlock-modal'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { SectionHeading } from '@/components/m4g/section-heading'
import { unlockMobileFirstGameAchievement } from '@/src/features/achievements/services/achievements.service'
import { buildGameLaunchUrl } from '@/src/features/games/services/gameLaunch'
import { getGameStatusLabel } from '@/src/features/games/services/catalogGame.mapper'
import { getGameById, type CatalogGame } from '@/src/features/games/services/getGameById.service'
import { registerTrackedGamePlaytime } from '@/src/features/gameplay/services/playtimeTracking.service'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

export default function GameDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [launching, setLaunching] = useState(false)
  const [game, setGame] = useState<CatalogGame | null>(null)
  const [achievementModalVisible, setAchievementModalVisible] = useState(false)
  const [achievementModalTitle, setAchievementModalTitle] = useState('Primer juego en movil')
  const [achievementModalDescription, setAchievementModalDescription] = useState(
    'Tu insignia retro ya esta guardada en el perfil. Para la demo, este panel vuelve a aparecer cada vez que entras al juego.',
  )

  useEffect(() => {
    let mounted = true

    const loadGame = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        const data = await getGameById(id)
        if (mounted) {
          setGame(data)
        }
      } catch {
        if (mounted) {
          setGame(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadGame()

    return () => {
      mounted = false
    }
  }, [id])

  const metadata = useMemo(() => {
    if (!game) {
      return []
    }

    return [
      { label: 'Desarrollador', value: game.developerName },
      { label: 'Estado', value: getGameStatusLabel(game.status) },
      { label: 'Version', value: game.version ?? 'Sin version' },
      {
        label: 'Modos',
        value: game.available_modes?.length ? game.available_modes.join(', ') : 'Sin definir',
      },
    ]
  }, [game])

  const launchUrl = useMemo(() => {
    if (!game) {
      return null
    }

    return buildGameLaunchUrl(game)
  }, [game])

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/games')
  }

  const openSelectedGame = async () => {
    if (!game) {
      setLaunching(false)
      return
    }

    if (game.playable && game.localRoute) {
      setLaunching(false)
      router.push(game.localRoute as Href)
      return
    }

    if (!launchUrl) {
      setLaunching(false)
      return
    }

    try {
      const startedAt = Date.now()
      await WebBrowser.openBrowserAsync(launchUrl, {
        controlsColor: m4gTheme.colors.indigoStrong,
      })

      void registerTrackedGamePlaytime({
        gameId: game.id,
        gameTitle: game.title,
        additionalSeconds: Math.floor((Date.now() - startedAt) / 1000),
      })
    } catch {
      Alert.alert(
        'No se pudo abrir el juego',
        'La ficha existe, pero la URL del juego no pudo abrirse desde este dispositivo.',
      )
    } finally {
      setLaunching(false)
    }
  }

  const showAchievementDemoModal = (achievementTitle: string, achievementDescription: string) => {
    setAchievementModalTitle(achievementTitle)
    setAchievementModalDescription(achievementDescription)
    setAchievementModalVisible(true)
  }

  const handleAchievementContinue = () => {
    setAchievementModalVisible(false)
    void openSelectedGame()
  }

  const handlePlay = async () => {
    if (!game) {
      return
    }

    try {
      setLaunching(true)

      const achievementResult = await unlockMobileFirstGameAchievement({
        gameId: game.id,
        gameTitle: game.title,
      })

      if (
        achievementResult.status === 'unlocked' ||
        achievementResult.status === 'already_unlocked'
      ) {
        showAchievementDemoModal(
          achievementResult.achievement?.title ?? 'Primer juego en movil',
          'Tu insignia retro ya esta guardada en el perfil. Para la demo, este panel vuelve a aparecer cada vez que entras al juego.',
        )
        return
      }
    } catch {
      // La demo no debe bloquear el acceso al juego si falla el guardado del logro.
    }

    await openSelectedGame()
  }

  const canPlay = Boolean((game?.playable && game.localRoute) || launchUrl)
  const playLabel = canPlay ? 'Jugar ahora' : 'Ver ficha'

  if (loading) {
    return (
      <AppScreen scrollable={false} contentContainerStyle={styles.centeredState}>
        <ActivityIndicator color={m4gTheme.colors.lime} size="large" />
        <Text style={styles.stateTitle}>Cargando ficha</Text>
        <Text style={styles.stateText}>
          Estamos preparando la informacion del juego para mostrar su ficha completa dentro del
          catalogo.
        </Text>
      </AppScreen>
    )
  }

  if (!game) {
    return (
      <AppScreen scrollable={false} contentContainerStyle={styles.centeredState}>
        <Text style={styles.stateTitle}>Juego no encontrado</Text>
        <Text style={styles.stateText}>
          La ruta existe, pero ese titulo no forma parte del catalogo disponible en este momento.
        </Text>
        <Pressable onPress={handleBack} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Volver al catalogo</Text>
        </Pressable>
      </AppScreen>
    )
  }

  return (
    <AppScreen>
      <AchievementUnlockModal
        visible={achievementModalVisible}
        title={achievementModalTitle}
        description={achievementModalDescription}
        buttonLabel="Continuar al juego"
        arcadeTopText="INSERT COIN"
        arcadeLabel="FIRST RUN"
        arcadeBottomText="PLAYER 1 READY"
        onContinue={handleAchievementContinue}
      />

      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={m4gTheme.colors.text} size={18} />
          <Text style={styles.backText}>Catalogo</Text>
        </Pressable>
        <BrandWordmark compact />
      </View>

      <LinearGradient
        colors={game.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{game.tag}</Text>
          </View>
          <View style={styles.ratingPill}>
            <Star color={m4gTheme.colors.amber} fill={m4gTheme.colors.amber} size={14} />
            <Text style={styles.ratingText}>{(game.rating ?? 0).toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>{game.title}</Text>
          <Text style={styles.heroSubtitle}>{game.description ?? game.blurb}</Text>
        </View>

        <View style={styles.heroMeta}>
          <View style={styles.heroMetaCard}>
            <Text style={styles.heroMetaLabel}>Studio</Text>
            <Text style={styles.heroMetaValue}>{game.developerName}</Text>
          </View>
          <View style={styles.heroMetaCard}>
            <Text style={styles.heroMetaLabel}>Genero</Text>
            <Text style={styles.heroMetaValue}>{game.genre ?? 'Sin genero'}</Text>
          </View>
          <View style={styles.heroMetaCard}>
            <Text style={styles.heroMetaLabel}>Jugadores</Text>
            <Text style={styles.heroMetaValue}>{(game.players ?? 0).toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={handlePlay}
          disabled={!canPlay || launching}
          style={[styles.primaryButton, (!canPlay || launching) && styles.primaryButtonDisabled]}>
          <Gamepad2 color={m4gTheme.colors.text} size={16} />
          <Text style={styles.primaryButtonText}>
            {canPlay ? playLabel : 'Gameplay pendiente'}
          </Text>
        </Pressable>
        <Pressable onPress={handleBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Seguir explorando</Text>
        </Pressable>
      </View>

      <SectionHeading
        title="Ficha del juego"
        subtitle="Metadatos claros, contexto del estudio y acceso directo al juego desde una misma experiencia."
      />

      <View style={styles.grid}>
        {metadata.map((item) => (
          <View key={item.label} style={styles.infoCard}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Upload color={m4gTheme.colors.lime} size={18} />
          <Text style={styles.detailTitle}>Disponibilidad</Text>
        </View>
        <Text style={styles.detailText}>{game.releaseLabel}</Text>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Layers3 color={m4gTheme.colors.indigo} size={18} />
          <Text style={styles.detailTitle}>Acceso al juego</Text>
        </View>
        <Text style={styles.detailText}>
          {launchUrl
            ? 'Esta ficha puede abrir la misma version disponible del juego directamente desde el navegador integrado del movil.'
            : 'La ficha ya forma parte del catalogo y activara el acceso jugable en cuanto su publicacion este disponible.'}
        </Text>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 40,
  },
  stateTitle: {
    color: m4gTheme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  stateText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  backText: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    borderRadius: m4gTheme.radii.xl,
    padding: m4gTheme.spacing.xl,
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
    ...m4gTheme.shadows.glow,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
  },
  tagText: {
    color: m4gTheme.colors.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(2, 6, 23, 0.62)',
  },
  ratingText: {
    color: m4gTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  heroCopy: {
    gap: 10,
  },
  heroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  heroSubtitle: {
    color: 'rgba(248, 250, 252, 0.9)',
    fontSize: 15,
    lineHeight: 24,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroMetaCard: {
    flex: 1,
    minWidth: 96,
    borderRadius: m4gTheme.radii.md,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.34)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
    gap: 6,
  },
  heroMetaLabel: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroMetaValue: {
    color: m4gTheme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: m4gTheme.colors.indigoStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
  },
  primaryButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 15,
    fontWeight: '800',
  },
  grid: {
    gap: 12,
  },
  infoCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 6,
  },
  infoLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  detailCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  detailText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
})

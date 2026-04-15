import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, Cpu, Gamepad2, Rocket, Zap } from 'lucide-react-native'

import { AchievementUnlockModal } from '@/components/m4g/achievement-unlock-modal'
import { AppScreen } from '@/components/m4g/app-screen'
import { m4gTheme } from '@/constants/theme'
import { subscribeToAuthState } from '@/src/features/auth/services/auth.service'
import {
  buildGameClickerProgress,
  createEmptyGameClickerOwnedUpgrades,
  createGameClickerProgressSignature,
  loadGameClickerProgress,
  saveGameClickerProgress,
  type GameClickerOwnedUpgrades,
} from '@/src/features/gameplay/services/gameclickerProgress.service'
import { registerTrackedGamePlaytime } from '@/src/features/gameplay/services/playtimeTracking.service'

type UpgradeId = keyof GameClickerOwnedUpgrades
type UpgradeType = 'tap' | 'auto'
type ConsoleVariant = 'handheld' | 'mini' | 'hybrid' | 'desktop' | 'tower' | 'core'
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type UpgradeDefinition = {
  id: UpgradeId
  title: string
  description: string
  baseCost: number
  growth: number
  value: number
  type: UpgradeType
}

type ConsoleMilestone = {
  id: string
  name: string
  bits: number
  flavor: string
  modelLabel: string
  variant: ConsoleVariant
  hero: [string, string]
  screen: [string, string]
  shellColor: string
  outlineColor: string
  accentColor: string
}

type ConsoleLayout = {
  bodyWidth: number
  bodyHeight: number
  bodyRadius: number
  screenHeight: number
  screenRadius: number
  gripWidth?: number
  gripHeight?: number
  topBadge?: boolean
  dockWidth?: number
  dockHeight?: number
}

const upgrades: UpgradeDefinition[] = [
  {
    id: 'pads',
    title: 'Retro Pads',
    description: 'Mandos mas precisos para rascar algunos bits extra en cada toque.',
    baseCost: 45,
    growth: 1.82,
    value: 1,
    type: 'tap',
  },
  {
    id: 'arcades',
    title: 'Arcade Stacks',
    description: 'Cabinas viejas que aportan flujo pasivo, pero suben de precio rapido.',
    baseCost: 130,
    growth: 1.9,
    value: 1,
    type: 'auto',
  },
  {
    id: 'consoles',
    title: 'Console Walls',
    description: 'Coleccion de sobremesa para acelerar la fabrica de bits poco a poco.',
    baseCost: 360,
    growth: 1.96,
    value: 3,
    type: 'auto',
  },
  {
    id: 'studios',
    title: 'Indie Studios',
    description: 'Pequenos estudios que mejoran toque y pasivo, pero tardan en rentar.',
    baseCost: 780,
    growth: 2.04,
    value: 2,
    type: 'tap',
  },
]

const milestones: ConsoleMilestone[] = [
  {
    id: 'retro-8',
    name: 'Retro-8 Deck',
    bits: 0,
    flavor: 'Empiezas con una consola pixelada y una produccion bastante humilde.',
    modelLabel: 'R-8',
    variant: 'handheld',
    hero: ['#1d4ed8', '#111827'],
    screen: ['#60a5fa', '#1d4ed8'],
    shellColor: '#243b67',
    outlineColor: '#93c5fd',
    accentColor: '#fbbf24',
  },
  {
    id: 'pocket-x',
    name: 'Pocket-X',
    bits: 160,
    flavor: 'Portatil compacta para una fase media un poco mas agil.',
    modelLabel: 'PX',
    variant: 'mini',
    hero: ['#0f766e', '#0f172a'],
    screen: ['#34d399', '#0f766e'],
    shellColor: '#143b3a',
    outlineColor: '#6ee7b7',
    accentColor: '#fde047',
  },
  {
    id: 'arcadia-slab',
    name: 'Arcadia Slab',
    bits: 520,
    flavor: 'Una mezcla entre recreativa y consola hibrida pensada para maratones.',
    modelLabel: 'ARC',
    variant: 'hybrid',
    hero: ['#7c3aed', '#1e1b4b'],
    screen: ['#c084fc', '#7c3aed'],
    shellColor: '#352053',
    outlineColor: '#d8b4fe',
    accentColor: '#f472b6',
  },
  {
    id: 'nova-station',
    name: 'Nova Station',
    bits: 1400,
    flavor: 'Una sobremesa seria: mas presencia, mas brillo y mejor ritmo de farmeo.',
    modelLabel: 'NST',
    variant: 'desktop',
    hero: ['#312e81', '#0f172a'],
    screen: ['#818cf8', '#312e81'],
    shellColor: '#20284b',
    outlineColor: '#a5b4fc',
    accentColor: '#bef264',
  },
  {
    id: 'titan-rig',
    name: 'Titan Rig',
    bits: 3400,
    flavor: 'Un mastodonte vertical que ya parece una pieza central de setup.',
    modelLabel: 'TRG',
    variant: 'tower',
    hero: ['#be123c', '#111827'],
    screen: ['#fb7185', '#be123c'],
    shellColor: '#3f1d2e',
    outlineColor: '#fda4af',
    accentColor: '#fbbf24',
  },
  {
    id: 'cosmos-core',
    name: 'Cosmos Core',
    bits: 7600,
    flavor: 'Tier final de la coleccion: neones duros, presencia total y cierre de run.',
    modelLabel: 'C-0',
    variant: 'core',
    hero: ['#5b21b6', '#0f172a'],
    screen: ['#e879f9', '#7c3aed'],
    shellColor: '#261541',
    outlineColor: '#f5d0fe',
    accentColor: '#bef264',
  },
]

const consoleLayouts: Record<ConsoleVariant, ConsoleLayout> = {
  handheld: {
    bodyWidth: 214,
    bodyHeight: 110,
    bodyRadius: 30,
    screenHeight: 56,
    screenRadius: 18,
    gripWidth: 38,
    gripHeight: 88,
  },
  mini: {
    bodyWidth: 186,
    bodyHeight: 104,
    bodyRadius: 28,
    screenHeight: 52,
    screenRadius: 18,
    gripWidth: 26,
    gripHeight: 82,
  },
  hybrid: {
    bodyWidth: 232,
    bodyHeight: 108,
    bodyRadius: 28,
    screenHeight: 56,
    screenRadius: 20,
    gripWidth: 28,
    gripHeight: 92,
  },
  desktop: {
    bodyWidth: 228,
    bodyHeight: 100,
    bodyRadius: 24,
    screenHeight: 50,
    screenRadius: 16,
    dockWidth: 148,
    dockHeight: 14,
  },
  tower: {
    bodyWidth: 144,
    bodyHeight: 164,
    bodyRadius: 24,
    screenHeight: 78,
    screenRadius: 18,
    topBadge: true,
  },
  core: {
    bodyWidth: 194,
    bodyHeight: 140,
    bodyRadius: 32,
    screenHeight: 72,
    screenRadius: 24,
    topBadge: true,
    dockWidth: 116,
    dockHeight: 12,
  },
}

const AUTO_SAVE_DELAY_MS = 4000
const DEMO_PLAYTIME_ACHIEVEMENT_SECONDS = 20
const PLAYTIME_SYNC_INTERVAL_MS = 5000
const initialOwned: GameClickerOwnedUpgrades = createEmptyGameClickerOwnedUpgrades()

function getUpgradeCost(upgrade: UpgradeDefinition, owned: number) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.growth, owned))
}

function formatBits(value: number) {
  return Math.floor(value).toLocaleString('es-ES')
}

function ConsoleShowcase({ consoleItem }: { consoleItem: ConsoleMilestone }) {
  const layout = consoleLayouts[consoleItem.variant]

  return (
    <View style={styles.consoleShowcase}>
      {layout.gripWidth && layout.gripHeight ? (
        <>
          <View
            style={[
              styles.consoleGrip,
              styles.consoleGripLeft,
              {
                width: layout.gripWidth,
                height: layout.gripHeight,
                backgroundColor: consoleItem.accentColor,
              },
            ]}
          />
          <View
            style={[
              styles.consoleGrip,
              styles.consoleGripRight,
              {
                width: layout.gripWidth,
                height: layout.gripHeight,
                backgroundColor: consoleItem.accentColor,
              },
            ]}
          />
        </>
      ) : null}

      <View
        style={[
          styles.consoleBody,
          {
            width: layout.bodyWidth,
            height: layout.bodyHeight,
            borderRadius: layout.bodyRadius,
            backgroundColor: consoleItem.shellColor,
            borderColor: consoleItem.outlineColor,
          },
        ]}>
        {layout.topBadge ? (
          <View style={[styles.consoleTopBadge, { backgroundColor: consoleItem.accentColor }]} />
        ) : null}

        <LinearGradient
          colors={consoleItem.screen}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.consoleScreen,
            {
              height: layout.screenHeight,
              borderRadius: layout.screenRadius,
            },
          ]}>
          <Text style={styles.consoleScreenLabel}>{consoleItem.modelLabel}</Text>
        </LinearGradient>

        <View style={styles.consoleControlsRow}>
          <View style={[styles.consoleDpad, { backgroundColor: consoleItem.outlineColor }]} />
          <View style={styles.consoleButtons}>
            <View style={[styles.consoleButtonDot, { backgroundColor: consoleItem.accentColor }]} />
            <View style={[styles.consoleButtonDot, { backgroundColor: consoleItem.outlineColor }]} />
            <View style={[styles.consoleButtonDot, { backgroundColor: consoleItem.accentColor }]} />
          </View>
        </View>
      </View>

      {layout.dockWidth && layout.dockHeight ? (
        <View
          style={[
            styles.consoleDock,
            {
              width: layout.dockWidth,
              height: layout.dockHeight,
              borderColor: consoleItem.outlineColor,
              backgroundColor: `${consoleItem.shellColor}CC`,
            },
          ]}
        />
      ) : null}
    </View>
  )
}

export default function GameClickerScreen() {
  const router = useRouter()
  const [bits, setBits] = useState(0)
  const [lifetimeBits, setLifetimeBits] = useState(0)
  const [tapCount, setTapCount] = useState(0)
  const [owned, setOwned] = useState<GameClickerOwnedUpgrades>(initialOwned)
  const [accountReady, setAccountReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveMessage, setSaveMessage] = useState('Conecta tu cuenta para sincronizar esta partida.')
  const [achievementModalVisible, setAchievementModalVisible] = useState(false)
  const [achievementModalTitle, setAchievementModalTitle] = useState('Maraton de una hora')
  const [achievementModalDescription, setAchievementModalDescription] = useState(
    'Has desbloqueado un logro retro por mantenerte a tope en la misma partida.',
  )
  const userMetadataRef = useRef<Record<string, unknown>>({})
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedSignatureRef = useRef<string | null>(null)
  const activePlayStartedAtRef = useRef(Date.now())
  const currentSessionPlayedSecondsRef = useRef(0)
  const achievementPreviewShownRef = useRef(false)

  const unlockedConsoles = milestones.filter((milestone) => lifetimeBits >= milestone.bits)
  const activeConsole = unlockedConsoles[unlockedConsoles.length - 1] ?? milestones[0]
  const nextConsole = milestones.find((milestone) => lifetimeBits < milestone.bits)
  const previousThreshold = unlockedConsoles[unlockedConsoles.length - 1]?.bits ?? 0
  const progressToNext = nextConsole
    ? Math.min(1, (lifetimeBits - previousThreshold) / (nextConsole.bits - previousThreshold))
    : 1

  const comboTier = Math.floor(tapCount / 40)
  const comboMultiplier = 1 + Math.min(1.2, comboTier * 0.15)
  const consoleBonus = Math.max(0, unlockedConsoles.length - 1)
  const tapPower = 1 + owned.pads + owned.studios * 2 + consoleBonus
  const bitsPerTap = Math.max(1, Math.floor(tapPower * comboMultiplier))
  const passiveIncome = owned.arcades + owned.consoles * 3 + owned.studios
  const currentProgress = buildGameClickerProgress({
    bits,
    lifetimeBits,
    tapCount,
    owned,
  })
  const currentProgressSignature = createGameClickerProgressSignature(currentProgress)
  const saveStatusTitle = !accountReady
    ? 'Cargando cuenta'
    : !isAuthenticated
      ? 'Modo invitado'
      : saveStatus === 'saving'
        ? 'Guardando progreso'
        : saveStatus === 'error'
          ? 'Guardado con incidencia'
          : lastSavedSignatureRef.current
            ? 'Progreso sincronizado'
            : 'Cuenta conectada'

  const persistCurrentProgress = useCallback(async () => {
    if (!accountReady || !isAuthenticated) {
      return
    }

    if (currentProgressSignature === lastSavedSignatureRef.current) {
      return
    }

    setSaveStatus('saving')
    setSaveMessage('Guardando tu progreso en la cuenta...')

    try {
      const { metadata } = await saveGameClickerProgress(currentProgress, userMetadataRef.current)
      userMetadataRef.current = metadata
      lastSavedSignatureRef.current = currentProgressSignature
      setSaveStatus('saved')
      setSaveMessage(
        `Progreso sincronizado con ${formatBits(currentProgress.lifetimeBits)} bits acumulados.`,
      )
    } catch (error) {
      setSaveStatus('error')
      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el progreso en tu cuenta.',
      )
    }
  }, [accountReady, currentProgress, currentProgressSignature, isAuthenticated])

  const showAchievementUnlockModal = useCallback((title: string, description: string) => {
    setAchievementModalTitle(title)
    setAchievementModalDescription(description)
    setAchievementModalVisible(true)
  }, [])

  const trackCurrentPlaytime = useCallback(async (options?: { showUnlockModal?: boolean }) => {
    const elapsedSeconds = Math.floor((Date.now() - activePlayStartedAtRef.current) / 1000)
    activePlayStartedAtRef.current = Date.now()

    if (elapsedSeconds <= 0) {
      return
    }

    currentSessionPlayedSecondsRef.current += elapsedSeconds

    try {
      const result = await registerTrackedGamePlaytime({
        gameId: 'gameclicker',
        gameTitle: 'GameClicker',
        additionalSeconds: elapsedSeconds,
      })

      if (
        options?.showUnlockModal &&
        !achievementPreviewShownRef.current &&
        currentSessionPlayedSecondsRef.current >= DEMO_PLAYTIME_ACHIEVEMENT_SECONDS &&
        (result.achievementResult?.status === 'unlocked' ||
          result.achievementResult?.status === 'already_unlocked')
      ) {
        achievementPreviewShownRef.current = true
        showAchievementUnlockModal(
          result.achievementResult.achievement?.title ?? 'Maraton de una hora',
          result.achievementResult.achievement?.description ??
            'Has desbloqueado un logro retro por mantenerte a tope en la misma partida.',
        )
      }
    } catch {
      // El registro de tiempo no debe interrumpir la partida.
    }
  }, [showAchievementUnlockModal])

  useEffect(() => {
    let mounted = true

    const hydrateProgress = async () => {
      try {
        const { user, metadata, progress } = await loadGameClickerProgress()

        if (!mounted) {
          return
        }

        userMetadataRef.current = metadata
        setIsAuthenticated(!!user)

        if (progress) {
          lastSavedSignatureRef.current = createGameClickerProgressSignature(progress)
          setBits(progress.bits)
          setLifetimeBits(progress.lifetimeBits)
          setTapCount(progress.tapCount)
          setOwned(progress.owned)
          setSaveStatus('saved')
          setSaveMessage(
            `Progreso recuperado con ${formatBits(progress.lifetimeBits)} bits acumulados.`,
          )
        } else if (user) {
          setSaveStatus('idle')
          setSaveMessage('Tu cuenta esta lista para guardar esta partida.')
        } else {
          setSaveStatus('idle')
          setSaveMessage('Inicia sesion para guardar el progreso en tu cuenta.')
        }
      } catch (error) {
        if (!mounted) {
          return
        }

        setSaveStatus('error')
        setSaveMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el progreso guardado de la cuenta.',
        )
      } finally {
        if (mounted) {
          setAccountReady(true)
        }
      }
    }

    hydrateProgress()

    const {
      data: { subscription },
    } = subscribeToAuthState((_event, session) => {
      if (!mounted) {
        return
      }

      const currentUser = session?.user ?? null
      setIsAuthenticated(!!currentUser)
      userMetadataRef.current =
        currentUser?.user_metadata &&
        typeof currentUser.user_metadata === 'object' &&
        !Array.isArray(currentUser.user_metadata)
          ? { ...(currentUser.user_metadata as Record<string, unknown>) }
          : {}

      if (!currentUser) {
        setSaveStatus('idle')
        setSaveMessage('Inicia sesion para guardar el progreso en tu cuenta.')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!passiveIncome) {
      return
    }

    const timer = setInterval(() => {
      setBits((current) => current + passiveIncome)
      setLifetimeBits((current) => current + passiveIncome)
    }, 1000)

    return () => clearInterval(timer)
  }, [passiveIncome])

  useEffect(() => {
    if (!accountReady || !isAuthenticated) {
      return
    }

    if (currentProgressSignature === lastSavedSignatureRef.current) {
      return
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      void persistCurrentProgress()
    }, AUTO_SAVE_DELAY_MS)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [accountReady, currentProgressSignature, isAuthenticated, persistCurrentProgress])

  useEffect(() => {
    if (achievementModalVisible) {
      return
    }

    const timer = setInterval(() => {
      void trackCurrentPlaytime({ showUnlockModal: true })
    }, PLAYTIME_SYNC_INTERVAL_MS)

    return () => {
      clearInterval(timer)
    }
  }, [achievementModalVisible, trackCurrentPlaytime])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        activePlayStartedAtRef.current = Date.now()
        return
      }

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }

      void trackCurrentPlaytime({ showUnlockModal: false })
      void persistCurrentProgress()
    })

    return () => {
      subscription.remove()
    }
  }, [accountReady, currentProgressSignature, isAuthenticated, persistCurrentProgress, trackCurrentPlaytime])

  useEffect(() => {
    if (!achievementModalVisible) {
      activePlayStartedAtRef.current = Date.now()
    }
  }, [achievementModalVisible])

  useEffect(() => {
    activePlayStartedAtRef.current = Date.now()

    return () => {
      void trackCurrentPlaytime({ showUnlockModal: false })
    }
  }, [trackCurrentPlaytime])

  const handleAchievementContinue = () => {
    setAchievementModalVisible(false)
  }

  const handleTap = () => {
    setBits((current) => current + bitsPerTap)
    setLifetimeBits((current) => current + bitsPerTap)
    setTapCount((current) => current + 1)
  }

  const handleBuyUpgrade = (upgrade: UpgradeDefinition) => {
    const cost = getUpgradeCost(upgrade, owned[upgrade.id])

    if (bits < cost) {
      return
    }

    setBits((current) => current - cost)
    setOwned((current) => ({
      ...current,
      [upgrade.id]: current[upgrade.id] + 1,
    }))
  }

  const handleBack = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }

    void trackCurrentPlaytime({ showUnlockModal: false })
    void persistCurrentProgress()

    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/(tabs)/games')
  }

  return (
    <AppScreen>
      <AchievementUnlockModal
        visible={achievementModalVisible}
        title={achievementModalTitle}
        description={achievementModalDescription}
        arcadeTopText="TIME ATTACK"
        arcadeLabel="20 SEC"
        arcadeBottomText="BONUS UNLOCK"
        onContinue={handleAchievementContinue}
      />

      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
          <ArrowLeft color={m4gTheme.colors.text} size={18} />
          <Text style={styles.backText}>Volver a Juegos</Text>
        </Pressable>

        <View style={styles.previewPill}>
          <Rocket color={m4gTheme.colors.lime} size={14} />
          <Text style={styles.previewText}>M4G ORIGINAL</Text>
        </View>
      </View>

      <LinearGradient
        colors={['#312e81', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroHeader}>
          <Text style={styles.eyebrow}>Juego destacado</Text>
          <Text style={styles.heroTitle}>GameClicker</Text>
          <Text style={styles.heroSubtitle}>
            La progresion ahora arranca mas lenta y la consola del boton cambia al subir de tier.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bits</Text>
            <Text style={styles.statValue}>{formatBits(bits)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Por toque</Text>
            <Text style={styles.statValue}>{formatBits(bitsPerTap)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Por segundo</Text>
            <Text style={styles.statValue}>{formatBits(passiveIncome)}</Text>
          </View>
        </View>

        <View style={[styles.syncCard, saveStatus === 'error' ? styles.syncCardError : null]}>
          <Text style={styles.syncTitle}>{saveStatusTitle}</Text>
          <Text style={styles.syncText}>{saveMessage}</Text>
        </View>
      </LinearGradient>

      <Pressable
        onPress={handleTap}
        style={({ pressed }) => [styles.clickerShell, pressed && styles.clickerShellPressed]}>
        <LinearGradient
          colors={activeConsole.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.clickerCore}>
          <View style={styles.clickerHeader}>
            <Gamepad2 color={m4gTheme.colors.white} size={18} />
            <Text style={styles.clickerHeaderText}>Consola activa</Text>
          </View>

          <ConsoleShowcase consoleItem={activeConsole} />

          <Text style={styles.clickerConsoleName}>{activeConsole.name}</Text>
          <Text style={styles.clickerTitle}>Toca para lanzar una nueva partida</Text>
          <Text style={styles.clickerGain}>+{formatBits(bitsPerTap)} bits</Text>
          <Text style={styles.clickerHint}>
            Combo x{comboMultiplier.toFixed(2)} | {formatBits(passiveIncome)} bits por segundo
          </Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.panelCopy}>
            <Text style={styles.panelTitle}>Consola activa</Text>
            <Text style={styles.panelSubtitle}>{activeConsole.flavor}</Text>
          </View>
          <View style={styles.consoleBadge}>
            <Cpu color={m4gTheme.colors.lime} size={16} />
            <Text style={styles.consoleBadgeText}>{activeConsole.name}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressToNext * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {nextConsole
            ? `Faltan ${formatBits(nextConsole.bits - lifetimeBits)} bits para desbloquear ${nextConsole.name}.`
            : 'Has desbloqueado todas las consolas de la coleccion actual.'}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mejoras</Text>
        <View style={styles.sectionPill}>
          <Zap color={m4gTheme.colors.amber} size={14} />
          <Text style={styles.sectionPillText}>Economia mas dura</Text>
        </View>
      </View>

      <View style={styles.upgradeList}>
        {upgrades.map((upgrade) => {
          const cost = getUpgradeCost(upgrade, owned[upgrade.id])
          const affordable = bits >= cost

          return (
            <View key={upgrade.id} style={styles.upgradeCard}>
              <View style={styles.upgradeMeta}>
                <Text style={styles.upgradeTitle}>{upgrade.title}</Text>
                <Text style={styles.upgradeDescription}>{upgrade.description}</Text>
              </View>

              <View style={styles.upgradeFooter}>
                <View style={styles.upgradeCopy}>
                  <Text style={styles.upgradeOwned}>Nivel {owned[upgrade.id]}</Text>
                  <Text style={styles.upgradeBoost}>
                    {upgrade.type === 'tap'
                      ? `+${upgrade.value} por toque`
                      : `+${upgrade.value} por segundo`}
                  </Text>
                </View>

                <Pressable
                  disabled={!affordable}
                  onPress={() => handleBuyUpgrade(upgrade)}
                  style={({ pressed }) => [
                    styles.buyButton,
                    !affordable && styles.buyButtonDisabled,
                    pressed && affordable && styles.buyButtonPressed,
                  ]}>
                  <Text style={styles.buyButtonText}>{formatBits(cost)} bits</Text>
                </Pressable>
              </View>
            </View>
          )
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Coleccion desbloqueada</Text>
        <Text style={styles.sectionSubtitle}>
          {unlockedConsoles.length} consolas conseguidas en esta partida
        </Text>
      </View>

      <View style={styles.consoleGrid}>
        {unlockedConsoles.map((consoleItem) => (
          <View key={consoleItem.id} style={styles.consoleCard}>
            <Text style={styles.consoleTitle}>{consoleItem.name}</Text>
            <Text style={styles.consoleText}>{consoleItem.flavor}</Text>
          </View>
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
  backButtonPressed: {
    opacity: 0.88,
  },
  backText: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  previewPill: {
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
  previewText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  hero: {
    borderRadius: m4gTheme.radii.xl,
    padding: m4gTheme.spacing.xl,
    gap: m4gTheme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.24)',
    ...m4gTheme.shadows.glow,
  },
  heroHeader: {
    gap: 10,
  },
  eyebrow: {
    color: m4gTheme.colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  heroSubtitle: {
    color: 'rgba(248, 250, 252, 0.85)',
    fontSize: 15,
    lineHeight: 23,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 96,
    borderRadius: m4gTheme.radii.md,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.34)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
    gap: 6,
  },
  statLabel: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    color: m4gTheme.colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  syncCard: {
    borderRadius: m4gTheme.radii.md,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.44)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
    gap: 6,
  },
  syncCardError: {
    borderColor: 'rgba(251, 113, 133, 0.4)',
    backgroundColor: 'rgba(127, 29, 29, 0.22)',
  },
  syncTitle: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  syncText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
  },
  clickerShell: {
    borderRadius: m4gTheme.radii.xl,
    overflow: 'hidden',
    ...m4gTheme.shadows.soft,
  },
  clickerShellPressed: {
    transform: [{ scale: 0.988 }],
  },
  clickerCore: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: m4gTheme.spacing.xl,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: 'rgba(190, 242, 100, 0.16)',
  },
  clickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clickerHeaderText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  consoleShowcase: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  consoleGrip: {
    position: 'absolute',
    top: '50%',
    marginTop: -44,
    borderRadius: 24,
    opacity: 0.9,
  },
  consoleGripLeft: {
    left: '50%',
    marginLeft: -122,
  },
  consoleGripRight: {
    right: '50%',
    marginRight: -122,
  },
  consoleBody: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
  },
  consoleTopBadge: {
    width: 64,
    height: 8,
    borderRadius: m4gTheme.radii.pill,
  },
  consoleScreen: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.24)',
  },
  consoleScreenLabel: {
    color: m4gTheme.colors.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  consoleControlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consoleDpad: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  consoleButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consoleButtonDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  consoleDock: {
    marginTop: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  clickerConsoleName: {
    color: m4gTheme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  clickerTitle: {
    color: m4gTheme.colors.textSoft,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  clickerGain: {
    color: m4gTheme.colors.lime,
    fontSize: 18,
    fontWeight: '800',
  },
  clickerHint: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    textAlign: 'center',
  },
  panel: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 14,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelCopy: {
    flex: 1,
  },
  panelTitle: {
    color: m4gTheme.colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  panelSubtitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  consoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(2, 6, 23, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(190, 242, 100, 0.18)',
  },
  consoleBadgeText: {
    color: m4gTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 14,
    borderRadius: m4gTheme.radii.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
  },
  progressFill: {
    height: '100%',
    borderRadius: m4gTheme.radii.pill,
    backgroundColor: m4gTheme.colors.limeStrong,
  },
  progressText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    color: m4gTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 13,
  },
  sectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  sectionPillText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  upgradeList: {
    gap: 14,
  },
  upgradeCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 14,
  },
  upgradeMeta: {
    gap: 8,
  },
  upgradeTitle: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  upgradeDescription: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  upgradeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  upgradeCopy: {
    flex: 1,
  },
  upgradeOwned: {
    color: m4gTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  upgradeBoost: {
    color: m4gTheme.colors.lime,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  buyButton: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: m4gTheme.colors.indigoStrong,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.14)',
  },
  buyButtonDisabled: {
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderColor: m4gTheme.colors.border,
  },
  buyButtonPressed: {
    opacity: 0.88,
  },
  buyButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  consoleGrid: {
    gap: 12,
  },
  consoleCard: {
    borderRadius: m4gTheme.radii.md,
    padding: m4gTheme.spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 8,
  },
  consoleTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  consoleText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
})

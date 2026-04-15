import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, Bot, RefreshCcw } from 'lucide-react-native'

import { AchievementUnlockModal } from '@/components/m4g/achievement-unlock-modal'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { ChessPieceIcon } from '@/src/features/chess/components/ChessPieceIcon'
import {
  applyChessMove,
  createInitialChessPosition,
  formatMoveHistory,
  getCapturedPieces,
  getGameStatus,
  getLegalMovesForSquare,
  getSquarePiece,
  isKingInCheck,
  isMoveTarget,
  pickBotMove,
  type ChessColor,
  type ChessPosition,
  type ChessSquare,
} from '@/src/features/chess/engine'
import { registerTrackedGamePlaytime } from '@/src/features/gameplay/services/playtimeTracking.service'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

const FILE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const DEMO_PLAYTIME_ACHIEVEMENT_SECONDS = 20
const PLAYTIME_SYNC_INTERVAL_MS = 5000

function areSquaresEqual(first: ChessSquare | null, second: ChessSquare | null) {
  if (!first || !second) {
    return false
  }

  return first.row === second.row && first.col === second.col
}

function findKingSquare(position: ChessPosition, color: ChessColor) {
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = getSquarePiece(position, row, col)

      if (piece?.color === color && piece.type === 'king') {
        return { row, col }
      }
    }
  }

  return null
}

export default function ChessBotPage() {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const [position, setPosition] = useState(() => createInitialChessPosition())
  const [selectedSquare, setSelectedSquare] = useState<ChessSquare | null>(null)
  const [isBotThinking, setIsBotThinking] = useState(false)
  const [achievementModalVisible, setAchievementModalVisible] = useState(false)
  const [achievementModalTitle, setAchievementModalTitle] = useState('Maraton de una hora')
  const [achievementModalDescription, setAchievementModalDescription] = useState(
    'Has desbloqueado un logro retro por aguantar una misma partida en movil.',
  )
  const activePlayStartedAtRef = useRef(Date.now())
  const currentSessionPlayedSecondsRef = useRef(0)
  const achievementPreviewShownRef = useRef(false)

  const boardSize = Math.min(width - m4gTheme.spacing.lg * 2, 376)
  const squareSize = boardSize / 8
  const gameStatus = useMemo(() => getGameStatus(position), [position])

  const selectedMoves = useMemo(() => {
    if (!selectedSquare) {
      return []
    }

    return getLegalMovesForSquare(position, selectedSquare.row, selectedSquare.col)
  }, [position, selectedSquare])

  const checkedKingSquare = useMemo(() => {
    if (gameStatus.kind !== 'check' && gameStatus.kind !== 'checkmate') {
      return null
    }

    return findKingSquare(position, position.turn)
  }, [gameStatus.kind, position])

  const whiteCaptured = useMemo(() => getCapturedPieces(position, 'white'), [position])
  const blackCaptured = useMemo(() => getCapturedPieces(position, 'black'), [position])
  const moveHistory = useMemo(() => formatMoveHistory(position.history, 8), [position.history])

  const turnLabel =
    gameStatus.kind === 'checkmate' || gameStatus.kind === 'stalemate'
      ? 'Partida finalizada'
      : position.turn === 'white'
        ? 'Tu turno'
        : isBotThinking
          ? 'Bot pensando'
          : 'Turno del bot'

  const canInteract =
    position.turn === 'white' &&
    !isBotThinking &&
    gameStatus.kind !== 'checkmate' &&
    gameStatus.kind !== 'stalemate'

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
        gameId: 'm4g-chess',
        gameTitle: 'M4G Chess',
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
            'Has desbloqueado un logro retro por aguantar una misma partida en movil.',
        )
      }
    } catch {
      // El registro de tiempo no debe bloquear la pantalla de juego.
    }
  }, [showAchievementUnlockModal])

  useEffect(() => {
    let cancelled = false

    if (
      position.turn !== 'black' ||
      gameStatus.kind === 'checkmate' ||
      gameStatus.kind === 'stalemate'
    ) {
      setIsBotThinking(false)
      return
    }

    setSelectedSquare(null)
    setIsBotThinking(true)

    const timer = setTimeout(() => {
      if (cancelled) {
        return
      }

      setPosition((current) => {
        if (current.turn !== 'black') {
          return current
        }

        const botMove = pickBotMove(current, 'black')
        return botMove ? applyChessMove(current, botMove) : current
      })
      setIsBotThinking(false)
    }, 140)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [gameStatus.kind, position])

  useEffect(() => {
    activePlayStartedAtRef.current = Date.now()

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        activePlayStartedAtRef.current = Date.now()
        return
      }

      void trackCurrentPlaytime({ showUnlockModal: false })
    })

    return () => {
      subscription.remove()
      void trackCurrentPlaytime({ showUnlockModal: false })
    }
  }, [trackCurrentPlaytime])

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
    if (!achievementModalVisible) {
      activePlayStartedAtRef.current = Date.now()
    }
  }, [achievementModalVisible])

  const handleAchievementContinue = () => {
    setAchievementModalVisible(false)
  }

  const handleBack = () => {
    void trackCurrentPlaytime({ showUnlockModal: false })

    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/(tabs)/games')
  }

  const handleRestart = () => {
    setSelectedSquare(null)
    setIsBotThinking(false)
    setPosition(createInitialChessPosition())
  }

  const handleSquarePress = (row: number, col: number) => {
    if (!canInteract) {
      return
    }

    const square = { row, col }
    const piece = getSquarePiece(position, row, col)

    if (areSquaresEqual(selectedSquare, square)) {
      setSelectedSquare(null)
      return
    }

    const selectedMove = selectedMoves.find((move) => isMoveTarget(move, square))

    if (selectedMove) {
      setPosition((current) => applyChessMove(current, selectedMove))
      setSelectedSquare(null)
      return
    }

    if (piece?.color === 'white') {
      setSelectedSquare(square)
      return
    }

    setSelectedSquare(null)
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
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={m4gTheme.colors.text} size={18} />
          <Text style={styles.backText}>Volver a Juegos</Text>
        </Pressable>
        <BrandWordmark compact />
      </View>

      <LinearGradient
        colors={['#312e81', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroBadge}>
          <Bot color={m4gTheme.colors.text} size={15} />
          <Text style={styles.heroBadgeText}>VS BOT</Text>
        </View>
        <Text style={styles.heroTitle}>M4G Chess</Text>
        <Text style={styles.heroText}>
          Ajedrez clasico dentro de la app, con tablero tactil, movimientos legales completos y un
          bot listo para responder cada turno.
        </Text>

        <View style={styles.heroActions}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Turno</Text>
            <Text style={styles.summaryValue}>{turnLabel}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Estado</Text>
            <Text style={styles.summaryValue}>{gameStatus.message}</Text>
          </View>
          <Pressable onPress={handleRestart} style={styles.restartButton}>
            <RefreshCcw color={m4gTheme.colors.text} size={16} />
            <Text style={styles.restartText}>Nueva partida</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.boardCard}>
        <View style={styles.boardHeader}>
          <View>
            <Text style={styles.boardTitle}>Tablero</Text>
            <Text style={styles.boardSubtitle}>
              Juegas con blancas. La coronacion convierte peones en reina automaticamente.
            </Text>
          </View>
          <View style={styles.boardMeta}>
            <Text style={styles.boardMetaText}>Movimiento {position.moveNumber}</Text>
            <Text style={styles.boardMetaText}>
              {isKingInCheck(position, 'white') ? 'Tu rey en jaque' : 'Posicion estable'}
            </Text>
          </View>
        </View>

        <View style={[styles.boardShell, { width: boardSize, height: boardSize }]}>
          {Array.from({ length: 8 }, (_, row) => (
            <View key={`row-${row}`} style={styles.boardRow}>
              {Array.from({ length: 8 }, (_, col) => {
                const square = { row, col }
                const piece = getSquarePiece(position, row, col)
                const targetMove = selectedMoves.find((move) => isMoveTarget(move, square))
                const isDark = (row + col) % 2 === 1
                const isSelected = areSquaresEqual(selectedSquare, square)
                const isLastMove =
                  Boolean(position.lastMove) &&
                  (areSquaresEqual(position.lastMove?.from ?? null, square) ||
                    areSquaresEqual(position.lastMove?.to ?? null, square))
                const isCheckedKing = areSquaresEqual(checkedKingSquare, square)
                const labelColor = isDark ? '#e2e8f0' : '#334155'

                return (
                  <Pressable
                    key={`${row}-${col}`}
                    onPress={() => handleSquarePress(row, col)}
                    style={[
                      styles.square,
                      {
                        width: squareSize,
                        height: squareSize,
                        backgroundColor: isDark ? '#475569' : '#cbd5e1',
                      },
                      isSelected && styles.squareSelected,
                      isLastMove && styles.squareLastMove,
                      isCheckedKing && styles.squareCheck,
                    ]}>
                    {col === 0 ? <Text style={[styles.rankLabel, { color: labelColor }]}>{8 - row}</Text> : null}
                    {row === 7 ? (
                      <Text style={[styles.fileLabel, { color: labelColor }]}>{FILE_LABELS[col]}</Text>
                    ) : null}

                    {targetMove ? (
                      <View
                        style={[
                          styles.moveHint,
                          targetMove.capturedPiece ? styles.moveHintCapture : styles.moveHintQuiet,
                        ]}
                      />
                    ) : null}

                    {piece ? (
                      <View style={styles.pieceWrap}>
                        <ChessPieceIcon
                          type={piece.type}
                          color={piece.color}
                          size={piece.type === 'pawn' ? squareSize * 0.7 : squareSize * 0.8}
                        />
                      </View>
                    ) : null}
                  </Pressable>
                )
              })}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Bot capturado</Text>
          <View style={styles.captureRow}>
            {blackCaptured.length ? (
              blackCaptured.map((pieceType, index) => (
                <View
                  key={`black-${pieceType}-${index}`}
                  style={[
                    styles.capturePiece,
                    pieceType === 'pawn' && styles.capturePiecePawn,
                  ]}>
                  <ChessPieceIcon type={pieceType} color="black" size={pieceType === 'pawn' ? 26 : 30} />
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>Sin piezas capturadas</Text>
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tus piezas capturadas</Text>
          <View style={styles.captureRow}>
            {whiteCaptured.length ? (
              whiteCaptured.map((pieceType, index) => (
                <View
                  key={`white-${pieceType}-${index}`}
                  style={[
                    styles.capturePiece,
                    pieceType === 'pawn' && styles.capturePiecePawn,
                  ]}>
                  <ChessPieceIcon type={pieceType} color="white" size={pieceType === 'pawn' ? 26 : 30} />
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>No has perdido material</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Ultimos movimientos</Text>
        {moveHistory.length ? (
          <View style={styles.historyRow}>
            {moveHistory.map((entry) => (
              <View key={entry} style={styles.historyChip}>
                <Text style={styles.historyText}>{entry}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.infoText}>La partida acaba de empezar.</Text>
        )}
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
  backText: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    borderRadius: m4gTheme.radii.xl,
    padding: m4gTheme.spacing.xl,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.24)',
    ...m4gTheme.shadows.glow,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.48)',
  },
  heroBadgeText: {
    color: m4gTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  heroText: {
    color: 'rgba(248, 250, 252, 0.88)',
    fontSize: 15,
    lineHeight: 23,
  },
  heroActions: {
    gap: 12,
  },
  summaryCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.44)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  summaryLabel: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  restartButton: {
    minHeight: 50,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: m4gTheme.colors.indigoStrong,
  },
  restartText: {
    color: m4gTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  boardCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 16,
  },
  boardHeader: {
    gap: 12,
  },
  boardTitle: {
    color: m4gTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  boardSubtitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  boardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  boardMetaText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: m4gTheme.radii.pill,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  boardShell: {
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  squareSelected: {
    borderWidth: 3,
    borderColor: m4gTheme.colors.indigoStrong,
  },
  squareLastMove: {
    backgroundColor: 'rgba(129, 140, 248, 0.4)',
  },
  squareCheck: {
    backgroundColor: 'rgba(251, 113, 133, 0.72)',
  },
  rankLabel: {
    position: 'absolute',
    top: 6,
    left: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  fileLabel: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  moveHint: {
    position: 'absolute',
  },
  moveHintQuiet: {
    height: 15,
    width: 15,
    borderRadius: 999,
    backgroundColor: 'rgba(79, 70, 229, 0.46)',
  },
  moveHintCapture: {
    height: '78%',
    width: '78%',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'rgba(79, 70, 229, 0.72)',
  },
  pieceWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 12,
  },
  infoTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  infoText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  captureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 28,
    alignItems: 'center',
  },
  capturePiece: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturePiecePawn: {
    width: 30,
    height: 30,
  },
  historyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  historyChip: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  historyText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
})

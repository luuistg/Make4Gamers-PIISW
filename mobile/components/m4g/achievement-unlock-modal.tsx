import { useEffect } from 'react'
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAudioPlayer } from 'expo-audio'
import * as Haptics from 'expo-haptics'
import { Gamepad2, Trophy } from 'lucide-react-native'

import { m4gTheme } from '@/constants/theme'

const pixelFontFamily = Platform.select({
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
})
const achievementBonusSound = require('../../assets/sounds/achievement-bonus.mp3')

type AchievementUnlockModalProps = {
  visible: boolean
  title: string
  description: string
  onContinue: () => void
  buttonLabel?: string
  arcadeTopText?: string
  arcadeLabel?: string
  arcadeBottomText?: string
}

export function AchievementUnlockModal({
  visible,
  title,
  description,
  onContinue,
  buttonLabel = 'Seguir jugando',
  arcadeTopText = 'INSERT COIN',
  arcadeLabel = 'NEW GAME',
  arcadeBottomText = 'PLAYER 1 READY',
}: AchievementUnlockModalProps) {
  const achievementSoundPlayer = useAudioPlayer(achievementBonusSound)

  useEffect(() => {
    const syncAchievementFeedback = async () => {
      if (!visible) {
        achievementSoundPlayer.pause()

        try {
          await achievementSoundPlayer.seekTo(0)
        } catch {
          // Si el player aun no esta listo, no bloqueamos la experiencia.
        }

        return
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      try {
        achievementSoundPlayer.pause()
        await achievementSoundPlayer.seekTo(0)
      } catch {
        // Si no puede reposicionarse, intentamos reproducir igualmente.
      }

      achievementSoundPlayer.play()
    }

    void syncAchievementFeedback()
  }, [visible, achievementSoundPlayer])

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onContinue}>
      <View style={styles.backdrop}>
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.98)', 'rgba(49, 46, 129, 0.96)', 'rgba(2, 6, 23, 0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <View style={styles.glow} />

          <View style={styles.header}>
            <View style={styles.trophyShell}>
              <Trophy color={m4gTheme.colors.amber} size={22} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Achievement Unlocked</Text>
              <Text style={styles.heading}>Nuevo logro</Text>
            </View>
            <View style={styles.scoreTag}>
              <Text style={styles.scoreText}>1UP</Text>
            </View>
          </View>

          <View style={styles.arcade}>
            <LinearGradient
              colors={['#1d4ed8', '#0f172a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.arcadeScreen}>
              <Text style={styles.arcadeTopText}>{arcadeTopText}</Text>
              <Text style={styles.arcadeLabel}>{arcadeLabel}</Text>
              <Text style={styles.arcadePoints}>{arcadeBottomText}</Text>
            </LinearGradient>
            <View style={styles.arcadeControls}>
              <View style={styles.dpad} />
              <View style={styles.buttons}>
                <View style={[styles.buttonDot, styles.buttonAmber]} />
                <View style={[styles.buttonDot, styles.buttonIndigo]} />
                <View style={[styles.buttonDot, styles.buttonLime]} />
              </View>
            </View>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.pixelsRow}>
            <View style={[styles.pixel, styles.pixelAmber]} />
            <View style={[styles.pixel, styles.pixelIndigo]} />
            <View style={[styles.pixel, styles.pixelLime]} />
            <View style={[styles.pixel, styles.pixelAmber]} />
            <View style={[styles.pixel, styles.pixelIndigo]} />
          </View>

          <Pressable
            onPress={onContinue}
            style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]}>
            <Gamepad2 color={m4gTheme.colors.text} size={16} />
            <Text style={styles.continueText}>{buttonLabel}</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.14)',
    overflow: 'hidden',
    gap: 18,
    ...m4gTheme.shadows.glow,
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -16,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyShell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.34)',
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    color: m4gTheme.colors.lime,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heading: {
    color: m4gTheme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  scoreTag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.34)',
  },
  scoreText: {
    color: m4gTheme.colors.text,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  arcade: {
    borderRadius: 24,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    gap: 12,
  },
  arcadeScreen: {
    borderRadius: 18,
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: 'rgba(248, 250, 252, 0.18)',
  },
  arcadeTopText: {
    color: m4gTheme.colors.amber,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: pixelFontFamily,
  },
  arcadeLabel: {
    color: m4gTheme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2.4,
    fontFamily: pixelFontFamily,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(165, 180, 252, 0.5)',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 0,
  },
  arcadePoints: {
    color: 'rgba(248, 250, 252, 0.88)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    fontFamily: pixelFontFamily,
  },
  arcadeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dpad: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(165, 180, 252, 0.72)',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  buttonAmber: {
    backgroundColor: m4gTheme.colors.amber,
  },
  buttonIndigo: {
    backgroundColor: m4gTheme.colors.indigo,
  },
  buttonLime: {
    backgroundColor: m4gTheme.colors.lime,
  },
  copyBlock: {
    gap: 8,
  },
  title: {
    color: m4gTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  description: {
    color: 'rgba(226, 232, 240, 0.84)',
    fontSize: 14,
    lineHeight: 22,
  },
  pixelsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pixel: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  pixelAmber: {
    backgroundColor: m4gTheme.colors.amber,
  },
  pixelIndigo: {
    backgroundColor: m4gTheme.colors.indigo,
  },
  pixelLime: {
    backgroundColor: m4gTheme.colors.lime,
  },
  continueButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: m4gTheme.colors.indigoStrong,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueButtonPressed: {
    opacity: 0.88,
  },
  continueText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
})

import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import type { FeaturePanel } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

type FeaturePanelProps = {
  panel: FeaturePanel
}

export function FeaturePanelCard({ panel }: FeaturePanelProps) {
  const isRight = panel.align === 'right'

  return (
    <View style={styles.card}>
      <View style={[styles.content, isRight && styles.contentRight]}>
        <LinearGradient
          colors={panel.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.media, isRight && styles.mediaRight]}>
          <Text style={styles.mediaLabel}>{panel.eyebrow}</Text>
          <View style={styles.mediaGlow} />
        </LinearGradient>

        <View style={styles.textWrap}>
          <Text style={styles.eyebrow}>{panel.eyebrow}</Text>
          <Text style={styles.title}>{panel.title}</Text>
          <Text style={styles.description}>{panel.description}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: m4gTheme.radii.lg,
    padding: 1,
    backgroundColor: m4gTheme.colors.border,
  },
  content: {
    gap: 16,
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.md,
    backgroundColor: m4gTheme.colors.card,
  },
  contentRight: {
    alignItems: 'flex-end',
  },
  media: {
    height: 150,
    width: '100%',
    borderRadius: m4gTheme.radii.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: m4gTheme.spacing.md,
  },
  mediaRight: {
    alignSelf: 'stretch',
  },
  mediaLabel: {
    color: m4gTheme.colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  mediaGlow: {
    position: 'absolute',
    top: 20,
    right: 16,
    height: 78,
    width: 78,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 250, 252, 0.14)',
  },
  textWrap: {
    gap: 10,
  },
  eyebrow: {
    color: m4gTheme.colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: m4gTheme.colors.text,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 28,
  },
  description: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
})

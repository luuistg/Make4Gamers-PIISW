import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'expo-image'

import type { FeaturePanel } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

type FeaturePanelProps = {
  panel: FeaturePanel
}

export function FeaturePanelCard({ panel }: FeaturePanelProps) {
  const isRight = panel.align === 'right'
  const isCover = panel.variant === 'cover'

  return (
    <View style={[styles.card, isCover && styles.coverCard]}>
      <View style={[styles.content, isRight && styles.contentRight, isCover && styles.coverContent]}>
        <View style={[styles.media, isRight && styles.mediaRight, isCover && styles.coverMedia]}>
          <Image source={panel.image} contentFit="cover" style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={panel.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['rgba(2, 6, 23, 0)', 'rgba(2, 6, 23, 0.82)']}
            locations={[0.18, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[styles.mediaBadge, isCover && styles.coverBadge]}>
            <Text style={styles.mediaLabel}>{panel.eyebrow}</Text>
          </View>
          {isCover ? (
            <View style={styles.coverHeroCopy}>
              <Text style={styles.coverHeroTitle}>Ahora en foco</Text>
              <Text style={styles.coverHeroText}>La portada se mueve con actividad real.</Text>
            </View>
          ) : null}
          <View style={styles.mediaGlow} />
        </View>

        <View style={[styles.textWrap, isCover && styles.coverTextWrap]}>
          <Text style={styles.eyebrow}>{panel.eyebrow}</Text>
          <Text style={[styles.title, isCover && styles.coverTitle]}>{panel.title}</Text>
          <Text style={styles.description}>{panel.description}</Text>
          {panel.highlights?.length ? (
            <View style={styles.highlightRow}>
              {panel.highlights.map((highlight) => (
                <View key={highlight} style={styles.highlightChip}>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {panel.stats?.length ? (
            <View style={styles.statsRow}>
              {panel.stats.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          ) : null}
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
  coverCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.24)',
  },
  content: {
    gap: 16,
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.md,
    backgroundColor: m4gTheme.colors.card,
  },
  coverContent: {
    padding: m4gTheme.spacing.lg,
    gap: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
  },
  contentRight: {
    alignItems: 'flex-end',
  },
  media: {
    height: 170,
    width: '100%',
    borderRadius: m4gTheme.radii.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: m4gTheme.spacing.md,
    backgroundColor: m4gTheme.colors.backgroundElevated,
  },
  coverMedia: {
    height: 224,
    justifyContent: 'space-between',
    padding: m4gTheme.spacing.lg,
  },
  mediaRight: {
    alignSelf: 'stretch',
  },
  mediaBadge: {
    alignSelf: 'flex-start',
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(2, 6, 23, 0.54)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
  },
  coverBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.22)',
    borderColor: 'rgba(129, 140, 248, 0.34)',
  },
  mediaLabel: {
    color: m4gTheme.colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    zIndex: 1,
  },
  coverHeroCopy: {
    gap: 6,
    zIndex: 1,
  },
  coverHeroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1.2,
    lineHeight: 34,
    maxWidth: 220,
  },
  coverHeroText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 220,
  },
  mediaGlow: {
    position: 'absolute',
    top: 20,
    right: 16,
    height: 84,
    width: 84,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 250, 252, 0.12)',
  },
  textWrap: {
    gap: 10,
  },
  coverTextWrap: {
    gap: 12,
  },
  eyebrow: {
    color: m4gTheme.colors.indigo,
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
  coverTitle: {
    fontSize: 25,
    lineHeight: 31,
  },
  description: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightChip: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.22)',
  },
  highlightText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: m4gTheme.radii.md,
    padding: 12,
    backgroundColor: 'rgba(2, 6, 23, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)',
    gap: 4,
  },
  statValue: {
    color: m4gTheme.colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  statLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
})

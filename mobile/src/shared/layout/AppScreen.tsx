import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

import { m4gTheme } from '@/src/shared/theme'

type AppScreenProps = {
  children: ReactNode
  contentContainerStyle?: StyleProp<ViewStyle>
  scrollable?: boolean
}

export function AppScreen({
  children,
  contentContainerStyle,
  scrollable = true,
}: AppScreenProps) {
  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, contentContainerStyle]}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentContainerStyle]}>{children}</View>
  )

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.12)', 'rgba(2, 6, 23, 0)']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.indigoGlow} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {content}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: m4gTheme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: m4gTheme.spacing.lg,
    paddingTop: m4gTheme.spacing.md,
    paddingBottom: 124,
    gap: m4gTheme.spacing.lg,
  },
  indigoGlow: {
    position: 'absolute',
    top: 20,
    right: -60,
    height: 180,
    width: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
})

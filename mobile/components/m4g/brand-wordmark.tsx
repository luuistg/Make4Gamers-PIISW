import { StyleSheet, Text, View } from 'react-native'

import { m4gTheme } from '@/constants/theme'
import { LogoMark } from '@/components/m4g/logo-mark'

type BrandWordmarkProps = {
  compact?: boolean
}

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, compact && styles.iconWrapCompact]}>
        <LogoMark color={m4gTheme.colors.indigo} size={compact ? 60 : 50} />
      </View>
      <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>
        Made
        <Text style={styles.wordmarkAccent}>4Gamers</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    height: 48,
    width: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.34)',
  },
  iconWrapCompact: {
    height: 32,
    width: 32,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  wordmark: {
    color: m4gTheme.colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  wordmarkCompact: {
    fontSize: 20,
  },
  wordmarkAccent: {
    color: m4gTheme.colors.indigo,
  },
})

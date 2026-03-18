import { Pressable, StyleSheet, Text } from 'react-native'

import { m4gTheme } from '@/constants/theme'

type CategoryChipProps = {
  label: string
  active?: boolean
  onPress: () => void
}

export function CategoryChip({ label, active = false, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  chipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.22)',
    borderColor: m4gTheme.colors.borderStrong,
  },
  chipPressed: {
    opacity: 0.86,
  },
  label: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  labelActive: {
    color: m4gTheme.colors.white,
  },
})

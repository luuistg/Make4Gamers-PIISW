import { DarkTheme, type Theme } from '@react-navigation/native'

export const m4gTheme = {
  colors: {
    background: '#020617',
    backgroundSoft: '#0f172a',
    backgroundElevated: '#111c34',
    card: 'rgba(15, 23, 42, 0.94)',
    cardStrong: '#16213d',
    border: 'rgba(148, 163, 184, 0.18)',
    borderStrong: 'rgba(129, 140, 248, 0.45)',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSoft: '#cbd5e1',
    indigo: '#6366f1',
    indigoStrong: '#4f46e5',
    lime: '#bef264',
    limeStrong: '#84cc16',
    fuchsia: '#e879f9',
    amber: '#fbbf24',
    danger: '#fb7185',
    overlay: 'rgba(2, 6, 23, 0.72)',
    white: '#ffffff',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    pill: 999,
  },
  shadows: {
    glow: {
      shadowColor: '#312e81',
      shadowOpacity: 0.35,
      shadowRadius: 28,
      shadowOffset: {
        width: 0,
        height: 18,
      },
      elevation: 16,
    },
    soft: {
      shadowColor: '#000000',
      shadowOpacity: 0.22,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      elevation: 10,
    },
  },
} as const

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: m4gTheme.colors.indigo,
    background: m4gTheme.colors.background,
    card: m4gTheme.colors.card,
    text: m4gTheme.colors.text,
    border: m4gTheme.colors.border,
    notification: m4gTheme.colors.lime,
  },
}

export const Colors = {
  light: {
    text: '#111827',
    background: '#ffffff',
    tint: m4gTheme.colors.indigo,
    icon: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: m4gTheme.colors.indigo,
  },
  dark: {
    text: m4gTheme.colors.text,
    background: m4gTheme.colors.background,
    tint: m4gTheme.colors.lime,
    icon: m4gTheme.colors.textMuted,
    tabIconDefault: m4gTheme.colors.textMuted,
    tabIconSelected: m4gTheme.colors.lime,
  },
}

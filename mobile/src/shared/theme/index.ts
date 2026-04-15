import { DarkTheme, type Theme } from '@react-navigation/native'

export const m4gTheme = {
  colors: {
    background: '#020617',
    backgroundSoft: '#020617',
    backgroundElevated: '#0f172a',
    card: '#0f172a',
    cardStrong: '#111827',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(99, 102, 241, 0.34)',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSoft: '#e2e8f0',
    indigo: '#6366f1',
    indigoStrong: '#4f46e5',
    lime: '#a5b4fc',
    limeStrong: '#6366f1',
    fuchsia: '#818cf8',
    amber: '#fbbf24',
    danger: '#fb7185',
    overlay: 'rgba(2, 6, 23, 0.84)',
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
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      elevation: 10,
    },
    soft: {
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 8,
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
    notification: m4gTheme.colors.indigo,
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
    tint: m4gTheme.colors.indigo,
    icon: m4gTheme.colors.textMuted,
    tabIconDefault: m4gTheme.colors.textMuted,
    tabIconSelected: m4gTheme.colors.indigo,
  },
}

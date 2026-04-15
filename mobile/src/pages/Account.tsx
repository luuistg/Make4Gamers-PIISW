import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { ArrowRight, LogOut, ShieldCheck, Trophy, UserRound } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { SectionHeading } from '@/components/m4g/section-heading'
import { useCurrentUserAchievements } from '@/src/features/achievements/hooks/useCurrentUserAchievements'
import { accountHighlights } from '@/src/features/auth/data/account-highlights'
import {
  getAuthenticatedUser,
  isAuthConfigured,
  logout,
  subscribeToAuthState,
} from '@/src/features/auth/services/auth.service'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const {
    achievements,
    loading: achievementsLoading,
    error: achievementsError,
  } = useCurrentUserAchievements({
    enabled: !!user,
    platformScope: 'mobile',
  })

  useEffect(() => {
    let mounted = true

    const syncUser = async () => {
      try {
        const currentUser = await getAuthenticatedUser()

        if (!mounted) {
          return
        }

        setUser(currentUser)
        setAuthError(null)
      } catch (error) {
        if (!mounted) {
          return
        }

        setAuthError(error instanceof Error ? error.message : 'No se pudo recuperar la sesion')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    syncUser()

    const {
      data: { subscription },
    } = subscribeToAuthState((_event, session) => {
      if (!mounted) {
        return
      }

      setUser(session?.user ?? null)
      setLoading(false)
      setAuthError(null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    setLogoutLoading(true)

    try {
      await logout()
      setUser(null)
      setAuthError(null)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'No se pudo cerrar la sesion')
    } finally {
      setLogoutLoading(false)
    }
  }

  const profileName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.username as string | undefined) ||
    'Jugador'
  const authEnabled = isAuthConfigured()
  const heroTitle = loading
    ? 'Comprobando tu cuenta'
    : user
      ? `Hola, ${profileName}`
      : 'Cuenta y autenticacion'
  const heroText = !authEnabled
    ? 'Configura las variables publicas de Supabase en Expo para activar login y registro.'
    : loading
      ? 'Recuperando la sesion guardada en el dispositivo.'
      : user
        ? 'Tu sesion esta activa y ahora tambien puede guardar logros de plataforma desde movil.'
        : 'Reune acceso, perfil y gestion de cuenta dentro de un mismo espacio pensado para seguir tu actividad como jugador.'

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
      </View>

      <LinearGradient
        colors={['rgba(79, 70, 229, 0.3)', 'rgba(15, 23, 42, 0.92)', 'rgba(2, 6, 23, 0.98)']}
        style={styles.hero}>
        <View style={styles.heroIcon}>
          <UserRound color={m4gTheme.colors.text} size={26} />
        </View>
        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroText}>{heroText}</Text>
        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
        <View style={styles.heroActions}>
          {user ? (
            <>
              <Link href="/games" asChild>
                <Pressable style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Ir a juegos</Text>
                  <ArrowRight color={m4gTheme.colors.text} size={16} />
                </Pressable>
              </Link>
              <Pressable
                onPress={handleLogout}
                disabled={logoutLoading}
                style={[styles.secondaryButton, logoutLoading ? styles.disabledButton : null]}>
                <Text style={styles.secondaryButtonText}>
                  {logoutLoading ? 'Cerrando...' : 'Cerrar sesion'}
                </Text>
                <LogOut color={m4gTheme.colors.textSoft} size={16} />
              </Pressable>
            </>
          ) : (
            <>
              <Link href="/login" asChild>
                <Pressable style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Entrar</Text>
                  <ArrowRight color={m4gTheme.colors.text} size={16} />
                </Pressable>
              </Link>
              <Link href="/register" asChild>
                <Pressable style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
                </Pressable>
              </Link>
            </>
          )}
        </View>
      </LinearGradient>

      <SectionHeading
        title="Tu espacio"
        subtitle={
          user
            ? 'Resumen de la sesion actual y de los datos sincronizados desde autenticacion.'
            : 'Acceso, perfil y contexto general de la cuenta reunidos en una sola vista.'
        }
      />

      <View style={styles.stack}>
        {user ? (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Correo</Text>
              <Text style={styles.infoText}>{user.email ?? 'Sin email disponible'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Usuario</Text>
              <Text style={styles.infoText}>
                {(user.user_metadata?.username as string | undefined) ?? 'Sin nombre de usuario'}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Estado</Text>
              <Text style={styles.infoText}>Sesion persistida en el dispositivo</Text>
            </View>
          </>
        ) : (
          accountHighlights.map((item) => (
            <View key={item.id} style={styles.infoCard}>
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoText}>{item.description}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.checklist}>
        <View style={styles.checkHeader}>
          <ShieldCheck color={m4gTheme.colors.lime} size={20} />
          <Text style={styles.checkTitle}>Resumen de cuenta</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Back end de auth:</Text>
          <Text style={styles.checkValue}>{authEnabled ? 'conectado' : 'sin configurar'}</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Sesion actual:</Text>
          <Text style={styles.checkValue}>
            {loading ? 'cargando' : user ? 'autenticado' : 'sin iniciar sesion'}
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Perfil de jugador:</Text>
          <Text style={styles.checkValue}>{user ? 'activo' : 'disponible'}</Text>
        </View>
        {user ? (
          <View style={styles.checkItem}>
            <Text style={styles.checkLabel}>Logros en movil:</Text>
            <Text style={styles.checkValue}>
              {achievementsLoading ? 'cargando' : String(achievements.length)}
            </Text>
          </View>
        ) : null}
        {user ? (
          <View style={styles.checkItem}>
            <Text style={styles.checkLabel}>Usuario sincronizado:</Text>
            <Text style={styles.checkValue}>
              {(user.user_metadata?.username as string | undefined) ?? 'sin alias'}
            </Text>
          </View>
        ) : null}
      </View>

      {user ? (
        <Link href="/achievements" asChild>
          <Pressable style={({ pressed }) => [styles.achievementsShortcut, pressed && styles.pressedCard]}>
            <View style={styles.achievementsHeader}>
              <View style={styles.achievementsIcon}>
                <Trophy color={m4gTheme.colors.amber} size={18} />
              </View>
              <View style={styles.achievementsCopy}>
                <Text style={styles.achievementsTitle}>Logros</Text>
                <Text style={styles.achievementsSubtitle}>
                  Abrelos en una pantalla propia para no sobrecargar el perfil conforme crezca tu
                  coleccion.
                </Text>
              </View>
              <ArrowRight color={m4gTheme.colors.text} size={18} />
            </View>

            <View style={styles.achievementSummaryRow}>
              <View style={styles.achievementSummaryPill}>
                <Text style={styles.achievementSummaryLabel}>Movil</Text>
                <Text style={styles.achievementSummaryValue}>
                  {achievementsLoading ? '...' : String(achievements.length)}
                </Text>
              </View>
              <Text style={styles.achievementSummaryText}>
                {achievementsError
                  ? achievementsError
                  : achievements.length > 0
                    ? 'Tu historial ya tiene logros guardados y listos para enseñar.'
                    : 'Todavia no tienes logros desbloqueados. Tu primero aparecera aqui.'}
              </Text>
            </View>
          </Pressable>
        </Link>
      ) : null}
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hero: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    gap: 12,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  heroIcon: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.52)',
  },
  heroTitle: {
    color: m4gTheme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  errorText: {
    color: m4gTheme.colors.danger,
    fontSize: 13,
    lineHeight: 20,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: m4gTheme.colors.indigoStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 15,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedCard: {
    opacity: 0.92,
  },
  stack: {
    gap: 12,
  },
  infoCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 8,
  },
  infoTitle: {
    color: m4gTheme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  infoText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  checklist: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 14,
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  checkLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
  },
  checkValue: {
    color: m4gTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  achievementsCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 16,
  },
  achievementsShortcut: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementsIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
  },
  achievementsCopy: {
    flex: 1,
    gap: 4,
  },
  achievementsTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  achievementsSubtitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  achievementSummaryRow: {
    gap: 12,
  },
  achievementSummaryPill: {
    alignSelf: 'flex-start',
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementSummaryLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementSummaryValue: {
    color: m4gTheme.colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  achievementSummaryText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
})

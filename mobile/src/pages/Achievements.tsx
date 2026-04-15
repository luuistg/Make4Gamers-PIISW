import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import { ArrowLeft, ArrowRight, CalendarDays, Trophy } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { SectionHeading } from '@/components/m4g/section-heading'
import { useCurrentUserAchievements } from '@/src/features/achievements/hooks/useCurrentUserAchievements'
import {
  getAuthenticatedUser,
  subscribeToAuthState,
} from '@/src/features/auth/services/auth.service'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

function formatAchievementDate(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Fecha no disponible'
  }

  return parsedDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(true)

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
      } finally {
        if (mounted) {
          setUserLoading(false)
        }
      }
    }

    void syncUser()

    const {
      data: { subscription },
    } = subscribeToAuthState((_event, session) => {
      if (!mounted) {
        return
      }

      setUser(session?.user ?? null)
      setUserLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const heroTitle = user
    ? `${achievements.length} logros desbloqueados`
    : userLoading
      ? 'Cargando tus logros'
      : 'Tus logros de plataforma'

  const heroText = user
    ? 'Aqui vive el historial completo de insignias desbloqueadas desde movil, separado del perfil para que la cuenta siga respirando bien.'
    : userLoading
      ? 'Estamos recuperando tu cuenta para comprobar los logros disponibles.'
      : 'Inicia sesion para ver los logros guardados en Supabase y seguir ampliando tu coleccion.'

  const recentAchievement = useMemo(() => achievements[0] ?? null, [achievements])

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace('/account')
  }

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={m4gTheme.colors.text} size={18} />
          <Text style={styles.backText}>Cuenta</Text>
        </Pressable>
        <BrandWordmark compact />
      </View>

      <LinearGradient
        colors={['rgba(79, 70, 229, 0.34)', 'rgba(15, 23, 42, 0.96)', 'rgba(2, 6, 23, 0.98)']}
        style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroIcon}>
            <Trophy color={m4gTheme.colors.amber} size={24} />
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>MOBILE ACHIEVEMENTS</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroText}>{heroText}</Text>

        {user && recentAchievement ? (
          <View style={styles.heroHighlight}>
            <Text style={styles.heroHighlightLabel}>Ultimo desbloqueado</Text>
            <Text style={styles.heroHighlightTitle}>{recentAchievement.achievement.title}</Text>
            <Text style={styles.heroHighlightText}>
              {formatAchievementDate(recentAchievement.unlocked_at)}
            </Text>
          </View>
        ) : null}
      </LinearGradient>

      <SectionHeading
        title="Coleccion"
        subtitle={
          user
            ? 'Cada logro queda ligado a tu usuario y se refresca al volver a esta pantalla.'
            : 'La pantalla esta preparada para crecer con mas logros sin saturar el perfil.'
        }
      />

      {userLoading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Cargando logros</Text>
          <Text style={styles.emptyText}>
            Estamos recuperando tu cuenta para preparar la coleccion de insignias.
          </Text>
        </View>
      ) : !user ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Inicia sesion para ver tus logros</Text>
          <Text style={styles.emptyText}>
            Cuando desbloquees hitos desde el movil, apareceran aqui de forma ordenada y sin
            recargar la pantalla de cuenta.
          </Text>
          <Link href="/login" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
              <ArrowRight color={m4gTheme.colors.text} size={16} />
            </Pressable>
          </Link>
        </View>
      ) : achievementsLoading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Cargando logros</Text>
          <Text style={styles.emptyText}>Estamos sincronizando tu coleccion desde Supabase.</Text>
        </View>
      ) : achievementsError ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No se pudieron cargar</Text>
          <Text style={styles.emptyText}>{achievementsError}</Text>
        </View>
      ) : achievements.length > 0 ? (
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementRow}>
                <View style={styles.achievementIcon}>
                  <Trophy color={m4gTheme.colors.amber} size={18} />
                </View>
                <View style={styles.achievementCopy}>
                  <Text style={styles.achievementTitle}>{achievement.achievement.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.achievement.description}
                  </Text>
                </View>
              </View>

              <View style={styles.achievementMeta}>
                <CalendarDays color={m4gTheme.colors.lime} size={14} />
                <Text style={styles.achievementMetaText}>
                  Desbloqueado el {formatAchievementDate(achievement.unlocked_at)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Todavia no tienes logros</Text>
          <Text style={styles.emptyText}>
            Entra en tu primer juego desde el movil y volveras aqui con la primera insignia
            guardada.
          </Text>
        </View>
      )}
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
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    gap: 14,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroIcon: {
    height: 56,
    width: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.52)',
  },
  heroBadge: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  heroBadgeText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
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
  heroHighlight: {
    borderRadius: m4gTheme.radii.md,
    padding: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
    gap: 4,
  },
  heroHighlightLabel: {
    color: m4gTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroHighlightTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  heroHighlightText: {
    color: m4gTheme.colors.lime,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 10,
  },
  emptyTitle: {
    color: m4gTheme.colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  emptyText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: m4gTheme.colors.indigoStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  primaryButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  achievementsList: {
    gap: 14,
  },
  achievementItem: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.lg,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 14,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  achievementIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
  },
  achievementCopy: {
    flex: 1,
    gap: 6,
  },
  achievementTitle: {
    color: m4gTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  achievementDescription: {
    color: m4gTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementMetaText: {
    color: m4gTheme.colors.lime,
    fontSize: 13,
    fontWeight: '700',
  },
})

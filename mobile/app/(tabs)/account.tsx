import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { ArrowRight, ShieldCheck, UserRound } from 'lucide-react-native'

import { AppScreen } from '@/components/m4g/app-screen'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { SectionHeading } from '@/components/m4g/section-heading'
import { accountHighlights } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

export default function AccountScreen() {
  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>SIN BACKEND</Text>
        </View>
      </View>

      <LinearGradient
        colors={['rgba(79, 70, 229, 0.3)', 'rgba(15, 23, 42, 0.92)', 'rgba(2, 6, 23, 0.98)']}
        style={styles.hero}>
        <View style={styles.heroIcon}>
          <UserRound color={m4gTheme.colors.text} size={26} />
        </View>
        <Text style={styles.heroTitle}>Cuenta y autenticacion</Text>
        <Text style={styles.heroText}>
          La experiencia visual ya existe. En esta fase las pantallas de acceso son solo maqueta, sin Supabase ni sesiones reales.
        </Text>
        <View style={styles.heroActions}>
          <Link href="/login" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Ir a login</Text>
              <ArrowRight color={m4gTheme.colors.text} size={16} />
            </Pressable>
          </Link>
          <Link href="/register" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Registro</Text>
            </Pressable>
          </Link>
        </View>
      </LinearGradient>

      <SectionHeading
        title="Cimientos del proyecto"
        subtitle="Esta pantalla resume justo lo que estamos construyendo ahora: estructura, estilo y puntos de extension."
      />

      <View style={styles.stack}>
        {accountHighlights.map((item) => (
          <View key={item.id} style={styles.infoCard}>
            <Text style={styles.infoTitle}>{item.title}</Text>
            <Text style={styles.infoText}>{item.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.checklist}>
        <View style={styles.checkHeader}>
          <ShieldCheck color={m4gTheme.colors.lime} size={20} />
          <Text style={styles.checkTitle}>Estado de la app movil</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Tema y navegacion:</Text>
          <Text style={styles.checkValue}>listos</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Pantallas base:</Text>
          <Text style={styles.checkValue}>listas</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Backend y juego:</Text>
          <Text style={styles.checkValue}>pendiente por decision</Text>
        </View>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  statusPillText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
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
  },
  secondaryButtonText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 15,
    fontWeight: '800',
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
})

import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Link } from 'expo-router'
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react-native'

import { AppScreen } from '@/components/m4g/app-screen'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { m4gTheme } from '@/constants/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handlePlaceholderPress = () => {
    Alert.alert(
      'Frontend listo',
      'La capa visual de login ya esta preparada. Conectaremos Supabase en la siguiente fase.',
    )
  }

  return (
    <AppScreen>
      <Link href="/account" asChild>
        <Pressable style={styles.backButton}>
          <ArrowLeft color={m4gTheme.colors.text} size={18} />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </Link>

      <View style={styles.header}>
        <BrandWordmark />
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>
          Esta pantalla replica la intencion del login web, pero sin autenticar todavia.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Correo</Text>
          <View style={styles.inputShell}>
            <Mail color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={m4gTheme.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contrasena</Text>
          <View style={styles.inputShell}>
            <LockKeyhole color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contrasena"
              placeholderTextColor={m4gTheme.colors.textMuted}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        <Pressable onPress={handlePlaceholderPress} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </Pressable>

        <Text style={styles.helperText}>
          Solo front-end. Los estados de carga, error y exito se conectaran cuando entremos en backend.
        </Text>
      </View>

      <Link href="/register" asChild>
        <Pressable style={styles.swapLink}>
          <Text style={styles.swapText}>No tienes cuenta todavia? Registrate</Text>
        </Pressable>
      </Link>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  backText: {
    color: m4gTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    gap: 10,
  },
  title: {
    color: m4gTheme.colors.text,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    color: m4gTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  card: {
    borderRadius: m4gTheme.radii.xl,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: m4gTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.56)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)',
  },
  input: {
    flex: 1,
    color: m4gTheme.colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: m4gTheme.colors.indigoStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  helperText: {
    color: m4gTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  swapLink: {
    alignSelf: 'center',
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  swapText: {
    color: m4gTheme.colors.lime,
    fontSize: 14,
    fontWeight: '700',
  },
})

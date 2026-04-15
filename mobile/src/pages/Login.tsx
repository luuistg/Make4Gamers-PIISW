import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { AlertCircle, ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { loginWithEmail } from '@/src/features/auth/services/auth.service'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginErrors = {
  email?: string
  password?: string
  auth?: string
}

function mapLoginError(message: string) {
  const normalizedMessage = message.toLowerCase()

  if (message === 'Invalid login credentials') {
    return 'Credenciales incorrectas, revisa los campos'
  }

  if (normalizedMessage.includes('email not confirmed')) {
    return 'Tu cuenta existe pero aun no esta confirmada. Revisa el correo de verificacion antes de iniciar sesion.'
  }

  return message
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const validateForm = () => {
    const nextErrors: LoginErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'El email es obligatorio'
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Email no valido'
    }

    if (!formData.password) {
      nextErrors.password = 'La contrasena es obligatoria'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    if (errors[field] || errors.auth) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
        auth: undefined,
      }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await loginWithEmail(formData.email.trim(), formData.password)

      if (error) {
        setErrors({
          auth: mapLoginError(error.message),
        })
        return
      }

      if (data.user) {
        router.replace('/account')
      }
    } catch (error) {
      setErrors({
        auth: error instanceof Error ? error.message : 'Ocurrio un error inesperado',
      })
    } finally {
      setLoading(false)
    }
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
          Accede a tu perfil, tus partidas y tu actividad con el mismo flujo de autenticacion que
          ya funciona en web.
        </Text>
      </View>

      <View style={styles.card}>
        {errors.auth ? (
          <View style={styles.errorBanner}>
            <AlertCircle color={m4gTheme.colors.danger} size={18} />
            <Text style={styles.errorBannerText}>{errors.auth}</Text>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>Correo</Text>
          <View style={[styles.inputShell, errors.email ? styles.inputShellError : null]}>
            <Mail color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="tu@email.com"
              placeholderTextColor={m4gTheme.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              editable={!loading}
              style={styles.input}
            />
          </View>
          {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contrasena</Text>
          <View style={[styles.inputShell, errors.password ? styles.inputShellError : null]}>
            <LockKeyhole color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="Tu contrasena"
              placeholderTextColor={m4gTheme.colors.textMuted}
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              editable={!loading}
              style={styles.input}
            />
            <Pressable onPress={() => setShowPassword((current) => !current)} hitSlop={8}>
              {showPassword ? (
                <EyeOff color={m4gTheme.colors.textMuted} size={18} />
              ) : (
                <Eye color={m4gTheme.colors.textMuted} size={18} />
              )}
            </Pressable>
          </View>
          {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.primaryButton, loading ? styles.primaryButtonDisabled : null]}>
          <Text style={styles.primaryButtonText}>{loading ? 'Cargando...' : 'Entrar'}</Text>
        </Pressable>

        <Text style={styles.helperText}>
          La sesion se guarda en el dispositivo para recuperar el acceso del jugador en siguientes
          aperturas.
        </Text>
      </View>

      <Link href="/register" asChild>
        <Pressable style={styles.swapLink}>
          <Text style={styles.swapText}>No tienes cuenta? Registrate</Text>
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
  inputShellError: {
    borderColor: 'rgba(251, 113, 133, 0.7)',
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: m4gTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(251, 113, 133, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.34)',
  },
  errorBannerText: {
    flex: 1,
    color: m4gTheme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  fieldError: {
    color: m4gTheme.colors.danger,
    fontSize: 12,
    lineHeight: 18,
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

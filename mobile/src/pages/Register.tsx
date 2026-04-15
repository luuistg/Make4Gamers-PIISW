import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { AlertCircle, ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { registerWithEmail } from '@/src/features/auth/services/auth.service'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type RegisterErrors = {
  fullName?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

function mapRegisterError(message: string): RegisterErrors {
  const normalizedMessage = message.toLowerCase()

  if (message.includes('profiles_pkey')) {
    return {
      form: 'Este usuario ya tiene un perfil creado. Intenta con otro correo.',
    }
  }

  if (normalizedMessage.includes('user already registered')) {
    return {
      form: 'Ese correo ya esta registrado. Si acabas de crear la cuenta, revisa tu email para confirmarla o entra desde login.',
    }
  }

  if (normalizedMessage.includes('username')) {
    return {
      username: 'Este nombre de usuario ya esta en uso.',
    }
  }

  return {
    form: message,
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  const handleChange = (
    field: 'fullName' | 'username' | 'email' | 'password' | 'confirmPassword',
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    if (errors[field] || errors.form) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
        form: undefined,
      }))
    }
  }

  const validateForm = () => {
    const nextErrors: RegisterErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'El nombre es obligatorio'
    }

    if (!formData.username.trim()) {
      nextErrors.username = 'El nombre de usuario es obligatorio'
    } else if (formData.username.trim().length < 3) {
      nextErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'El email es obligatorio'
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Email no valido'
    }

    if (!formData.password) {
      nextErrors.password = 'La contrasena es obligatoria'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'La contrasena debe tener al menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'La confirmacion de contrasena es obligatoria'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})
    setIsSuccess(false)

    try {
      const { data, error } = await registerWithEmail({
        email: formData.email.trim(),
        password: formData.password,
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
      })

      if (error) {
        throw error
      }

      if (data.user) {
        setIsSuccess(true)
        redirectTimeoutRef.current = setTimeout(() => {
          router.replace('/login')
        }, 3000)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrio un error inesperado'
      setErrors(mapRegisterError(message))
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
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Crea tu perfil con el mismo backend de autenticacion que ya usa la experiencia web.
        </Text>
      </View>

      <View style={styles.card}>
        {isSuccess ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>
              Registro exitoso. Revisa tu correo electronico para confirmar tu cuenta.
            </Text>
          </View>
        ) : null}

        {errors.form ? (
          <View style={styles.errorBanner}>
            <AlertCircle color={m4gTheme.colors.danger} size={18} />
            <Text style={styles.errorBannerText}>{errors.form}</Text>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <View style={[styles.inputShell, errors.fullName ? styles.inputShellError : null]}>
            <UserRound color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={formData.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
              placeholder="Tu nombre"
              placeholderTextColor={m4gTheme.colors.textMuted}
              editable={!loading}
              style={styles.input}
            />
          </View>
          {errors.fullName ? <Text style={styles.fieldError}>{errors.fullName}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Usuario</Text>
          <View style={[styles.inputShell, errors.username ? styles.inputShellError : null]}>
            <UserRound color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              placeholder="juanperez123"
              placeholderTextColor={m4gTheme.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              style={styles.input}
            />
          </View>
          {errors.username ? <Text style={styles.fieldError}>{errors.username}</Text> : null}
        </View>

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
              placeholder="Crea una contrasena"
              placeholderTextColor={m4gTheme.colors.textMuted}
              secureTextEntry={!showPassword}
              autoComplete="password-new"
              textContentType="newPassword"
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

        <View style={styles.field}>
          <Text style={styles.label}>Confirmar contrasena</Text>
          <View
            style={[styles.inputShell, errors.confirmPassword ? styles.inputShellError : null]}>
            <LockKeyhole color={m4gTheme.colors.textMuted} size={18} />
            <TextInput
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              placeholder="Repite la contrasena"
              placeholderTextColor={m4gTheme.colors.textMuted}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              textContentType="newPassword"
              editable={!loading}
              style={styles.input}
            />
            <Pressable onPress={() => setShowConfirmPassword((current) => !current)} hitSlop={8}>
              {showConfirmPassword ? (
                <EyeOff color={m4gTheme.colors.textMuted} size={18} />
              ) : (
                <Eye color={m4gTheme.colors.textMuted} size={18} />
              )}
            </Pressable>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.primaryButton, loading ? styles.primaryButtonDisabled : null]}>
          <Text style={styles.primaryButtonText}>{loading ? 'Cargando...' : 'Crear cuenta'}</Text>
        </Pressable>

        <Text style={styles.helperText}>
          Tu cuenta guardara metadatos de perfil como nombre completo y nombre de usuario para el
          resto de la plataforma.
        </Text>
      </View>

      <Link href="/login" asChild>
        <Pressable style={styles.swapLink}>
          <Text style={styles.swapText}>Ya tienes cuenta? Inicia sesion</Text>
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
  successBanner: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.34)',
  },
  successBannerText: {
    color: '#34d399',
    fontSize: 13,
    lineHeight: 18,
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

import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const SECURE_STORE_CHUNK_SIZE = 1900

function getSecureStoreMetaKey(key: string) {
  return `${key}__chunks`
}

function getSecureStoreChunkKey(key: string, index: number) {
  return `${key}__chunk_${index}`
}

async function removeSecureStoreChunks(key: string) {
  const metaKey = getSecureStoreMetaKey(key)
  const chunkCountValue = await SecureStore.getItemAsync(metaKey)
  const chunkCount = Number(chunkCountValue ?? '0')

  if (Number.isFinite(chunkCount) && chunkCount > 0) {
    await Promise.all(
      Array.from({ length: chunkCount }, (_, index) =>
        SecureStore.deleteItemAsync(getSecureStoreChunkKey(key, index)),
      ),
    )
  }

  await SecureStore.deleteItemAsync(metaKey)
}

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    const metaKey = getSecureStoreMetaKey(key)
    const chunkCountValue = await SecureStore.getItemAsync(metaKey)

    if (!chunkCountValue) {
      return SecureStore.getItemAsync(key)
    }

    const chunkCount = Number(chunkCountValue)
    if (!Number.isFinite(chunkCount) || chunkCount <= 0) {
      return null
    }

    const chunks = await Promise.all(
      Array.from({ length: chunkCount }, (_, index) =>
        SecureStore.getItemAsync(getSecureStoreChunkKey(key, index)),
      ),
    )

    if (chunks.some((chunk) => typeof chunk !== 'string')) {
      return null
    }

    return chunks.join('')
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.deleteItemAsync(key)
    await removeSecureStoreChunks(key)

    if (value.length <= SECURE_STORE_CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value)
      return
    }

    const chunks = Array.from(
      { length: Math.ceil(value.length / SECURE_STORE_CHUNK_SIZE) },
      (_, index) =>
        value.slice(index * SECURE_STORE_CHUNK_SIZE, (index + 1) * SECURE_STORE_CHUNK_SIZE),
    )

    await Promise.all(
      chunks.map((chunk, index) => SecureStore.setItemAsync(getSecureStoreChunkKey(key, index), chunk)),
    )
    await SecureStore.setItemAsync(getSecureStoreMetaKey(key), String(chunks.length))
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key)
    await removeSecureStoreChunks(key)
  },
}

const WebStorageAdapter = {
  getItem: async (key: string) => {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage.getItem(key)
  },
  setItem: async (key: string, value: string) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(key, value)
  },
  removeItem: async (key: string) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseKey = (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) as string

let cachedClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient
  }

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  cachedClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: Platform.OS === 'web' ? WebStorageAdapter : ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

  return cachedClient
}

export const supabase = getSupabaseClient()

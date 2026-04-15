import { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { Search } from 'lucide-react-native'

import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { CategoryChip } from '@/components/m4g/category-chip'
import { SectionHeading } from '@/components/m4g/section-heading'
import { GameCard } from '@/src/features/games/components/GameCard'
import { canOpenRemoteGameUrl } from '@/src/features/games/services/gameLaunch'
import { getGames, type CatalogGame } from '@/src/features/games/services/getGames'
import { AppScreen } from '@/src/shared/layout/AppScreen'
import { m4gTheme } from '@/src/shared/theme'

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function splitGenreTokens(genre: string | null | undefined) {
  return normalizeText(genre)
    .split(/[,/|&]+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function formatCategoryLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function GamesPage() {
  const router = useRouter()
  const [games, setGames] = useState<CatalogGame[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const loadGames = async () => {
      const gamesData = await getGames()
      setGames(gamesData)
    }

    loadGames()
  }, [])

  const categories = useMemo(() => {
    const genreSet = new Set<string>()

    games.forEach((game) => {
      splitGenreTokens(game.genre).forEach((token) => {
        genreSet.add(token)
      })
    })

    return ['All', ...Array.from(genreSet).sort().map(formatCategoryLabel)]
  }, [games])

  const popularGames = useMemo(
    () => [...games].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4),
    [games],
  )

  const remotePlayableCount = useMemo(
    () => games.filter((game) => canOpenRemoteGameUrl(game.game_url)).length,
    [games],
  )

  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        const matchesSearch = normalizeText(game.title).includes(normalizeText(searchTerm))
        const genreTokens = splitGenreTokens(game.genre)
        const selectedToken = normalizeText(selectedCategory)
        const matchesCategory =
          selectedCategory === 'All' ||
          genreTokens.includes(selectedToken) ||
          normalizeText(game.genre).includes(selectedToken)

        return matchesSearch && matchesCategory
      }),
    [games, searchTerm, selectedCategory],
  )

  const isFilteringActive = searchTerm.trim().length > 0 || selectedCategory !== 'All'

  const openGame = (game: CatalogGame) => {
    router.push(`/game/${game.id}` as Href)
  }

  const resultsSection = (
    <>
      <SectionHeading
        title={isFilteringActive ? 'Resultados' : 'Todos los juegos'}
        subtitle={
          isFilteringActive
            ? `${filteredGames.length} resultados para tu busqueda o categoria`
            : `${filteredGames.length} juegos | ${remotePlayableCount} con apertura web`
        }
      />

      <View style={styles.list}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard key={game.id} game={game} onPress={() => openGame(game)} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hay resultados</Text>
            <Text style={styles.emptyText}>
              Ajusta el texto o el genero. Los resultados suben arriba en cuanto filtras para no
              tener que bajar hasta el final.
            </Text>
          </View>
        )}
      </View>
    </>
  )

  const popularSection = (
    <>
      <SectionHeading
        title="Populares"
        subtitle={
          isFilteringActive
            ? 'Los mas valorados siguen aqui abajo mientras filtras o buscas.'
            : 'Los mas valorados se presentan primero, igual que en el catalogo web.'
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {popularGames.map((game) => (
          <GameCard key={game.id} game={game} compact onPress={() => openGame(game)} />
        ))}
      </ScrollView>
    </>
  )

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
      </View>

      <View style={styles.searchShell}>
        <Search color={m4gTheme.colors.textMuted} size={18} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Busca un juego o estudio"
          placeholderTextColor={m4gTheme.colors.textMuted}
          autoCapitalize="none"
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            active={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>

      {isFilteringActive ? resultsSection : popularSection}
      {isFilteringActive ? popularSection : resultsSection}
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: m4gTheme.radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  searchInput: {
    flex: 1,
    color: m4gTheme.colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  chipsRow: {
    gap: 10,
    paddingRight: 20,
  },
  carousel: {
    gap: 16,
    paddingRight: 20,
  },
  list: {
    gap: 16,
  },
  emptyState: {
    borderRadius: m4gTheme.radii.lg,
    padding: m4gTheme.spacing.xl,
    backgroundColor: m4gTheme.colors.card,
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    gap: 8,
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
})

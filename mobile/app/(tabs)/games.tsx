import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Search, Sparkles } from 'lucide-react-native'

import { AppScreen } from '@/components/m4g/app-screen'
import { BrandWordmark } from '@/components/m4g/brand-wordmark'
import { CategoryChip } from '@/components/m4g/category-chip'
import { GameCard } from '@/components/m4g/game-card'
import { SectionHeading } from '@/components/m4g/section-heading'
import { categories, games } from '@/constants/mock-data'
import { m4gTheme } from '@/constants/theme'

export default function GamesScreen() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || game.genre.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <BrandWordmark compact />
        <View style={styles.previewPill}>
          <Sparkles color={m4gTheme.colors.lime} size={14} />
          <Text style={styles.previewText}>PREVIEW</Text>
        </View>
      </View>

      <SectionHeading
        title="Juegos"
        subtitle="Catalogo mobile inspirado en la web, pero usando datos mock y filtros locales."
      />

      <View style={styles.searchShell}>
        <Search color={m4gTheme.colors.textMuted} size={18} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Busca un juego"
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

      <SectionHeading
        title="Populares"
        subtitle="Tarjetas pensadas para scroll horizontal, con el mismo contraste fuerte de la web."
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {games.slice(0, 4).map((game) => (
          <GameCard key={game.id} game={game} compact />
        ))}
      </ScrollView>

      <SectionHeading
        title="Todos los juegos"
        subtitle={`${filteredGames.length} resultados en esta maqueta`}
      />

      <View style={styles.list}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hay resultados</Text>
            <Text style={styles.emptyText}>
              Ajusta el texto o la categoria. La logica es local para validar el front.
            </Text>
          </View>
        )}
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
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: m4gTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
  },
  previewText: {
    color: m4gTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
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

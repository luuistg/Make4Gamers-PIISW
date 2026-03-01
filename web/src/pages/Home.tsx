

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import GameCard from '../components/games/GameCard';

// Datos de ejemplo de juegos
const gamesData = [
    { id: 1, title: "Cyberpunk 2077", category: "RPG", players: 1250000, rating: 4.5, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop" },
    { id: 2, title: "The Witcher 3", category: "RPG", players: 2100000, rating: 4.9, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop" },
    { id: 3, title: "Fortnite", category: "Action", players: 5000000, rating: 4.3, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop" },
    { id: 4, title: "Minecraft", category: "Adventure", players: 8000000, rating: 4.8, image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=400&h=300&fit=crop" },
    { id: 5, title: "League of Legends", category: "Strategy", players: 6500000, rating: 4.2, image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=300&fit=crop" },
    { id: 6, title: "FIFA 24", category: "Sports", players: 3200000, rating: 4.0, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop" },
    { id: 7, title: "God of War", category: "Action", players: 1800000, rating: 4.9, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop" },
    { id: 8, title: "Valorant", category: "Action", players: 4200000, rating: 4.4, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop" },
    { id: 9, title: "Elden Ring", category: "RPG", players: 2500000, rating: 4.7, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop" },
    { id: 10, title: "Apex Legends", category: "Action", players: 3800000, rating: 4.3, image: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=400&h=300&fit=crop" },
    { id: 11, title: "Zelda: BOTW", category: "Adventure", players: 1500000, rating: 4.9, image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop" },
    { id: 12, title: "Counter Strike 2", category: "Action", players: 7200000, rating: 4.6, image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=300&fit=crop" },
];

export default function Home() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Obtener juegos populares (top 4 por jugadores)
    const popularGames = [...gamesData]
        .sort((a, b) => b.players - a.players)
        .slice(0, 4);

    // Filtrar juegos
    const filteredGames = gamesData.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || game.category.toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero - Juegos populares */}
            <section className="bg-linear-to-b from-indigo-950/20 to-slate-950 py-12 mb-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('home.popular')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularGames.map(game => (
                            <GameCard key={game.id} {...game} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección de filtros y barra de búsqueda */}
            <section className="container mx-auto px-4 mb-8">
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    {/* Barra de búsqueda */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('home.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 text-white pl-12 pr-4 py-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="text-slate-400" size={20} />
                        <span className="text-slate-400 font-medium">Filtros:</span>
                    </div>
                    
                    <div>
                        {/* Filtro de categoría */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                {t('home.filters.category')}
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            >
                                <option value="all">{t('home.filters.all')}</option>
                                <option value="action">{t('home.filters.action')}</option>
                                <option value="adventure">{t('home.filters.adventure')}</option>
                                <option value="rpg">{t('home.filters.rpg')}</option>
                                <option value="strategy">{t('home.filters.strategy')}</option>
                                <option value="sports">{t('home.filters.sports')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* All Games Section */}
            <section className="container mx-auto px-4 pb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">{t('home.allGames')}</h2>
                    <span className="text-slate-400">{filteredGames.length} juegos</span>
                </div>

                {filteredGames.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredGames.map(game => (
                            <GameCard key={game.id} {...game} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-slate-400 text-lg">{t('home.noResults')}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter } from "lucide-react";
import GameCard from "../features/games/components/GameCard";
import { getGames, type Game } from "../features/games/services/getGames";
import { Link } from "react-router-dom";


export default function Juegos() {
  const [games, setGames] = useState<Game[]>([]);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Error loading games:", error);
      }
    };

    loadGames();
  }, []);

  const popularGames = [...games]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      game.genre?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero - Juegos populares */}
      <section className="bg-linear-to-b from-indigo-950/20 to-slate-950 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">{t("game.popular")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="block">
                <GameCard
                  title={game.title}
                  image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                  genre={game.genre ?? t("gameplay.noGenre")}
                  rating={typeof game.rating === "number" ? game.rating : 0}
                  players={game.players ?? 0}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros y búsqueda */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t("game.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-white pl-12 pr-4 py-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-slate-400" size={20} />
            <span className="text-slate-400 font-medium">{t("game.filtersLabel")}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {t("game.filters.category")}
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="all">{t("game.filters.all")}</option>
              <option value="action">{t("game.filters.action")}</option>
              <option value="arcade">{t("game.filters.arcade")}</option>
              <option value="rpg">{t("game.filters.rpg")}</option>
              <option value="puzzle">{t("game.filters.puzzle")}</option>
            </select>
          </div>
        </div>
      </section>

      {/* All Games */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("game.allGames")}</h2>
          <span className="text-slate-400">{filteredGames.length} {t("game.gamesCount")}</span>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="block">
                <GameCard
                  title={game.title}
                  image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                  genre={game.genre ?? t("gameplay.noGenre")}
                  rating={typeof game.rating === "number" ? game.rating : 0}
                  players={game.players ?? 0}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">{t("game.noResults")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import GameCard from "../features/games/components/GameCard";
import { getGames, type Game } from "../features/games/services/getGames";
import { Link } from "react-router-dom";

function safeLower(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}


export default function Juegos() {
  const [games, setGames] = useState<Game[]>([]);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categoryOptions = [
    { value: "all", label: t("game.filters.all") },
    { value: "action", label: t("game.filters.action") },
    { value: "arcade", label: t("game.filters.arcade") },
    { value: "rpg", label: t("game.filters.rpg") },
    { value: "puzzle", label: t("game.filters.puzzle") },
  ];

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Error loading games:", error);
        setGames([]);
      }
    };

    loadGames();
  }, []);

  const popularGames = [...games]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);

  const filteredGames = games.filter((game) => {
    const matchesSearch = safeLower(game.title).includes(safeLower(searchTerm));
    const matchesCategory =
      categoryFilter === "all" ||
      safeLower(game.genre) === safeLower(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters = searchTerm.trim().length > 0 || categoryFilter !== "all";

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-950/20 to-slate-950">
      {/* Hero - Juegos populares */}
      <section className="pt-8 pb-6">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">{t("game.popular")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGames.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="block">
                <GameCard
                  title={game.title ?? "Unknown game"}
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

      {/* All Games */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("game.allGames")}</h2>
          <span className="text-slate-400">{filteredGames.length} {t("game.gamesCount")}</span>
        </div>

        <div className="mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="group relative w-full lg:max-w-2xl lg:flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-slate-300"
                size={17}
              />
              <input
                type="text"
                placeholder={t("game.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900/40 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categoryOptions.map((option) => {
                const isActive = categoryFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCategoryFilter(option.value)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-100"
                        : "border-slate-800 bg-transparent text-slate-300 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}

              {hasActiveFilters && (
                <div className="ml-1 border-l border-slate-800/80 pl-2 sm:ml-2 sm:pl-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="h-8 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 text-sm font-medium text-indigo-100 transition-colors hover:border-indigo-400/60 hover:bg-indigo-500/15"
                  >
                    Limpiar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="block">
                <GameCard
                  title={game.title ?? "Unknown game"}
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
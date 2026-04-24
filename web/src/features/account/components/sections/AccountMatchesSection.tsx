import { useTranslation } from 'react-i18next';
import { Gamepad2, Medal, TrendingUp } from 'lucide-react';

type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
};

type AccountMatchesSectionProps = {
  highScores: HighScoreEntry[];
  recentGames: RecentGame[];
  formatDate: (dateString: string) => string;
};

export function AccountMatchesSection({
  highScores,
  recentGames,
  formatDate,
}: AccountMatchesSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
          <TrendingUp size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">{t('account.dashboard.bestRecords')}</h3>
      </div>

      {highScores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highScores.map((record, index) => (
            <div
              key={`my-record-${index}`}
              className="group rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 relative overflow-hidden transition-all hover:bg-slate-800/80 hover:border-amber-500/30"
            >
              <div className="absolute right-0 top-0 w-16 h-full bg-linear-to-l from-amber-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col">
                <span className="text-xs text-amber-400/80 font-bold uppercase tracking-wider mb-1 truncate">
                  {record.displayTitle}
                </span>
                <span className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {record.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
          <Medal size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">{t('account.dashboard.noRecentGames')}</p>
        </div>
      )}

      <div className="border-t border-slate-800 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Gamepad2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">{t('account.dashboard.recentGames')}</h3>
        </div>

        {recentGames.length > 0 ? (
          <div className="space-y-2.5">
            {recentGames.slice(0, 10).map((game) => (
              <div
                key={game.id}
                className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
              >
                <p className="text-white font-medium truncate">
                  {game.game?.title || t('account.dashboard.unknownGame')}
                </p>
                <div className="text-sm text-slate-400 flex items-center gap-5">
                  <span>
                    {t('account.dashboard.status')}: {t('account.dashboard.finished')}
                  </span>
                  <span>{t('account.dashboard.score')}: {game.score ?? '-'}</span>
                  <span>{formatDate(game.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/20 p-6 text-center text-slate-400">
            {t('account.dashboard.noRecentGames')}
          </div>
        )}
      </div>
    </section>
  );
}

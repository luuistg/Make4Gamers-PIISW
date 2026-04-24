import { useTranslation } from 'react-i18next';
import { Gamepad2, MapPin, Medal, Trophy, User as UserIcon } from 'lucide-react';

type ProfileSummary = {
  username: string | null;
  avatar_url: string | null;
  role?: string | null;
  location?: string | null;
};

type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

type AchievementEntry = {
  id: string | number;
  unlocked_at: string;
  achievement: {
    title: string | null;
    description: string | null;
    badge_icon: string | null;
  }[];
};

type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
};

type AccountDashboardSectionProps = {
  profile: ProfileSummary;
  highScores: HighScoreEntry[];
  userAchievements: AchievementEntry[];
  recentGames: RecentGame[];
  formatDate: (dateString: string) => string;
};

export function AccountDashboardSection({
  profile,
  highScores,
  userAchievements,
  recentGames,
  formatDate,
}: AccountDashboardSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 lg:h-full lg:overflow-y-auto">
      <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-indigo-500/40 overflow-hidden flex items-center justify-center">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="text-indigo-400" size={28} />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-white text-xl font-semibold">{profile.username || t('account.dashboard.defaultUser')}</p>
          <p className="text-sm text-slate-400">
            {t('account.dashboard.role')}: {profile.role || t('account.dashboard.defaultRole')}
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            <MapPin size={14} /> {profile.location || t('account.dashboard.noLocation')}
          </p>
        </div>
      </div>

      {highScores.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
            <Medal size={20} className="text-amber-400" />
            {t('account.dashboard.bestRecords')}
          </h3>
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
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Trophy size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">{t('account.dashboard.achievements')}</h3>
        </div>

        {userAchievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userAchievements.map((ua) => (
              <div
                key={ua.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <Trophy size={24} />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{ua.achievement[0]?.title}</h4>
                <p className="text-slate-400 text-xs">{ua.achievement[0]?.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
            <Trophy size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">{t('account.dashboard.noAchievements')}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg text-white font-semibold mb-3 flex items-center gap-2">
          <Gamepad2 size={18} className="text-indigo-400" />
          {t('account.dashboard.recentGames')}
        </h3>

        <div className="space-y-2.5">
          {recentGames.length > 0 ? (
            recentGames.slice(0, 5).map((game) => (
              <div
                key={game.id}
                className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
              >
                <p className="text-white font-medium truncate">{game.game?.title || t('account.dashboard.unknownGame')}</p>
                <div className="text-sm text-slate-400 flex items-center gap-5">
                  <span>
                    {t('account.dashboard.status')}: {t('account.dashboard.finished')}
                  </span>
                  <span>{t('account.dashboard.score')}: {game.score}</span>
                  <span>{formatDate(game.created_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/20 p-6 text-center text-slate-400">
              {t('account.dashboard.noRecentGames')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

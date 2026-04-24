import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';

type AchievementEntry = {
  id: string | number;
  unlocked_at: string;
  achievement: {
    title: string | null;
    description: string | null;
    badge_icon: string | null;
  }[];
};

type AccountAchievementsSectionProps = {
  userAchievements: AchievementEntry[];
};

export function AccountAchievementsSection({
  userAchievements,
}: AccountAchievementsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
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
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
          <Trophy size={64} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">{t('account.dashboard.noAchievements')}</p>
        </div>
      )}
    </section>
  );
}
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

export function AccountAchievementsSection({ userAchievements }: { userAchievements: AchievementEntry[] }) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
          <Trophy size={24} />
        </div>
        <h3 className="text-2xl font-bold text-white">{t('account.dashboard.achievements')}</h3>
      </div>

      {userAchievements.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {userAchievements.map((ua) => {
            const data = ua.achievement[0]; 
            return (
              <div key={ua.id} className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:bg-slate-800 hover:border-indigo-500/50">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all overflow-hidden">
                  {data?.badge_icon ? (
                    <img src={data.badge_icon} alt={data?.title || ''} className="w-full h-full object-cover" />
                  ) : (
                    <Trophy size={28} className="text-indigo-400" />
                  )}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{data?.title || 'Logro Oculto'}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{data?.description || 'Continúa jugando para desbloquear'}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
          <p className="text-slate-500">Aún no has desbloqueado ningún logro.</p>
        </div>
      )}
    </section>
  );
}

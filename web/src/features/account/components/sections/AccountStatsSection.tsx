import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Trophy, Gamepad2, Calendar, BarChart3 } from 'lucide-react';
import { getUserDetailedStats } from '../../services/account.service';

type StatsData = {
  totalMatches: number;
  highestScore: number;
  favoriteGame: string;
  favoriteGamePlays: number;
  chartData: Array<{ name: string; plays: number; highScore: number }>;
  historyData: Array<{ date: string; time: string; game: string; status: string }>;
};

type AccountStatsSectionProps = {
  userId: string;
};

export function AccountStatsSection({ userId }: AccountStatsSectionProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setLoading(true);
      const data = await getUserDetailedStats(userId);
      if (!isMounted) return;
      setStats(data as StatsData | null);
      setLoading(false);
    };

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />
      </section>
    );
  }

  if (!stats || stats.totalMatches === 0) {
    return (
      <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-center text-center">
        <div>
          <Gamepad2 size={52} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-xl font-bold text-white">{t('account.stats.emptyTitle')}</h3>
          <p className="text-slate-400 mt-2">{t('account.stats.emptyDescription')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
          <BarChart3 size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{t('account.stats.title')}</h3>
          <p className="text-sm text-slate-400">{t('account.stats.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">{t('account.stats.totalMatches')}</p>
              <p className="text-2xl font-bold text-white">{stats.totalMatches}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">{t('account.stats.highestScore')}</p>
              <p className="text-2xl font-bold text-white">{stats.highestScore.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Gamepad2 size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">{t('account.stats.favoriteGame')}</p>
              <p className="text-lg font-bold text-white truncate">{stats.favoriteGame}</p>
              <p className="text-xs text-slate-500">{t('account.stats.favoriteGamePlays', { count: stats.favoriteGamePlays })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800/35 border border-slate-700/60 p-5 rounded-2xl">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={17} className="text-indigo-400" />
            {t('account.stats.gamesChart')}
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={false}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="plays" fill="#6366f1" radius={[4, 4, 0, 0]} name={t('account.stats.matches')} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/35 border border-slate-700/60 p-5 rounded-2xl">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={17} className="text-indigo-400" />
            {t('account.stats.recentActivity')}
          </h4>

          <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar pr-1">
            {stats.historyData.length > 0 ? (
              stats.historyData.map((item, idx) => (
                <div key={`${item.game}-${item.date}-${idx}`} className="p-3 bg-slate-900/55 border border-slate-700/40 rounded-xl">
                  <p className="text-white font-medium truncate">{item.game}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.date} · {item.time}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">{t('account.stats.emptyActivity')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

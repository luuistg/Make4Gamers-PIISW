import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import UserAvatar from '../../../../shared/components/UserAvatar';

type ProfileSummary = {
  username: string | null;
  avatar_url: string | null;
  role?: string | null;
  location?: string | null;
};

type AccountDashboardSectionProps = {
  profile: ProfileSummary;
};

export function AccountDashboardSection({
  profile,
}: AccountDashboardSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <UserAvatar src={profile.avatar_url} name={profile.username} size={64} />
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
    </section>
  );
}

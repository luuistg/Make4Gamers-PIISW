import { useTranslation } from 'react-i18next';
import {
  User as UserIcon,
  LayoutDashboard,
  Users,
  CreditCard,
  Lock,
  Wrench,
} from 'lucide-react';
import type { AccountSection } from '../types/account-ui.types';

type AccountSidebarProps = {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
};

export function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl lg:h-[calc(100vh-7rem)]">
      <div className="mb-6 flex items-center gap-2 text-white">
        <UserIcon size={20} className="text-indigo-400" />
        <h2 className="text-lg font-semibold">{t('account.sidebar.title')}</h2>
      </div>

      <nav className="space-y-2 text-sm">
        <button
          type="button"
          onClick={() => onSectionChange('dashboard')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            activeSection === 'dashboard'
              ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
              : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <LayoutDashboard size={16} className="text-slate-400" />
          {t('account.sidebar.dashboard')}
        </button>
        <button
          type="button"
          onClick={() => onSectionChange('personal')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            activeSection === 'personal'
              ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
              : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <UserIcon size={16} className="text-slate-400" />
          {t('account.sidebar.personal')}
        </button>
        <button
          type="button"
          onClick={() => onSectionChange('friends')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            activeSection === 'friends'
              ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
              : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <Users size={16} className="text-slate-400" />
          {t('account.sidebar.friends')}
        </button>
        <button
          type="button"
          onClick={() => onSectionChange('payments')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            activeSection === 'payments'
              ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
              : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <CreditCard size={16} className="text-slate-400" />
          {t('account.sidebar.payments')}
        </button>
        <button
          type="button"
          onClick={() => onSectionChange('security')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            activeSection === 'security'
              ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
              : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <Lock size={16} className="text-slate-400" />
          {t('account.sidebar.security')}
        </button>
        <button
          type="button"
          onClick={() => onSectionChange('support')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            activeSection === 'support'
              ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
              : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
          }`}
        >
          <Wrench size={16} className="text-slate-400" />
          {t('account.sidebar.support', { defaultValue: t('account.support.title') })}
        </button>
      </nav>
    </aside>
  );
}

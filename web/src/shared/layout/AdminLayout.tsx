import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  Filter,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../../supabase';

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingDevRequests, setPendingDevRequests] = useState(0);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          navigate('/');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.role !== 'admin') {
          navigate('/');
          return;
        }

        setIsAdmin(true);

        const { count } = await supabase
          .from('developer_requests')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'pendiente');

        setPendingDevRequests(count ?? 0);
      } finally {
        setLoading(false);
      }
    };

    void checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        {t('admin.loading', { defaultValue: 'Cargando panel de administracion...' })}
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems: NavItem[] = [
    { to: '/admin', label: t('admin.dashboard', { defaultValue: 'Panel' }), icon: LayoutDashboard },
    { to: '/admin/formulas', label: t('admin.formulas'), icon: Calculator },
    { to: '/admin/tickets', label: t('admin.tickets'), icon: LifeBuoy },
    { to: '/admin/sugerencias', label: t('admin.suggestions'), icon: MessageSquare },
    { to: '/admin/filtro', label: t('admin.wordFilter'), icon: Filter },
    {
      to: '/admin/solicitudes',
      label: t('admin.devRequests', { defaultValue: 'Solicitudes Dev' }),
      icon: UserCog,
      badge: pendingDevRequests,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {t('admin.panelTitle', { defaultValue: 'Panel de administracion' })}
            </h1>
            <p className="text-sm text-slate-400">
              {t('admin.panelSubtitle', { defaultValue: 'Gestion centralizada de la plataforma.' })}
            </p>
          </div>
          <Link to="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            {t('admin.backHome', { defaultValue: 'Volver al inicio' })}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 h-fit lg:sticky lg:top-20">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-100'
                          : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/70'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={16} className="text-slate-400" />
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 ? (
                      <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-6 min-h-[600px]">
            <Outlet />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

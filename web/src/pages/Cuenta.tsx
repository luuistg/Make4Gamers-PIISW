import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User as UserIcon,
  Activity,
  Shield,
  ShieldAlert,
  Edit2,
  Check,
  X,
  Camera,
  AlertTriangle,
  LayoutDashboard,
  Users,
  Lock,
  CreditCard,
  Search,
  MessageCircle,
  MapPin,
  Gamepad2,
  Medal
} from 'lucide-react';
import { supabase } from '../supabase';
import { getAuthenticatedUser, subscribeToAuthState } from '../features/auth/services/auth.service';
import {
  getAccountFriends,
  getAccountProfile,
  getAccountRecentGames,
  updateAccountProfile,
  getAccountHighScores
} from '../features/account/services/account.service';

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  status: string | null;
  allow_requests?: boolean | null;
  role?: string | null;
  location?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  phone?: string | null;
  subscription_type?: string | null;
};

type AccountSection = 'dashboard' | 'personal' | 'friends' | 'payments' | 'security';

type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
  opponent?: string;
  status?: string;
};

type FriendEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

export default function Cuenta() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarPolicyModal, setShowAvatarPolicyModal] = useState(false);
  const [activeSection, setActiveSection] = useState<AccountSection>('dashboard');

  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [highScores, setHighScores] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hydrateAccount = useCallback(async (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    console.log('[CUENTA DEBUG] Hydrating account for user:', user.id);
    let mergedProfile: Profile;

    try {
      console.log('[CUENTA DEBUG] Fetching profile from getAccountProfile...');
      const profileData = await getAccountProfile(user.id);
      console.log('[CUENTA DEBUG] Profile fetched:', profileData);
      mergedProfile = {
        ...profileData,
        email: user.email ?? null,
      };
    } catch (profileError) {
      console.warn('[CUENTA DEBUG] No se encontro perfil en tabla profiles. Se usa perfil minimo de sesion.', profileError);

      const fallbackUsername =
        (user.user_metadata?.username as string | undefined) ||
        user.email?.split('@')[0] ||
        null;

      mergedProfile = {
        id: user.id,
        username: fallbackUsername,
        avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
        email: user.email ?? null,
        status: 'Disponible',
        allow_requests: true,
        role: 'Jugador',
        location: null,
        first_name: null,
        last_name: null,
        birth_date: null,
        phone: null,
        subscription_type: null,
      };
    }

    setProfile(mergedProfile);
    setAllowRequests(mergedProfile.allow_requests !== false);
    setEditNameValue(mergedProfile.username || '');
    console.log('[CUENTA DEBUG] Profile set:', mergedProfile);


    console.log('[CUENTA DEBUG] Loading games, friends and scores in background...');
    Promise.all([loadRecentGames(user.id), loadFriends(user.id), loadHighScores(user.id)]).catch(err => {
      console.error('[CUENTA DEBUG] Error cargando datos secundarios:', err);
    });
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? (await getAuthenticatedUser());

        if (user) {
          await hydrateAccount(user);
        }
      } catch (error) {
        console.error('Error cargando el perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const {
      data: { subscription },
    } = subscribeToAuthState(async (_event, session) => {
      if (session?.user) {
        await hydrateAccount(session.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hydrateAccount]);

  const loadRecentGames = async (userId: string) => {
    try {
      console.log('[CUENTA DEBUG] loadRecentGames: starting for user', userId);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando juegos')), 5000)
      );
      
      const data = await Promise.race([
        getAccountRecentGames(userId, 5),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof getAccountRecentGames>>;

      console.log('[CUENTA DEBUG] loadRecentGames: data received', data);

      const normalizedGames: RecentGame[] = data.map((item) => ({
        id: item.id,
        score: item.score ?? 0,
        created_at: item.created_at,
        game: item.game,
      }));

      console.log('[CUENTA DEBUG] loadRecentGames: normalized games', normalizedGames);
      setRecentGames(normalizedGames);
    } catch (error) {
      console.warn('[CUENTA DEBUG] loadRecentGames: Error o timeout:', error);
      setRecentGames([]);
    }
  };

  const loadHighScores = async (userId: string) => {
    try {
      console.log('[CUENTA DEBUG] loadHighScores: starting for user', userId);
      const data = await getAccountHighScores(userId);
      setHighScores(data);
    } catch (error) {
      console.warn('[CUENTA DEBUG] loadHighScores: Error:', error);
      setHighScores([]);
    }
  };

  const loadFriends = async (userId: string) => {
    try {
      console.log('[CUENTA DEBUG] loadFriends: starting for user', userId);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando amigos')), 5000)
      );
      
      const data = await Promise.race([
        getAccountFriends(userId),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof getAccountFriends>>;
      
      console.log('[CUENTA DEBUG] loadFriends: data received', data);
      setFriends((data || []) as FriendEntry[]);
    } catch (error) {
      console.warn('[CUENTA DEBUG] loadFriends: Error o timeout:', error);
      setFriends([]);
    }
  };

  const togglePrivacy = async () => {
    if (!profile) return;
    setSavingPrivacy(true);
    const newValue = !allowRequests;

    try {
      await updateAccountProfile(profile.id, { allow_requests: newValue });
      setAllowRequests(newValue);
    } catch (error) {
      console.error('Error actualizando privacidad:', error);
      alert(t('account.alerts.saveConfigError'));
    } finally {
      setSavingPrivacy(false);
    }
  };

  const saveUsername = async () => {
    if (!profile) return;

    const newName = editNameValue.trim();

    if (!newName) {
      alert(t('account.alerts.emptyUsername'));
      return;
    }

    setSavingName(true);
    try {
      await updateAccountProfile(profile.id, { username: newName });

      setProfile((prev) => (prev ? { ...prev, username: newName } : prev));
      setIsEditingName(false);
    } catch (error) {
      console.error('Error actualizando el nombre:', error);
      alert(t('account.alerts.saveUsernameError'));
    } finally {
      setSavingName(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!profile) return;

    const newStatus = e.target.value;

    setProfile((prev) => (prev ? { ...prev, status: newStatus } : prev));

    try {
      await updateAccountProfile(profile.id, { status: newStatus });
    } catch (error) {
      console.error('Error actualizando el estado:', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);

      if (!profile) {
        throw new Error('No se pudo identificar el perfil actual.');
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await updateAccountProfile(profile.id, { avatar_url: publicUrl });

      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : prev));
      alert(t('account.alerts.avatarUpdated'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('account.alerts.avatarUploadError');
      alert(message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = t('account.locale', { defaultValue: 'es-ES' });
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(friendsSearch.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <UserIcon size={48} className="mb-4 opacity-50" />
        <p>{t('account.states.profileLoadError')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-stretch">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl lg:min-h-[calc(100vh-7rem)]">
            <div className="mb-6 flex items-center gap-2 text-white">
              <UserIcon size={20} className="text-indigo-400" />
              <h2 className="text-lg font-semibold">{t('account.sidebar.title')}</h2>
            </div>

            <nav className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
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
                onClick={() => setActiveSection('personal')}
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
                onClick={() => setActiveSection('friends')}
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
                onClick={() => setActiveSection('payments')}
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
                onClick={() => setActiveSection('security')}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  activeSection === 'security'
                    ? 'bg-indigo-500/15 text-indigo-100 border border-indigo-500/30'
                    : 'text-slate-200 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Lock size={16} className="text-slate-400" />
                {t('account.sidebar.security')}
              </button>
            </nav>
          </aside>

          <main className="space-y-6">
            {activeSection === 'dashboard' && (
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
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
                    <p className="text-sm text-slate-400">{t('account.dashboard.role')}: {profile.role || t('account.dashboard.defaultRole')}</p>
                    <p className="text-sm text-slate-400 flex items-center gap-1"><MapPin size={14} /> {profile.location || t('account.dashboard.noLocation')}</p>
                  </div>
                </div>

              
                {highScores.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                      <Medal size={20} className="text-amber-400" />
                      Mis Mejores Marcas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {highScores.map((record, index) => (
                        <div key={`my-record-${index}`} className="group rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 relative overflow-hidden transition-all hover:bg-slate-800/80 hover:border-amber-500/30">
                          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
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

                <div>
                  <h3 className="text-lg text-white font-semibold mb-3 flex items-center gap-2">
                    <Gamepad2 size={18} className="text-indigo-400" />
                    {t('account.dashboard.lastGames')}
                  </h3>

                  <div className="space-y-2.5">
                    {recentGames.length > 0 ? (
                      recentGames.slice(0, 5).map((game) => (
                        <div key={game.id} className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-white font-medium truncate">{game.game?.title || t('account.dashboard.unknownGame')}</p>
                          <div className="text-sm text-slate-400 flex items-center gap-5">
                            <span>{t('account.dashboard.status')}: {t('account.dashboard.finished')}</span>
                            <span>Score: {game.score}</span>
                            <span>{formatDate(game.created_at)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/20 p-6 text-center text-slate-400">
                        No hay partidas recientes registradas.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'personal' && (
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

                <div className="relative flex flex-col xl:flex-row items-start xl:items-center gap-6 mb-6">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                      ) : profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={40} className="text-indigo-400" />
                      )}
                    </div>

                    <button
                      title="Cambiar foto de perfil"
                      onClick={() => setShowAvatarPolicyModal(true)}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-indigo-500"
                    >
                      <Camera size={24} className="text-white" />
                    </button>
                  </div>

                  <input
                    title="Subir nueva foto de perfil"
                    type="file"
                    id="avatarSingle"
                    accept="image/*"
                    onChange={uploadAvatar}
                    ref={fileInputRef}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />

                  <div className="flex-1 min-w-0">
                    {isEditingName ? (
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          placeholder="Escribe tu nuevo nombre..."
                          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={saveUsername}
                          disabled={savingName}
                          className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                          title="Guardar"
                        >
                          {savingName ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Check size={20} />}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false);
                            setEditNameValue(profile.username || '');
                          }}
                          className="p-1.5 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30 transition-colors"
                          title="Cancelar"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mb-3 group">
                        <h1 className="text-3xl font-bold text-white truncate">{profile.username || t('account.personal.noUsername')}</h1>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="p-1.5 text-slate-500 hover:text-indigo-400 bg-slate-800/50 hover:bg-slate-800 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                          title="Editar nombre"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><Activity size={16} /> Estado:</span>
                      <select
                        title="Seleccionar estado de conexion"
                        value={profile.status || 'Disponible'}
                        onChange={handleStatusChange}
                        className="bg-slate-800/80 text-white border border-slate-700 rounded-md px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer text-sm"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Ausente">Ausente</option>
                        <option value="Ocupado">Ocupado</option>
                        <option value="Invisible">Invisible</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.personal.name')}</p>
                    <p className="mt-1 text-sm text-white">{profile.first_name || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.personal.lastName')}</p>
                    <p className="mt-1 text-sm text-white">{profile.last_name || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.personal.username')}</p>
                    <p className="mt-1 text-sm text-white">{profile.username || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.personal.email')}</p>
                    <p className="mt-1 text-sm text-white break-all">{profile.email || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.personal.birthDate')}</p>
                    <p className="mt-1 text-sm text-white">{profile.birth_date || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.personal.phone')}</p>
                    <p className="mt-1 text-sm text-white">{profile.phone || t('account.personal.notDefined')}</p>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'friends' && (
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <h3 className="text-xl font-semibold text-white">{t('account.friends.title')}</h3>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={friendsSearch}
                      onChange={(e) => setFriendsSearch(e.target.value)}
                      placeholder={t('account.friends.searchPlaceholder')}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredFriends.map((friend) => (
                    <div key={friend.id} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-slate-200 font-semibold shrink-0">
                          {friend.avatar_url ? (
                            <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                          ) : (
                            friend.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{friend.username}</p>
                          <p className="text-xs text-slate-400">{friend.status || 'Desconectado'}</p>
                        </div>
                      </div>

                      <Link
                        to="/chat"
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500/20 transition-colors"
                      >
                        <MessageCircle size={15} />
                        {t('account.friends.sendMessage')}
                      </Link>
                    </div>
                  ))}

                  {filteredFriends.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/20 p-6 text-center text-slate-400">
                      {t('account.friends.noResults')}
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'payments' && (
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <h3 className="text-xl font-semibold text-white">{t('account.payments.title')}</h3>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.payments.subscriptionType')}</p>
                  <p className="mt-1 text-sm font-medium text-white">{profile.subscription_type || t('account.payments.defaultSubscription')}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">{t('account.payments.paymentMethods')}</h4>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-2.5 text-sm text-slate-200">Visa **** 4242 ({t('account.payments.defaultMethod')})</div>
                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-2.5 text-sm text-slate-200">PayPal - {profile.email || 'usuario@email.com'}</div>
                    <button className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-500/20 transition-colors">
                      {t('account.payments.addMethod')}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-800/20 p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">{t('account.payments.subscriptionInfo')}</h4>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    <li>{t('account.payments.benefitEarlyAccess')}</li>
                    <li>{t('account.payments.benefitLeagues')}</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-500">{t('account.payments.renewalNote')}</p>
              </section>
            )}

            {activeSection === 'security' && (
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-xl font-semibold text-white">{t('account.security.title')}</h3>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">{t('account.security.personalSection')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.changePassword')}</button>
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.accountInfo')}</button>
                    <button className="rounded-md border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 transition-colors">{t('account.security.deactivateAccount')}</button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">{t('account.security.accountSecuritySection')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.enable2fa')}</button>
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.changePaymentMethod')}</button>
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.verifyEmail')}</button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">{t('account.security.socialSupportSection')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.reportPlayer')}</button>
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.reportGame')}</button>
                    <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">{t('account.security.reportIncident')}</button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 inline-flex flex-col items-start">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{t('account.security.friendPrivacy')}</span>
                  <button
                    onClick={togglePrivacy}
                    disabled={savingPrivacy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      allowRequests
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                    }`}
                  >
                    {savingPrivacy ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : allowRequests ? (
                      <Shield size={16} />
                    ) : (
                      <ShieldAlert size={16} />
                    )}
                    {allowRequests ? t('account.security.requestsEnabled') : t('account.security.requestsBlocked')}
                  </button>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {showAvatarPolicyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400 mb-2 border-b border-slate-800 pb-3">
              <AlertTriangle size={32} />
              <h3 className="text-2xl font-bold text-white">{t('account.avatarPolicy.title')}</h3>
            </div>

            <p className="text-sm text-slate-400">
              {t('account.avatarPolicy.description')}
            </p>

            <ul className="text-sm text-slate-400 list-disc list-inside space-y-1.5 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <li>{t('account.avatarPolicy.rule1')}</li>
              <li>{t('account.avatarPolicy.rule2')}</li>
              <li>{t('account.avatarPolicy.rule3')}</li>
            </ul>

            <div className="flex gap-3 pt-3 justify-end">
              <button
                onClick={() => setShowAvatarPolicyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {t('account.common.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowAvatarPolicyModal(false);
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t('account.avatarPolicy.accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

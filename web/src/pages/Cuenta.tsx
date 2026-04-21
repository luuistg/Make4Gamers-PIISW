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
import { getAuthenticatedUser, subscribeToAuthState, updatePassword, verifyCurrentPassword } from '../features/auth/services/auth.service';
import {
  reportGame,
  reportUser,
  searchReportableGames,
  searchReportableUsers,
  type ReportableGame,
  type ReportableUser
} from '../features/reports/services/reports.service';
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
  created_at?: string | null;
  updated_at?: string | null;
  subscription_tier?: string | null;
  subscription_end_date?: string | null;
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

type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

type ReportSearchEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

type GameReportSearchEntry = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  status: string | null;
  genre: string | null;
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

  // Change password modal
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Edit profile modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileEditError, setProfileEditError] = useState('');

  // Report player modal
  const [showReportPlayerModal, setShowReportPlayerModal] = useState(false);
  const [reportPlayerForm, setReportPlayerForm] = useState({
    reportedUserId: '',
    reportedUsername: '',
    searchQuery: '',
    reason: '',
    details: '',
  });
  const [reportingPlayer, setReportingPlayer] = useState(false);
  const [searchingReportUsers, setSearchingReportUsers] = useState(false);
  const [reportSearchResults, setReportSearchResults] = useState<ReportSearchEntry[]>([]);
  const [reportPlayerError, setReportPlayerError] = useState('');

  // Report game modal
  const [showReportGameModal, setShowReportGameModal] = useState(false);
  const [reportGameForm, setReportGameForm] = useState({
    reportedGameId: '',
    reportedGameTitle: '',
    searchQuery: '',
    reason: '',
    details: '',
  });
  const [reportingGame, setReportingGame] = useState(false);
  const [searchingReportGames, setSearchingReportGames] = useState(false);
  const [reportGameSearchResults, setReportGameSearchResults] = useState<GameReportSearchEntry[]>([]);
  const [reportGameError, setReportGameError] = useState('');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit profile form when modal opens
  const openEditProfileModal = () => {
    setEditProfileForm({
      username: profile?.username || '',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      birthDate: profile?.birth_date || '',
      email: profile?.email || '',
    });
    setProfileEditError('');
    setShowEditProfileModal(true);
  };

  const openReportPlayerModal = () => {
    setReportPlayerForm({
      reportedUserId: '',
      reportedUsername: '',
      searchQuery: '',
      reason: '',
      details: '',
    });
    setReportSearchResults([]);
    setReportPlayerError('');
    setShowReportPlayerModal(true);
  };

  const openReportGameModal = () => {
    setReportGameForm({
      reportedGameId: '',
      reportedGameTitle: '',
      searchQuery: '',
      reason: '',
      details: '',
    });
    setReportGameSearchResults([]);
    setReportGameError('');
    setShowReportGameModal(true);
  };

  const handleReportSearchChange = (value: string) => {
    setReportPlayerForm((current) => ({
      ...current,
      searchQuery: value,
      reportedUserId: '',
      reportedUsername: '',
    }));
  };

  const handleReportUserSelect = (user: ReportSearchEntry) => {
    setReportPlayerForm((current) => ({
      ...current,
      reportedUserId: user.id,
      reportedUsername: user.username,
      searchQuery: user.username,
    }));
  };

  const handleGameReportSearchChange = (value: string) => {
    setReportGameForm((current) => ({
      ...current,
      searchQuery: value,
      reportedGameId: '',
      reportedGameTitle: '',
    }));
  };

  const handleReportGameSelect = (game: GameReportSearchEntry) => {
    setReportGameForm((current) => ({
      ...current,
      reportedGameId: game.id,
      reportedGameTitle: game.title,
      searchQuery: game.title,
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buildSessionProfile = useCallback((user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): Profile => {
    const fallbackUsername =
      (user.user_metadata?.username as string | undefined) ||
      user.email?.split('@')[0] ||
      null;

    const fullName = (user.user_metadata?.full_name as string | undefined) || '';
    const [firstName, ...restOfName] = fullName.trim().split(/\s+/).filter(Boolean);
    const lastName = restOfName.length > 0 ? restOfName.join(' ') : null;

    return {
      id: user.id,
      username: fallbackUsername,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      email: user.email ?? null,
      status: 'Disponible',
      allow_requests: true,
      role: 'Jugador',
      location: null,
      first_name: firstName || null,
      last_name: lastName,
      birth_date: (user.user_metadata?.birth_date as string | undefined) ?? null,
      phone: null,
      created_at: null,
      updated_at: null,
      subscription_tier: (user.user_metadata?.subscription_tier as string | undefined) ?? 'free',
      subscription_end_date: null,
    };
  }, []);

  const hydrateAccount = useCallback(async (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    let mergedProfile: Profile;

    try {
      const profileData = await getAccountProfile(user.id);
      const sessionProfile = buildSessionProfile(user);
      mergedProfile = {
        ...sessionProfile,
        ...profileData,
        first_name: profileData.first_name ?? sessionProfile.first_name,
        last_name: profileData.last_name ?? sessionProfile.last_name,
        birth_date: profileData.birth_date ?? sessionProfile.birth_date,
        subscription_tier: profileData.subscription_tier ?? sessionProfile.subscription_tier,
        email: user.email ?? null,
      };
    } catch (profileError) {
      console.warn('No se encontro perfil en tabla profiles. Se usa perfil minimo de sesion.', profileError);

      mergedProfile = buildSessionProfile(user);
    }

    setProfile(mergedProfile);
    setAllowRequests(mergedProfile.allow_requests !== false);
    setEditNameValue(mergedProfile.username || '');
    Promise.all([loadRecentGames(user.id), loadFriends(user.id), loadHighScores(user.id)]).catch(err => {
      console.error('Error cargando datos secundarios:', err);
    });
  }, [buildSessionProfile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? (await getAuthenticatedUser());

        if (user) {
          const quickProfile = buildSessionProfile(user);
          setProfile(quickProfile);
          setAllowRequests(quickProfile.allow_requests !== false);
          setEditNameValue(quickProfile.username || '');

          void hydrateAccount(user);
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
        const quickProfile = buildSessionProfile(session.user);
        setProfile(quickProfile);
        setAllowRequests(quickProfile.allow_requests !== false);
        setEditNameValue(quickProfile.username || '');

        void hydrateAccount(session.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [buildSessionProfile, hydrateAccount]);

  const loadRecentGames = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando juegos')), 5000)
      );
      
      const data = await Promise.race([
        getAccountRecentGames(userId, 5),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof getAccountRecentGames>>;

      const normalizedGames: RecentGame[] = data.map((item) => ({
        id: item.id,
        score: item.score ?? 0,
        created_at: item.created_at,
        game: item.game,
      }));
      setRecentGames(normalizedGames);
    } catch (error) {
      console.warn('Error o timeout cargando juegos:', error);
      setRecentGames([]);
    }
  };

  const loadHighScores = async (userId: string) => {
    try {
      const data = await getAccountHighScores(userId);
      setHighScores(data);
    } catch (error) {
      console.warn('Error cargando records:', error);
      setHighScores([]);
    }
  };

  const loadFriends = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando amigos')), 5000)
      );
      
      const data = await Promise.race([
        getAccountFriends(userId),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof getAccountFriends>>;

      setFriends((data || []) as FriendEntry[]);
    } catch (error) {
      console.warn('Error o timeout cargando amigos:', error);
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
      showToast(t('account.alerts.saveConfigError'), 'error');
    } finally {
      setSavingPrivacy(false);
    }
  };

  const saveUsername = async () => {
    if (!profile) return;

    const newName = editNameValue.trim();

    if (!newName) {
      showToast(t('account.alerts.emptyUsername'), 'error');
      return;
    }

    setSavingName(true);
    try {
      await updateAccountProfile(profile.id, { username: newName });

      setProfile((prev) => (prev ? { ...prev, username: newName } : prev));
      setIsEditingName(false);
    } catch (error) {
      console.error('Error actualizando el nombre:', error);
      showToast(t('account.alerts.saveUsernameError'), 'error');
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
      showToast(t('account.alerts.avatarUpdated'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('account.alerts.avatarUploadError');
      showToast(message, 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!passwordForm.newPassword || !passwordForm.currentPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('account.security.passwords.allFieldsRequired'));
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError(t('account.security.passwords.minLength'));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('account.security.passwords.passwordMismatch'));
      return;
    }

    setChangingPassword(true);
    try {
      await verifyCurrentPassword(passwordForm.currentPassword);
      await updatePassword(passwordForm.newPassword);

      setShowChangePasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast(t('account.alerts.passwordChanged'));
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      const message =
        error instanceof Error && /invalid login credentials/i.test(error.message)
          ? t('account.security.passwords.invalidCurrentPassword')
          : error instanceof Error
            ? error.message
            : t('account.security.passwords.changeError');
      setPasswordError(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEditProfile = async () => {
    setProfileEditError('');

    if (!profile?.id) {
      setProfileEditError(t('account.states.profileLoadError'));
      return;
    }

    if (!editProfileForm.firstName || !editProfileForm.lastName) {
      setProfileEditError(t('account.security.personalInfo.requiredFields'));
      return;
    }

    setEditingProfile(true);
    try {
      await updateAccountProfile(profile.id, {
        username: editProfileForm.username || null,
        first_name: editProfileForm.firstName,
        last_name: editProfileForm.lastName,
        birth_date: editProfileForm.birthDate || null,
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: editProfileForm.username || null,
              first_name: editProfileForm.firstName,
              last_name: editProfileForm.lastName,
              birth_date: editProfileForm.birthDate || null,
            }
          : prev
      );

      setShowEditProfileModal(false);
      showToast(t('account.alerts.profileUpdated'));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const message = error instanceof Error ? error.message : t('account.alerts.profileUpdateError');
      setProfileEditError(message);
    } finally {
      setEditingProfile(false);
    }
  };

  const handleReportPlayer = async () => {
    setReportPlayerError('');

    if (!profile?.id) {
      setReportPlayerError(t('account.states.profileLoadError'));
      return;
    }

    if (!reportPlayerForm.reportedUserId) {
      setReportPlayerError(t('account.security.reportModal.selectUser'));
      return;
    }

    if (!reportPlayerForm.reason) {
      setReportPlayerError(t('account.security.reportModal.selectReason'));
      return;
    }

    setReportingPlayer(true);
    try {
      const result = await reportUser(
        profile.id,
        reportPlayerForm.reportedUserId,
        reportPlayerForm.reason,
        reportPlayerForm.details.trim() || undefined,
      );

      if (!result.success) {
        throw new Error(result.error || t('account.alerts.reportError'));
      }

      setShowReportPlayerModal(false);
      setReportPlayerForm({ reportedUserId: '', reportedUsername: '', searchQuery: '', reason: '', details: '' });
      setReportSearchResults([]);
      showToast(t('account.alerts.reportSent'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('account.alerts.reportError');
      setReportPlayerError(message);
    } finally {
      setReportingPlayer(false);
    }
  };

  const handleReportGame = async () => {
    setReportGameError('');

    if (!profile?.id) {
      setReportGameError(t('account.states.profileLoadError'));
      return;
    }

    if (!reportGameForm.reportedGameId) {
      setReportGameError(t('account.security.reportGameModal.selectGame', { defaultValue: 'Selecciona un juego' }));
      return;
    }

    if (!reportGameForm.reason) {
      setReportGameError(t('account.security.reportGameModal.selectReason', { defaultValue: 'Selecciona un motivo' }));
      return;
    }

    setReportingGame(true);
    try {
      const result = await reportGame(
        profile.id,
        reportGameForm.reportedGameId,
        reportGameForm.reason,
        reportGameForm.details.trim() || undefined,
      );

      if (!result.success) {
        throw new Error(result.error || t('account.alerts.reportError'));
      }

      setShowReportGameModal(false);
      setReportGameForm({ reportedGameId: '', reportedGameTitle: '', searchQuery: '', reason: '', details: '' });
      setReportGameSearchResults([]);
      showToast(t('account.alerts.reportSent'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('account.alerts.reportError');
      setReportGameError(message);
    } finally {
      setReportingGame(false);
    }
  };

  useEffect(() => {
    const runSearch = async () => {
      if (!showReportPlayerModal || !profile?.id) {
        return;
      }

      const query = reportPlayerForm.searchQuery.trim();
      if (query.length < 2) {
        setReportSearchResults([]);
        return;
      }

      setSearchingReportUsers(true);
      setReportPlayerError('');

      try {
        const users = await searchReportableUsers(profile.id, query);
        const normalized = users
          .filter((user: ReportableUser) => !!user.id)
          .map((user: ReportableUser) => ({
            id: user.id,
            username: user.username || t('account.dashboard.defaultUser'),
            avatar_url: user.avatar_url,
            status: user.status,
          }));

        setReportSearchResults(normalized);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('account.alerts.reportError');
        setReportPlayerError(message);
      } finally {
        setSearchingReportUsers(false);
      }
    };

    const timer = setTimeout(() => {
      void runSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [profile?.id, reportPlayerForm.searchQuery, showReportPlayerModal, t]);

  useEffect(() => {
    const runSearch = async () => {
      if (!showReportGameModal || !profile?.id) {
        return;
      }

      const query = reportGameForm.searchQuery.trim();
      if (query.length < 2) {
        setReportGameSearchResults([]);
        return;
      }

      setSearchingReportGames(true);
      setReportGameError('');

      try {
        const games = await searchReportableGames(profile.id, query);
        const normalized = games
          .filter((game: ReportableGame) => !!game.id)
          .map((game: ReportableGame) => ({
            id: game.id,
            title: game.title || t('account.security.reportGameModal.defaultGame', { defaultValue: 'Juego sin título' }),
            thumbnail_url: game.thumbnail_url,
            status: game.status,
            genre: game.genre,
          }));

        setReportGameSearchResults(normalized);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('account.alerts.reportError');
        setReportGameError(message);
      } finally {
        setSearchingReportGames(false);
      }
    };

    const timer = setTimeout(() => {
      void runSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [profile?.id, reportGameForm.searchQuery, showReportGameModal, t]);

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
  const selectedReportedUser =
    reportPlayerForm.reportedUserId
      ? reportSearchResults.find((user) => user.id === reportPlayerForm.reportedUserId) ?? null
      : null;
  const selectedReportedGame =
    reportGameForm.reportedGameId
      ? reportGameSearchResults.find((game) => game.id === reportGameForm.reportedGameId) ?? null
      : null;

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
      {toast && (
        <div className="fixed top-4 right-4 z-60 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
          <div
            className={`rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm flex items-start gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-100'
            }`}
          >
            {toast.type === 'success' ? <Check size={16} className="mt-0.5" /> : <AlertTriangle size={16} className="mt-0.5" />}
            <p className="text-sm font-medium leading-5">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-stretch">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl lg:h-[calc(100vh-7rem)]">
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

          <main className="space-y-6 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            {activeSection === 'dashboard' && (
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
                          <div className="absolute right-0 top-0 w-16 h-full bg-linear-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
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
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden lg:h-full lg:overflow-y-auto">
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
                    <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                    <p className="mt-1 text-sm text-white break-all">{profile.email || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Usuario</p>
                    <p className="mt-1 text-sm text-white">{profile.username || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Nombre</p>
                    <p className="mt-1 text-sm text-white">{profile.first_name || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Apellido</p>
                    <p className="mt-1 text-sm text-white">{profile.last_name || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Fecha de nacimiento</p>
                    <p className="mt-1 text-sm text-white">{profile.birth_date || t('account.personal.notDefined')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Tipo de suscripcion</p>
                    <p className="mt-1 text-sm text-white">{profile.subscription_tier || t('account.personal.notDefined')}</p>
                  </div>               
                </div>
              </section>
            )}

            {activeSection === 'friends' && (
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl lg:h-full lg:overflow-y-auto">
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
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 lg:h-full lg:overflow-y-auto">
                <h3 className="text-xl font-semibold text-white">{t('account.payments.title')}</h3>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.payments.subscriptionType')}</p>
                  <p className="mt-1 text-sm font-medium text-white">{profile.subscription_tier || t('account.payments.defaultSubscription')}</p>
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
              <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:h-full lg:overflow-y-auto">
                <h3 className="text-xl font-semibold text-white">{t('account.security.title')}</h3>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">{t('account.security.personalSection')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
                    >
                      {t('account.security.changePassword')}
                    </button>
                    <button
                      onClick={openEditProfileModal}
                      className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
                    >
                      {t('account.security.accountInfo')}
                    </button>
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
                    <button
                      onClick={openReportPlayerModal}
                      className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
                    >
                      {t('account.security.reportPlayer')}
                    </button>
                    <button
                      onClick={openReportGameModal}
                      className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
                    >
                      {t('account.security.reportGame')}
                    </button>
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

      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
              <Lock size={32} />
              <h3 className="text-2xl font-bold text-white">{t('account.security.changePassword')}</h3>
            </div>

            {passwordError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
                {passwordError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.security.passwords.currentPassword')}</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder={t('account.security.passwords.enterCurrentPassword')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.security.passwords.newPassword')}</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder={t('account.security.passwords.enterNewPassword')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.security.passwords.confirmPassword')}</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder={t('account.security.passwords.confirmNewPassword')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 justify-end">
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {t('account.common.cancel')}
              </button>
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {changingPassword ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  t('account.common.save')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
              <Edit2 size={32} />
              <h3 className="text-2xl font-bold text-white">{t('account.security.accountInfo')}</h3>
            </div>

            {profileEditError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
                {profileEditError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.personal.username')}</label>
                <input
                  type="text"
                  value={editProfileForm.username}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, username: e.target.value })}
                  placeholder={t('account.personal.username')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.personal.name')}</label>
                <input
                  type="text"
                  value={editProfileForm.firstName}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, firstName: e.target.value })}
                  placeholder={t('account.security.personalInfo.enterFirstName')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.personal.lastName')}</label>
                <input
                  type="text"
                  value={editProfileForm.lastName}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, lastName: e.target.value })}
                  placeholder={t('account.security.personalInfo.enterLastName')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.personal.birthDate')}</label>
                <input
                  type="date"
                  value={editProfileForm.birthDate}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, birthDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editProfileForm.email}
                  disabled
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/40 py-2 px-3 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">{t('account.security.personalInfo.emailNotEditable')}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-3 justify-end">
              <button
                onClick={() => {
                  setShowEditProfileModal(false);
                  setProfileEditError('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {t('account.common.cancel')}
              </button>
              <button
                onClick={handleEditProfile}
                disabled={editingProfile}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {editingProfile ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  t('account.common.save')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportPlayerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
              <AlertTriangle size={32} />
              <h3 className="text-2xl font-bold text-white">{t('account.security.reportModal.title')}</h3>
            </div>

            {reportPlayerError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
                {reportPlayerError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportModal.targetUser')}</label>
                {reportPlayerForm.reportedUserId ? (
                  <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-3">
                    <div className="flex items-center gap-3">
                      {selectedReportedUser?.avatar_url ? (
                        <img
                          src={selectedReportedUser.avatar_url}
                          alt={reportPlayerForm.reportedUsername}
                          className="h-11 w-11 rounded-full border border-slate-700 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300">
                          {reportPlayerForm.reportedUsername.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/80">Jugador seleccionado</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="truncate font-semibold text-white">{reportPlayerForm.reportedUsername}</span>
                          <Check size={14} className="text-indigo-300" />
                        </div>
                        <p className="text-xs text-slate-400">
                          {selectedReportedUser?.status || t('chat.status.disconnected')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleReportSearchChange('')}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="text"
                        value={reportPlayerForm.searchQuery}
                        onChange={(e) => handleReportSearchChange(e.target.value)}
                        placeholder={t('account.security.reportModal.searchPlaceholder')}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {searchingReportUsers && (
                      <p className="text-xs text-slate-400 mt-2">{t('account.security.reportModal.searching')}</p>
                    )}

                    {!searchingReportUsers && reportPlayerForm.searchQuery.trim().length >= 2 && reportSearchResults.length === 0 && (
                      <p className="text-xs text-slate-500 mt-2">{t('account.security.reportModal.noResults')}</p>
                    )}

                    {reportSearchResults.length > 0 && (
                      <div className="mt-2 rounded-xl border border-slate-700 bg-slate-800/40 max-h-48 overflow-y-auto">
                        {reportSearchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleReportUserSelect(user)}
                            className="w-full text-left px-3 py-3 text-sm border-b last:border-b-0 border-slate-700/70 text-slate-200 transition-colors hover:bg-slate-700/50"
                          >
                            <div className="flex items-center gap-3">
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={user.username}
                                  className="h-9 w-9 rounded-full border border-slate-700 object-cover"
                                />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
                                  {user.username.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="block truncate font-medium">{user.username}</span>
                                <span className="text-xs text-slate-400">{user.status || t('chat.status.disconnected')}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportModal.reason')}</label>
                <select
                  value={reportPlayerForm.reason}
                  onChange={(e) => setReportPlayerForm({ ...reportPlayerForm, reason: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">{t('account.security.reportModal.selectReason')}</option>
                  <option value="cheating">{t('account.security.reportModal.reasons.cheating')}</option>
                  <option value="abuse">{t('account.security.reportModal.reasons.abuse')}</option>
                  <option value="spam">{t('account.security.reportModal.reasons.spam')}</option>
                  <option value="harassment">{t('account.security.reportModal.reasons.harassment')}</option>
                  <option value="other">{t('account.security.reportModal.reasons.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportModal.details')}</label>
                <textarea
                  value={reportPlayerForm.details}
                  onChange={(e) => setReportPlayerForm({ ...reportPlayerForm, details: e.target.value })}
                  placeholder={t('account.security.reportModal.detailsPlaceholder')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 min-h-28 resize-y"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 justify-end">
              <button
                onClick={() => {
                  setShowReportPlayerModal(false);
                  setReportPlayerError('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {t('account.common.cancel')}
              </button>
              <button
                onClick={handleReportPlayer}
                disabled={reportingPlayer}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {reportingPlayer ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  t('account.security.reportModal.submit')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportGameModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
              <Gamepad2 size={32} />
              <h3 className="text-2xl font-bold text-white">
                {t('account.security.reportGameModal.title', { defaultValue: 'Reportar juego' })}
              </h3>
            </div>

            {reportGameError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
                {reportGameError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  {t('account.security.reportGameModal.targetGame', { defaultValue: 'Juego' })}
                </label>
                {reportGameForm.reportedGameId ? (
                  <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-3">
                    <div className="flex items-center gap-3">
                      {selectedReportedGame?.thumbnail_url ? (
                        <img
                          src={selectedReportedGame.thumbnail_url}
                          alt={reportGameForm.reportedGameTitle}
                          className="h-11 w-11 rounded-xl border border-slate-700 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300">
                          <Gamepad2 size={18} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/80">
                          {t('account.security.reportGameModal.selectedGameLabel', { defaultValue: 'Juego seleccionado' })}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="truncate font-semibold text-white">{reportGameForm.reportedGameTitle}</span>
                          <Check size={14} className="text-indigo-300" />
                        </div>
                        <p className="text-xs text-slate-400">
                          {selectedReportedGame?.genre || selectedReportedGame?.status || t('account.security.reportGameModal.noMetadata', { defaultValue: 'Sin información adicional' })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGameReportSearchChange('')}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
                      >
                        {t('account.security.reportGameModal.changeSelection', { defaultValue: 'Cambiar' })}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="text"
                        value={reportGameForm.searchQuery}
                        onChange={(e) => handleGameReportSearchChange(e.target.value)}
                        placeholder={t('account.security.reportGameModal.searchPlaceholder', { defaultValue: 'Busca por nombre del juego (min. 2 caracteres)' })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {searchingReportGames && (
                      <p className="text-xs text-slate-400 mt-2">
                        {t('account.security.reportGameModal.searching', { defaultValue: 'Buscando juegos...' })}
                      </p>
                    )}

                    {!searchingReportGames && reportGameForm.searchQuery.trim().length >= 2 && reportGameSearchResults.length === 0 && (
                      <p className="text-xs text-slate-500 mt-2">
                        {t('account.security.reportGameModal.noResults', { defaultValue: 'No se encontraron juegos con ese nombre.' })}
                      </p>
                    )}

                    {reportGameSearchResults.length > 0 && (
                      <div className="mt-2 rounded-xl border border-slate-700 bg-slate-800/40 max-h-48 overflow-y-auto">
                        {reportGameSearchResults.map((game) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => handleReportGameSelect(game)}
                            className="w-full text-left px-3 py-3 text-sm border-b last:border-b-0 border-slate-700/70 text-slate-200 transition-colors hover:bg-slate-700/50"
                          >
                            <div className="flex items-center gap-3">
                              {game.thumbnail_url ? (
                                <img
                                  src={game.thumbnail_url}
                                  alt={game.title}
                                  className="h-10 w-10 rounded-lg border border-slate-700 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300">
                                  <Gamepad2 size={18} />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="block truncate font-medium">{game.title}</span>
                                <span className="text-xs text-slate-400">
                                  {game.genre || game.status || t('account.security.reportGameModal.noMetadata', { defaultValue: 'Sin información adicional' })}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  {t('account.security.reportGameModal.reason', { defaultValue: 'Motivo' })}
                </label>
                <select
                  value={reportGameForm.reason}
                  onChange={(e) => setReportGameForm({ ...reportGameForm, reason: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">{t('account.security.reportGameModal.selectReason', { defaultValue: 'Selecciona un motivo' })}</option>
                  <option value="bug">{t('account.security.reportGameModal.reasons.bug', { defaultValue: 'Error o bug' })}</option>
                  <option value="inappropriate">{t('account.security.reportGameModal.reasons.inappropriate', { defaultValue: 'Contenido inapropiado' })}</option>
                  <option value="broken_link">{t('account.security.reportGameModal.reasons.brokenLink', { defaultValue: 'No carga o enlace roto' })}</option>
                  <option value="copyright">{t('account.security.reportGameModal.reasons.copyright', { defaultValue: 'Problema de derechos' })}</option>
                  <option value="other">{t('account.security.reportGameModal.reasons.other', { defaultValue: 'Otro' })}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  {t('account.security.reportGameModal.details', { defaultValue: 'Detalles' })}
                </label>
                <textarea
                  value={reportGameForm.details}
                  onChange={(e) => setReportGameForm({ ...reportGameForm, details: e.target.value })}
                  placeholder={t('account.security.reportGameModal.detailsPlaceholder', { defaultValue: 'Describe brevemente el problema del juego...' })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 min-h-28 resize-y"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 justify-end">
              <button
                onClick={() => {
                  setShowReportGameModal(false);
                  setReportGameError('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {t('account.common.cancel')}
              </button>
              <button
                onClick={handleReportGame}
                disabled={reportingGame}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {reportingGame ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  t('account.security.reportGameModal.submit', { defaultValue: 'Enviar reporte' })
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

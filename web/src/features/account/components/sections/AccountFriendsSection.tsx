import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Search } from 'lucide-react';

type FriendEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

type AccountFriendsSectionProps = {
  friendsSearch: string;
  filteredFriends: FriendEntry[];
  onFriendsSearchChange: (value: string) => void;
};

export function AccountFriendsSection({
  friendsSearch,
  filteredFriends,
  onFriendsSearchChange,
}: AccountFriendsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="text-xl font-semibold text-white">{t('account.friends.title')}</h3>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={friendsSearch}
            onChange={(e) => onFriendsSearchChange(e.target.value)}
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
  );
}

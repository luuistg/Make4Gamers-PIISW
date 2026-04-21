export type AccountProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  status: string | null;
  allow_requests: boolean | null;
  role: string | null;
  location: string | null;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  phone: string | null;
  subscription_type: string | null;
};

export type AccountRecentGame = {
  id: number | string;
  score: number | null;
  created_at: string;
  game: { title: string | null } | null;
};

export type AccountRecentGameRaw = {
  id: number | string;
  score: number | null;
  created_at: string;
  game: { title: string | null } | Array<{ title: string | null }> | null;
};

export type AccountFriend = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

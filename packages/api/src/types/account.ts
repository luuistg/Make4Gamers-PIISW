export type AccountProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  status: string | null;
  allow_requests: boolean | null;
  role: string | null;
  location: string | null;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
  subscription_tier: string | null;
  subscription_end_date: string | null;
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

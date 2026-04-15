import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Achievement,
  UserAchievement,
  UserAchievementMetadata,
  UserAchievementWithAchievement,
} from "../types/achievement";

const ACHIEVEMENT_SELECT_FIELDS = `
  id,
  code,
  title,
  description,
  platform_scope,
  badge_icon,
  is_active,
  created_at
`;

const USER_ACHIEVEMENT_SELECT_FIELDS = `
  id,
  user_id,
  achievement_id,
  unlocked_at,
  source,
  metadata,
  created_at
`;

const USER_ACHIEVEMENT_WITH_DEFINITION_SELECT_FIELDS = `
  ${USER_ACHIEVEMENT_SELECT_FIELDS},
  achievement:achievements (
    ${ACHIEVEMENT_SELECT_FIELDS}
  )
`;

function isMetadataRecord(value: unknown): value is UserAchievementMetadata {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeUserAchievement(
  record: Omit<UserAchievement, "metadata"> & { metadata: unknown },
): UserAchievement {
  return {
    ...record,
    metadata: isMetadataRecord(record.metadata) ? record.metadata : {},
  };
}

export async function findAchievementByCode(
  client: SupabaseClient,
  code: string,
): Promise<Achievement | null> {
  const { data, error } = await client
    .from("achievements")
    .select(ACHIEVEMENT_SELECT_FIELDS)
    .eq("code", code)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se pudo recuperar el logro");
  }

  return (data as Achievement | null) ?? null;
}

export async function findUserAchievement(
  client: SupabaseClient,
  input: { userId: string; achievementId: string },
): Promise<UserAchievement | null> {
  const { data, error } = await client
    .from("user_achievements")
    .select(USER_ACHIEVEMENT_SELECT_FIELDS)
    .eq("user_id", input.userId)
    .eq("achievement_id", input.achievementId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se pudo recuperar el logro del usuario");
  }

  if (!data) {
    return null;
  }

  return normalizeUserAchievement(data as Omit<UserAchievement, "metadata"> & { metadata: unknown });
}

export async function insertUserAchievement(
  client: SupabaseClient,
  input: {
    userId: string;
    achievementId: string;
    source?: string;
    metadata?: UserAchievementMetadata;
  },
): Promise<UserAchievement> {
  const { data, error } = await client
    .from("user_achievements")
    .insert({
      user_id: input.userId,
      achievement_id: input.achievementId,
      source: input.source ?? null,
      metadata: input.metadata ?? {},
    })
    .select(USER_ACHIEVEMENT_SELECT_FIELDS)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "No se pudo guardar el logro del usuario");
  }

  return normalizeUserAchievement(data as Omit<UserAchievement, "metadata"> & { metadata: unknown });
}

export async function findUserAchievements(
  client: SupabaseClient,
  userId: string,
): Promise<UserAchievementWithAchievement[]> {
  const { data, error } = await client
    .from("user_achievements")
    .select(USER_ACHIEVEMENT_WITH_DEFINITION_SELECT_FIELDS)
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los logros del usuario");
  }

  return ((data ?? []) as Array<
    Omit<UserAchievement, "metadata"> & {
      metadata: unknown;
      achievement: Achievement | Achievement[] | null;
    }
  >)
    .map((record) => {
      const achievement = Array.isArray(record.achievement)
        ? record.achievement[0] ?? null
        : record.achievement;

      if (!achievement) {
        return null;
      }

      return {
        ...normalizeUserAchievement(record),
        achievement,
      } satisfies UserAchievementWithAchievement;
    })
    .filter((record): record is UserAchievementWithAchievement => record !== null);
}

import { supabase } from "../../supabase";

export type Achievement = {
  id: string;
  game_id: string;
  title: string;
  description: string;
  criteria_type: "score_min" | "rank_top" | "manual";
  criteria_value: number;
  created_at: string;
  updated_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  awarded_at: string;
  achievement?: Achievement;
};

export async function getGameAchievements(gameId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: true });

  if (error) {
    if (error.message?.includes("Could not find table") || error.message?.includes("relation \"achievements\" does not exist")) {
      console.warn("Tabla achievements no existe, deshabilitando logros: ", error.message);
      return [];
    }
    throw new Error(error.message || "No se pudieron recuperar las insignias");
  }
  return (data ?? []) as Achievement[];
}

export async function getUserAchievements(userId: string, gameId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from("user_achievements")
    .select(`
      id,
      user_id,
      achievement_id,
      awarded_at,
      achievement(*)
    `)
    .eq("user_id", userId)
    .eq("achievement.game_id", gameId);

  if (error) {
    if (error.message?.includes("Could not find table") || error.message?.includes("relation \"user_achievements\" does not exist")) {
      console.warn("Tabla user_achievements no existe, deshabilitando progreso de logros: ", error.message);
      return [];
    }
    throw new Error(error.message || "Error al recuperar logros");
  }
  return (data ?? []) as unknown as UserAchievement[];
}

export async function awardAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_id: achievementId,
    })
    .select(`id, user_id, achievement_id, awarded_at, achievement(*)`)
    .single();

  // Si el error es duplicado, devolver estado silencioso (ya lo tiene)
  if (error) {
    if (error.code === "23505") {
      return { id: "", user_id: userId, achievement_id: achievementId, awarded_at: new Date().toISOString() } as UserAchievement;
    }
    throw new Error(error.message || "No se pudo otorgar el logro");
  }

  return data as unknown as UserAchievement;
}

export async function createGameAchievement(input: {
  gameId: string;
  title: string;
  description: string;
  criteriaType: "score_min" | "rank_top" | "manual";
  criteriaValue: number;
}): Promise<Achievement> {
  const { data, error } = await supabase
    .from("achievements")
    .insert({
      game_id: input.gameId,
      title: input.title,
      description: input.description,
      criteria_type: input.criteriaType,
      criteria_value: input.criteriaValue,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message || "No se pudo crear el logro");
  return data as Achievement;
}

export async function checkAndAwardAchievements(
  userId: string,
  gameId: string,
  score: number,
): Promise<UserAchievement[]> {
  if (!userId || !gameId) return [];

  const [allAchievements, alreadyAwarded] = await Promise.all([
    getGameAchievements(gameId),
    getUserAchievements(userId, gameId),
  ]);

  const awardedIds = new Set(alreadyAwarded.map((a) => a.achievement_id));
  const usersToAward: Promise<UserAchievement>[] = [];

  for (const ach of allAchievements) {
    if (awardedIds.has(ach.id)) continue;

    if (ach.criteria_type === "score_min" && score >= ach.criteria_value) {
      usersToAward.push(awardAchievement(userId, ach.id));
    }
  }

  if (usersToAward.length === 0) return [];
  return Promise.all(usersToAward);
}


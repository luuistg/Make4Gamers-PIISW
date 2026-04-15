import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "../repositories/auth.repository";
import {
  findUserGameplayStat,
  insertUserGameplayStat,
  updateUserGameplayStat,
} from "../repositories/gameplay-stats.repository";
import { unlockAchievementByCode } from "./achievements.service";
import type { RegisterGamePlaytimeResult } from "../types/gameplay-stat";

export const MOBILE_ONE_HOUR_SINGLE_GAME_ACHIEVEMENT_CODE = "mobile_one_hour_single_game";

// Umbral reducido para la demo: el logro mantiene la narrativa de 1 hora,
// pero se desbloquea tras 20 segundos acumulados en un unico juego.
const DEMO_ONE_HOUR_IN_SECONDS = 20;

function normalizeTrackedSeconds(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
}

export async function registerTrackedGamePlaytime(
  client: SupabaseClient,
  input: {
    gameId: string;
    gameTitle?: string;
    additionalSeconds: number;
  },
): Promise<RegisterGamePlaytimeResult> {
  const addedSeconds = normalizeTrackedSeconds(input.additionalSeconds);
  const userId = await getCurrentUserId(client);

  if (!userId) {
    return {
      status: "requires_auth",
      addedSeconds,
      gameplayStat: null,
      achievementResult: null,
    };
  }

  if (!input.gameId) {
    throw new Error("El identificador del juego es obligatorio para registrar tiempo");
  }

  const lastPlayedAt = new Date().toISOString();
  const currentGameplayStat = await findUserGameplayStat(client, {
    userId,
    gameKey: input.gameId,
  });

  const totalPlayedSeconds = (currentGameplayStat?.played_seconds ?? 0) + addedSeconds;

  const gameplayStat = currentGameplayStat
    ? await updateUserGameplayStat(client, {
        id: currentGameplayStat.id,
        playedSeconds: totalPlayedSeconds,
        lastPlayedAt,
        gameTitle: input.gameTitle,
      })
    : await insertUserGameplayStat(client, {
        userId,
        gameKey: input.gameId,
        gameTitle: input.gameTitle,
        playedSeconds: totalPlayedSeconds,
        lastPlayedAt,
      });

  const achievementResult =
    gameplayStat.played_seconds >= DEMO_ONE_HOUR_IN_SECONDS
      ? await unlockAchievementByCode(client, {
          code: MOBILE_ONE_HOUR_SINGLE_GAME_ACHIEVEMENT_CODE,
          platformScope: "mobile",
          source: "gameplay_time",
          metadata: {
            event: "single_game_one_hour",
            gameId: input.gameId,
            gameTitle: input.gameTitle ?? gameplayStat.game_title ?? null,
            registeredSeconds: gameplayStat.played_seconds,
            platform: "mobile",
          },
        })
      : null;

  return {
    status: "tracked",
    addedSeconds,
    gameplayStat,
    achievementResult,
  };
}

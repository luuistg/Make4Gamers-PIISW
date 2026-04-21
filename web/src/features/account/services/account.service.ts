import {
  getAccountFriends as getAccountFriendsFromApi,
  getAccountProfile as getAccountProfileFromApi,
  getAccountRecentGames as getAccountRecentGamesFromApi,
  updateAccountProfile as updateAccountProfileFromApi,
  type AccountFriend,
  type AccountProfile,
  type AccountRecentGame,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { AccountProfile, AccountRecentGame, AccountFriend };

export function getAccountProfile(userId: string): Promise<AccountProfile> {
  return getAccountProfileFromApi(supabase, userId);
}

export function updateAccountProfile(
  userId: string,
  patch: Partial<Omit<AccountProfile, "id">>,
): Promise<void> {
  return updateAccountProfileFromApi(supabase, userId, patch);
}

export function getAccountRecentGames(userId: string, limit = 5): Promise<AccountRecentGame[]> {
  return getAccountRecentGamesFromApi(supabase, userId, limit);
}

export function getAccountFriends(userId: string): Promise<AccountFriend[]> {
  return getAccountFriendsFromApi(supabase, userId);
}

export async function getAccountHighScores(userId: string) {
  const { data, error } = await supabase
    .from('scores')
    .select(`id, score, game:games(title)`)
    .eq('user_id', userId)
    .order('score', { ascending: false });

  if (error || !data) {
    console.error("Error obteniendo récords:", error);
    return [];
  }

  const bestScores: any[] = [];
  const seenGames = new Set();

  data.forEach((item: any) => {
    const gameData = item.game;
    const gameTitle = (Array.isArray(gameData) ? gameData[0]?.title : gameData?.title) || 'Desconocido';

    if (!seenGames.has(gameTitle)) {
      seenGames.add(gameTitle);
      bestScores.push({ ...item, displayTitle: gameTitle });
    }
  });

  return bestScores.slice(0, 3);
}



export interface GameStat {
  name: string;
  plays: number;
  highScore: number;
}

export interface ScoreHistory {
  date: string;
  score: number;
  game: string;
}



export async function getUserDetailedStats(userId: string) {
  try {
   
    const { data: scoreDataRaw } = await supabase
      .from('scores')
      .select('score, created_at, game:games(title)')
      .eq('user_id', userId);


    const { data: matchesDataRaw } = await supabase
      .from('matches')
      .select('created_at, game:games(title)')
      .eq('player_1', userId);

    const scoreData: any[] = scoreDataRaw || [];
    const matchesData: any[] = matchesDataRaw || [];

  
    const gameMap: Record<string, GameStat> = {};

   
    matchesData.forEach(match => {
      const rawTitle = Array.isArray(match.game) ? match.game[0]?.title : match.game?.title;
      const title = rawTitle || 'Desconocido';

      if (!gameMap[title]) {
        gameMap[title] = { name: title, plays: 0, highScore: 0 };
      }
      gameMap[title].plays += 1;
    });

  
    scoreData.forEach(item => {
      const rawTitle = Array.isArray(item.game) ? item.game[0]?.title : item.game?.title;
      const title = rawTitle || 'Desconocido';

      if (!gameMap[title]) {
        gameMap[title] = { name: title, plays: 0, highScore: 0 };
      }
      if (item.score > gameMap[title].highScore) {
        gameMap[title].highScore = item.score;
      }
    });

    const chartData = Object.values(gameMap);

   
    const historyData = scoreData.map(item => {
      const rawTitle = Array.isArray(item.game) ? item.game[0]?.title : item.game?.title;
      return {
        date: new Date(item.created_at).toLocaleDateString(),
        score: item.score,
        game: rawTitle || 'Juego'
      };
    });

  
    const totalMatches = matchesData.length; 
    const highestScore = scoreData.length > 0 ? Math.max(...scoreData.map(s => s.score)) : 0;
    
    const favorite = chartData.reduce((prev, current) => 
      (prev.plays > current.plays) ? prev : current, 
      { name: 'Aún sin datos', plays: 0 }
    );

    return {
      totalMatches,
      highestScore,
      favoriteGame: favorite.name,
      favoriteGamePlays: favorite.plays,
      chartData, 
      historyData 
    };

  } catch (error) {
    console.error("Error en el servicio de estadísticas:", error);
    return null;
  }
}
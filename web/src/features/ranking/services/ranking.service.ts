import { supabase } from '../../../supabase';

export interface RankingEntry {
  game_id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  best_score: number;
}

export interface TierInfo {
  name: string;
  color: string;
  icon: string; 
}


export const getPlayerTier = (score: number): TierInfo => {

  if (score >= 100000) return { name: 'Ray-Tracing', color: 'text-purple-400', icon: '/assets/emblems/ps5Emblem.png' };
  if (score >= 50000) return { name: '4K Resolution', color: 'text-blue-400', icon: '/assets/emblems/ps4Emblem.png' };
  if (score >= 15000) return { name: 'High Definition', color: 'text-yellow-400', icon: '/assets/emblems/ps3Emblem.png' };
  if (score >= 5000) return { name: 'Cell Core', color: 'text-slate-300', icon: '/assets/emblems/ps2Emblem.png' };
  if (score >= 1000) return { name: 'Polygon Zero', color: 'text-amber-600', icon: '/assets/emblems/ps1Emblem.png' };
  
 
  return { name: '16 - Bit', color: 'text-slate-500', icon: '/assets/emblems/nintendoEmblem.png' }; 
};

export const getRankingByGame = async (gameId: string): Promise<RankingEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('game_ranking')
      .select('*')
      .eq('game_id', gameId)
      .order('best_score', { ascending: false })
      .limit(100); 

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo el ranking:', error);
    return [];
  }
};


export const getUserRankPosition = async (gameId: string, userId: string): Promise<number | null> => {
    try {
        
        const { data, error } = await supabase
            .from('game_ranking')
            .select('user_id')
            .eq('game_id', gameId)
            .order('best_score', { ascending: false });

        if (error) throw error;
        
        const position = data.findIndex(entry => entry.user_id === userId);
        return position !== -1 ? position + 1 : null;
    } catch (error) {
        console.error('Error obteniendo posición del usuario:', error);
        return null;
    }
};


import { registrarPuntos as registrarPuntosFromApi } from '../../../../../packages/api/src';
export const registrarPuntos = async (userId: string, puntos: number, nombreHito: string) => {
  return registrarPuntosFromApi(supabase, userId, puntos, nombreHito);
};
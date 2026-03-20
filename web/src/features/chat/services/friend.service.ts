
import { supabase } from '../../../supabase';
import type { ChatProfile } from '../types/chat.types';


export const searchUsers = async (currentUserId: string, searchTerm: string): Promise<ChatProfile[]> => {
    if (!searchTerm.trim()) return [];

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url') 
        .neq('id', currentUserId)
        .ilike('username', `%${searchTerm}%`)
        .limit(10);

    if (error) {
        console.error("Error buscando usuarios:", error);
        return [];
    }

  
    return (data || []).map(profile => ({
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        status: 'Disponible' 
    }));
};


export const addFriend = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    try {
   
        const { data: existing } = await supabase
            .from('friendships')
            .select('id')
            .or(`and(user_a.eq.${currentUserId},user_b.eq.${targetUserId}),and(user_a.eq.${targetUserId},user_b.eq.${currentUserId})`)
            .single();

        if (existing) {
            console.log("Ya sois amigos o hay una solicitud pendiente.");
            return true; 
        }

     
        const { error } = await supabase
            .from('friendships')
            .insert({
                user_a: currentUserId,
                user_b: targetUserId,
                status: 'accepted'
            });

        if (error) throw error;
        return true;

    } catch (err) {
        console.error("Error al añadir amigo:", err);
        return false;
    }
};
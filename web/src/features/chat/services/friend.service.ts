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

        //Se crea solicitud
        const { error } = await supabase
            .from('friendships')
            .insert({
                user_a: currentUserId,
                user_b: targetUserId,
                status: 'pending'
            });

        if (error) throw error;
        return true;

    } catch (err) {
        console.error("Error al añadir amigo:", err);
        return false;
    }
};

export const removeFriend = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    try {
        const { data: data1, error: err1 } = await supabase
            .from('friendships')
            .delete()
            .eq('user_a', currentUserId)
            .eq('user_b', targetUserId)
            .select();

        const { data: data2, error: err2 } = await supabase
            .from('friendships')
            .delete()
            .eq('user_a', targetUserId)
            .eq('user_b', currentUserId)
            .select();

        if (err1 || err2) {
            console.error("Error en Supabase:", err1 || err2);
            return false;
        }

        console.log("Borrados intento 1:", data1);
        console.log("Borrados intento 2:", data2);

        if ((!data1 || data1.length === 0) && (!data2 || data2.length === 0)) {
            alert("Supabase ha bloqueado el borrado. ¡Falta la política de DELETE (RLS)!");
            return false;
        }

        return true;

    } catch (err) {
        console.error("Error al eliminar amigo:", err);
        return false;
    }
};
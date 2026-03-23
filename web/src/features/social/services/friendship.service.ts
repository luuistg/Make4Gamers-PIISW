import { supabase } from '../../../supabase';
export const friendshipService = {
  
  //Enviar solicitud de amistad
  async sendFriendRequest(senderId: string, receiverId: string) {
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('extra_config')
      .eq('user_id', receiverId)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }

    if (settings?.extra_config && settings.extra_config.allow_stranger_requests === false) {
       throw new Error('Este perfil tiene las solicitudes de desconocidos desactivadas.');
    }

    const { data: existing } = await supabase
      .from('friendships')
      .select('id')
      .or(`and(user_a.eq.${senderId},user_b.eq.${receiverId}),and(user_a.eq.${receiverId},user_b.eq.${senderId})`)
      .single();

    if (existing) {
        throw new Error('Ya existe una relación o solicitud pendiente con este usuario.');
    }

    //Insertar la solicitud
    const { data, error } = await supabase
      .from('friendships')
      .insert([
        { user_a: senderId, user_b: receiverId, status: 'pending' }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  //Aceptar solicitud
  async acceptFriendRequest(requestId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  //Rechazar solicitud
  async rejectFriendRequest(requestId: string) {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
    return true;
  },

  //Obtener soliciutd pendientes recibidas
  async getPendingRequests(myUserId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        created_at,
        sender:profiles!friendships_user_a_fkey(id, username, avatar_url)
      `)
      .eq('user_b', myUserId)
      .eq('status', 'pending');

    if (error) throw error;
    return data;
  },

  //Obtener lista de amigos
  async getFriends(myUserId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        user_a,
        user_b,
        profile_a:profiles!friendships_user_a_fkey(id, username, avatar_url, status),
        profile_b:profiles!friendships_user_b_fkey(id, username, avatar_url, status)
      `)
      .eq('status', 'accepted')
      .or(`user_a.eq.${myUserId},user_b.eq.${myUserId}`);

    if (error) throw error;

    //Formateo para devolver solo los datos del otro usuario
    return data.map((friendship: any) => {
        const isUserA = friendship.user_a === myUserId;
        return {
            friendshipId: friendship.id,
            friendProfile: isUserA ? friendship.profile_b : friendship.profile_a
        };
    });
  }
};
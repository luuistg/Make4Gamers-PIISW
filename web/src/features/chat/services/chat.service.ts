
import { supabase } from '../../../supabase';
import type { ChatProfile } from '../types/chat.types';



export const getFriendsList = async (currentUserId: string): Promise<ChatProfile[]> => {

    const { data: friendships, error: friendError } = await supabase
        .from('friendships')
        .select('user_a, user_b')
        .eq('status', 'accepted')
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`);

    if (friendError) {
        console.error("Error obteniendo amistades:", friendError);
        return [];
    }

    const friendIds = friendships.map(f => f.user_a === currentUserId ? f.user_b : f.user_a);

    if (friendIds.length === 0) return [];



    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, status') 
        .in('id', friendIds);

    if (profileError) {
        console.error("Error obteniendo perfiles de amigos:", profileError);
        return [];
    }

 
    return (profiles || []).map(profile => ({
        id: profile.id,
        username: profile.username || 'Usuario',
        avatar_url: profile.avatar_url,
        status: profile.status || 'Disponible' 
    }));
};


export const getOrCreateChatRoom = async (myId: string, friendId: string): Promise<string | null> => {

  const { data: myRooms, error: myRoomsError } = await supabase
    .from('chat_participants')
    .select('room_id')
    .eq('user_id', myId);

  if (myRoomsError || !myRooms) return null;

  const myRoomIds = myRooms.map(r => r.room_id);

  if (myRoomIds.length > 0) {
  
    const { data: sharedRoom } = await supabase
      .from('chat_participants')
      .select('room_id')
      .in('room_id', myRoomIds)
      .eq('user_id', friendId)
      .single();

    if (sharedRoom) return sharedRoom.room_id; 
  }

 
  const { data: newRoom, error: roomError } = await supabase
    .from('chat_rooms')
    .insert([{ is_group: false }])
    .select('id')
    .single();

  if (roomError || !newRoom) return null;


  await supabase.from('chat_participants').insert([
    { room_id: newRoom.id, user_id: myId },
    { room_id: newRoom.id, user_id: friendId }
  ]);

  return newRoom.id;
};


export const sendMessage = async (roomId: string, currentUserId: string, content: string) => {
    const { error } = await supabase
        .from('messages')
        .insert({
            room_id: roomId,
            sender_id: currentUserId, 
            content: content
        });

    if (error) {
        console.error("Error enviando mensaje:", error);
        throw error;
    }
};


export const updateUserStatus = async (userId: string, newStatus: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("Error actualizando estado:", err);
        return false;
    }
};
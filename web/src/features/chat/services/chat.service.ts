
import { supabase } from '../../../supabase';
import type { ChatProfile } from '../types/chat.types';

export const getFriendsList = async (currentUserId: string): Promise<ChatProfile[]> => {
    const { data: friendships, error: friendError } = await supabase
        .from('friendships')
        .select('user_a, user_b')
        .eq('status', 'accepted')
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`);

    let friendProfiles: ChatProfile[] = [];

    if (!friendError && friendships && friendships.length > 0) {
        const friendIds = friendships.map(f => f.user_a === currentUserId ? f.user_b : f.user_a);
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, status') 
            .in('id', friendIds);

        if (!profileError && profiles) {
            friendProfiles = profiles.map(profile => ({
                id: profile.id,
                username: profile.username || 'Usuario',
                avatar_url: profile.avatar_url,
                status: profile.status || 'Disponible',
                is_group: false
            }));
        }
    }

    const { data: myGroups, error: groupError } = await supabase
        .from('chat_participants')
        .select('room_id, chat_rooms!inner(is_group)')
        .eq('user_id', currentUserId)
        .eq('chat_rooms.is_group', true);

    let groupProfiles: ChatProfile[] = [];

    if (!groupError && myGroups && myGroups.length > 0) {
        const roomIds = myGroups.map(g => g.room_id);

        const { data: allParticipants } = await supabase
            .from('chat_participants')
            .select('room_id, profiles(username)')
            .in('room_id', roomIds);

        // Agrupar los nombres por sala
        const roomMap = new Map<string, string[]>();
        allParticipants?.forEach(p => {
            if (!roomMap.has(p.room_id)) roomMap.set(p.room_id, []);
            // @ts-ignore - Supabase devuelve profiles anidado
            if (p.profiles?.username) roomMap.get(p.room_id)?.push(p.profiles.username);
        });

        groupProfiles = roomIds.map(roomId => {
            const members = roomMap.get(roomId) || [];
            const title = `Grupo (${members.length}): ${members.join(', ')}`;

            return {
                id: roomId,
                room_id: roomId,
                username: title.length > 25 ? title.substring(0, 22) + '...' : title, // Cortar si es muy largo
                avatar_url: null,
                status: 'Grupo',
                is_group: true
            };
        });
    }

    return [...friendProfiles, ...groupProfiles];
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

export const markMessagesAsRead = async (roomId: string, currentUserId: string) => {
    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .neq('sender_id', currentUserId) 
        .eq('is_read', false); 

    if (error) {
        console.error("Error marcando mensajes como leídos:", error);
    }
};

export const createGroupChat = async (currentUserId: string, participantIds: string[], groupName: string): Promise<string | null> => {
    try {
        //Crear la sala
        const { data: newRoom, error: roomError } = await supabase
            .from('chat_rooms')
            .insert([{ is_group: true }])
            .select('id')
            .single();

        if (roomError || !newRoom) throw roomError;

        //Añadir participantes
        const participants = [currentUserId, ...participantIds].map(id => ({
            room_id: newRoom.id,
            user_id: id
        }));

        const { error: partError } = await supabase
            .from('chat_participants')
            .insert(participants);

        if (partError) throw partError;

        return newRoom.id;

    } catch (error) {
        console.error("Error creando grupo:", error);
        return null;
    }
};
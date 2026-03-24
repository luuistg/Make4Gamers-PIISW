import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import type { Message } from '../types/chat.types';
import { markMessagesAsRead } from '../services/chat.service';

export function useChatMessages(roomId: string | null, currentUserId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId || !currentUserId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Error cargando historial:", error);
            } else {
                setMessages(data as Message[]);
                // Marcamos como leídos los que estaban pendientes
                await markMessagesAsRead(roomId, currentUserId);
            }
            setLoading(false);
        };

        fetchMessages();

        // 🌟 Canal de Tiempo Real sin el filtro estricto de Supabase
        const channel = supabase.channel(`room_${roomId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages' 
            }, (payload) => {
                
                if (payload.eventType === 'INSERT') {
                    const newMessage = payload.new as Message;
                    // Confirmamos que el mensaje es para esta sala
                    if (newMessage.room_id === roomId) {
                        setMessages((prev) => [...prev, newMessage]);
                        
                        if (newMessage.sender_id !== currentUserId) {
                            markMessagesAsRead(roomId, currentUserId);
                        }
                    }
                }
                else if (payload.eventType === 'UPDATE') {
                    const partialUpdate = payload.new; 
                    
                    // 🌟 LA MAGIA: Buscamos el mensaje y lo "fusionamos" con los datos nuevos
                    setMessages((prev) => prev.map(msg =>
                        msg.id === partialUpdate.id
                            ? { ...msg, ...partialUpdate } // Combina el texto antiguo con el is_read: true
                            : msg
                    ));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, currentUserId]);

    return { messages, loading };
}
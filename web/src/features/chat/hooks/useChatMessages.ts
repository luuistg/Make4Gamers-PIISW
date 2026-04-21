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
               
                await markMessagesAsRead(roomId, currentUserId);
            }
            setLoading(false);
        };

        fetchMessages();

       
        const channel = supabase.channel(`room_${roomId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages' 
            }, (payload) => {
                
                if (payload.eventType === 'INSERT') {
                    const newMessage = payload.new as Message;
                   
                    if (newMessage.room_id === roomId) {
                        setMessages((prev) => [...prev, newMessage]);
                        
                        if (newMessage.sender_id !== currentUserId) {
                            markMessagesAsRead(roomId, currentUserId);
                        }
                    }
                }
                else if (payload.eventType === 'UPDATE') {
                    const partialUpdate = payload.new; 
                    
                    
                    setMessages((prev) => prev.map(msg =>
                        msg.id === partialUpdate.id
                            ? { ...msg, ...partialUpdate }
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
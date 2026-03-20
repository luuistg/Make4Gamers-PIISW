import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import type { Message } from '../types/chat.types';

export function useChatMessages(roomId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) return;

       
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
            }
            setLoading(false);
        };

        fetchMessages();

      
        const channel = supabase.channel(`room_${roomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${roomId}`
            }, (payload) => {
                const newMessage = payload.new as Message;
                setMessages((prev) => [...prev, newMessage]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

    return { messages, loading };
}
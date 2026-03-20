
import { useEffect, useState } from 'react';
import { getFriendsList } from '../services/chat.service';
import type { ChatProfile } from '../types/chat.types';

interface FriendListProps {
    currentUserId: string | null;
    onSelectFriend: (friend: ChatProfile) => void;
    selectedFriendId?: string;
}

export default function FriendList({ currentUserId, onSelectFriend, selectedFriendId }: FriendListProps) {
    const [friends, setFriends] = useState<ChatProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!currentUserId) return;
            const data = await getFriendsList(currentUserId);
            setFriends(data);
            setLoading(false);
        };
        fetchFriends();
    }, [currentUserId]);

   
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Disponible': return 'bg-green-500';
            case 'Ausente': return 'bg-yellow-500';
            case 'Ocupado': return 'bg-red-500';
            default: return 'bg-slate-500'; 
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-slate-400">Cargando amigos...</div>;
    }

    if (friends.length === 0) {
        return <div className="p-4 text-center text-slate-500 text-sm">No tienes amigos añadidos aún. ¡Busca a alguien para chatear!</div>;
    }

    return (
        <div className="flex flex-col">
            {friends.map((friend) => (
                <button
                    key={friend.id}
                    onClick={() => onSelectFriend(friend)}
                    className={`flex items-center gap-3 p-3 transition-all text-left border-b border-slate-700/50 hover:bg-slate-700/50 ${
                        selectedFriendId === friend.id ? 'bg-slate-700/80' : ''
                    }`}
                >
                    {/* Contenedor del Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white overflow-hidden shadow-md">
                            {friend.avatar_url ? (
                                <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                            ) : (
                                friend.username.charAt(0).toUpperCase()
                            )}
                        </div>
                        
                        <div 
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${getStatusColor(friend.status)}`}
                            title={friend.status || 'Invisible'}
                        ></div>
                    </div>

                    {/* Nombre y texto de estado */}
                    <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-slate-200 truncate">{friend.username}</h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                            {friend.status === 'Invisible' ? 'Desconectado' : friend.status || 'Disponible'}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
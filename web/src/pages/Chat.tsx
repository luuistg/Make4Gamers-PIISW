// src/pages/Chat.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { supabase } from '../supabase';
import FriendList from '../features/chat/components/FriendList';
import ChatArea from '../features/chat/components/ChatArea';
import { getOrCreateChatRoom, updateUserStatus } from '../features/chat/services/chat.service';
import type { ChatProfile } from '../features/chat/types/chat.types';
import AddFriendModal from '../features/chat/components/AddFriendModal'; 
import { Plus } from 'lucide-react'; 

export default function Chat() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [myStatus, setMyStatus] = useState('Disponible');
    const [selectedFriend, setSelectedFriend] = useState<ChatProfile | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    const [refreshFriends, setRefreshFriends] = useState(0); 


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    setCurrentUserId(user.id);
                    
                 
                    const savedStatus = localStorage.getItem(`chat_status_${user.id}`) || 'Disponible';
                    setMyStatus(savedStatus);
                    
                 
                    await updateUserStatus(user.id, savedStatus);
                }
            } catch (err) {
                console.error("Error comprobando la sesión:", err);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        fetchUser();
    }, []);

   
    useEffect(() => {
        if (!currentUserId) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
              
                supabase.from('profiles').update({ status: 'Invisible' }).eq('id', currentUserId).then();
            } else if (document.visibilityState === 'visible') {
            
                const savedStatus = localStorage.getItem(`chat_status_${currentUserId}`) || 'Disponible';
                supabase.from('profiles').update({ status: savedStatus }).eq('id', currentUserId).then();
                setMyStatus(savedStatus);
            }
        };

        const handleClose = () => {
         
            supabase.from('profiles').update({ status: 'Invisible' }).eq('id', currentUserId).then();
        };

    
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleClose);
        window.addEventListener('pagehide', handleClose);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleClose);
            window.removeEventListener('pagehide', handleClose);
            handleClose(); 
        };
    }, [currentUserId]);


    useEffect(() => {
        console.log("Iniciando conexión a Supabase Realtime...");

        const channel = supabase
            .channel('cambios-estado-amigos')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log("¡BINGO! He recibido un cambio de Supabase:", payload);
                    
                    const perfilActualizado = payload.new as ChatProfile;

                    setSelectedFriend((amigoActual) => {
                        if (amigoActual && amigoActual.id === perfilActualizado.id) {
                            return { ...amigoActual, status: perfilActualizado.status };
                        }
                        return amigoActual;
                    });

                    setRefreshFriends((prev) => prev + 1);
                }
            )
            .subscribe((status) => {
                console.log("Estado de la suscripción Realtime:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setMyStatus(newStatus);
        
        if (currentUserId) {
       
            localStorage.setItem(`chat_status_${currentUserId}`, newStatus);
            await updateUserStatus(currentUserId, newStatus);
        }
    };

    const handleSelectFriend = async (friend: ChatProfile) => {
        setSelectedFriend(friend);
        if (!currentUserId) return;
        
        setLoadingRoom(true);
        const id = await getOrCreateChatRoom(currentUserId, friend.id);
        setRoomId(id);
        setLoadingRoom(false);
    };

    if (isCheckingAuth) {
        return (
            <section className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </section>
        );
    }

    if (!currentUserId) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-4">¡Alto ahí!</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    Para poder chatear con otros usuarios y acceder a tus mensajes privados, necesitas iniciar sesión en tu cuenta.
                </p>
                <Link 
                    to="/login" 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    Ir a Iniciar Sesión
                </Link>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-100px)]">
            <div className="flex flex-col md:flex-row h-full gap-6 bg-slate-900/30 p-4 rounded-2xl border border-slate-700/50 shadow-xl">
                
                {/* Panel Izquierdo: Lista de Amigos */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    
                    {/* Selector de Mi Estado */}
                    <div className="p-3 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Mi estado:</span>
                        <select 
                            value={myStatus}
                            onChange={handleStatusChange}
                            className="bg-slate-800 text-sm text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="Disponible">🟢 Disponible</option>
                            <option value="Ausente">🟡 Ausente</option>
                            <option value="Ocupado">🔴 Ocupado</option>
                            <option value="Invisible">⚫ Invisible</option>
                        </select>
                    </div>

                    {/* Cabecera de Mensajes */}
                    <div className="p-4 border-b border-slate-700/50 bg-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Mensajes</h2>
                        <button 
                            onClick={() => setIsAddFriendOpen(true)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all active:scale-90"
                            title="Añadir amigo"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    
                    {/* Lista de Amigos */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <FriendList 
                            key={refreshFriends} 
                            currentUserId={currentUserId} 
                            onSelectFriend={handleSelectFriend}
                            selectedFriendId={selectedFriend?.id}
                        />
                    </div>
                </div>

                {/* Panel Derecho: Área de Chat */}
                <div className="w-full md:w-2/3 lg:w-3/4 h-full flex flex-col">
                    {!selectedFriend ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50 text-slate-400">
                            <h3 className="text-xl font-medium text-slate-200 mb-2">Tus Mensajes</h3>
                            <p>Selecciona un amigo de la lista para empezar a chatear.</p>
                        </div>
                    ) : loadingRoom ? (
                        <div className="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : roomId ? (
                        <ChatArea 
                            roomId={roomId}
                            currentUserId={currentUserId}
                            friendProfile={selectedFriend}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-red-400 bg-slate-800/30 rounded-xl border border-red-900/50">
                            Hubo un error al preparar el chat. Inténtalo de nuevo.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para añadir amigos */}
            {isAddFriendOpen && (
                <AddFriendModal 
                    currentUserId={currentUserId}
                    onClose={() => setIsAddFriendOpen(false)}
                    onFriendAdded={() => setRefreshFriends(prev => prev + 1)}
                />
            )}
        </section>
    );
}
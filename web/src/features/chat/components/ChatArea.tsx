
import { useState, useRef, useEffect } from 'react';
import { Send, Check, CheckCheck } from 'lucide-react';
import { useChatMessages } from '../hooks/useChatMessages';
import { sendMessage } from '../services/chat.service';
import type { ChatProfile } from '../types/chat.types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


interface ChatAreaProps {
  roomId: string;
  currentUserId: string;
  friendProfile: ChatProfile;
}

export default function ChatArea({ roomId, currentUserId, friendProfile }: ChatAreaProps) {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading } = useChatMessages(roomId, currentUserId);


  useEffect(() => {
    if (chatContainerRef.current) {
    
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(roomId, currentUserId, newMessage.trim());
      setNewMessage(''); 
    
      setTimeout(() => inputRef.current?.focus(), 10);
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
{/* Cabecera del chat */}
      <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center gap-3 shadow-sm z-10">
          
            <Link 
              to={`/usuario/${friendProfile.username}`} 
              className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 hover:opacity-80 transition-opacity cursor-pointer shadow-md"
              title={`Ver perfil de ${friendProfile.username}`}
            >
              {friendProfile.avatar_url ? (
                <img src={friendProfile.avatar_url} alt={friendProfile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {friendProfile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>

            <div>
          
              <Link 
                to={`/usuario/${friendProfile.username}`}
                className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer"
                title={`Ver perfil de ${friendProfile.username}`}
              >
                {friendProfile.username}
              </Link>
              
              <span className={`text-xs flex items-center gap-1.5 mt-0.5 ${
                  friendProfile.status === 'Ocupado' ? 'text-red-400' :
                  friendProfile.status === 'Ausente' ? 'text-yellow-400' :
                  friendProfile.status === 'Invisible' ? 'text-slate-400' :
                  'text-green-400' 
              }`}>
                <span className={`w-2 h-2 rounded-full inline-block ${
                    friendProfile.status === 'Ocupado' ? 'bg-red-500' :
                    friendProfile.status === 'Ausente' ? 'bg-yellow-500' :
                    friendProfile.status === 'Invisible' ? 'bg-slate-500' :
                    'bg-green-500'
                }`}></span> 
                
              
                {friendProfile.status === 'Invisible' ? t('chat.status.disconnected') : 
                 friendProfile.status === 'Ocupado' ? t('chat.status.busy') : 
                 friendProfile.status === 'Ausente' ? t('chat.status.away') : 
                 t('chat.status.online')}
              </span>
            </div>
      </div>
      {/* Área de mensajes */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
            <p className="text-lg">{t('chat.breakIce')}</p>
            <p className="text-sm">
              {t('chat.firstMessage', { name: friendProfile.username })}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
             
              const isMine = msg.sender_id === currentUserId;

           
              const timeString = new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                 
                  <div
                    className={`px-4 py-2.5 max-w-[75%] rounded-2xl shadow-sm ${
                      isMine
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-700 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    <p className="break-words leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

          
                <div className="flex items-center gap-1 mt-1.5 px-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      {timeString}
                    </span>
                  
                    {msg.sender_id === currentUserId && (
                      msg.is_read ? (
                        <span title="Leído" className="flex items-center">
                          <CheckCheck size={14} className="text-blue-400 drop-shadow-[0_0_2px_rgba(96,165,250,0.5)]" />
                        </span>
                      ) : (
                        <span title="Enviado" className="flex items-center">
                          <Check size={14} className="text-slate-500" />
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
           
          </>
        )}
      </div>

      {/* Input para escribir */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/80 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef} 
            autoFocus
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.placeholder', { name: friendProfile.username })}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
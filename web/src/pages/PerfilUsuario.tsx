import { useState, useEffect } from 'react';


import { supabase } from '../supabase';
import { removeFriend } from '../features/chat/services/friend.service';
import { useParams, Link, useNavigate } from 'react-router-dom'; 

import { User as UserIcon, Activity, ArrowLeft, Trophy, Calendar, Gamepad2, Check, AlertCircle, AlertTriangle, Medal, Flag } from 'lucide-react';
import { getAccountHighScores } from '../features/account/services/account.service';
import { reportUser } from '../../../packages/api/src/services/reports.service';


export default function PerfilUsuario() {
  const { username } = useParams(); 
  const [profile, setProfile] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [highScores, setHighScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const navigate = useNavigate();
  // Estados para el sistema de reportes
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportFeedback, setReportFeedback] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchProfileAndActivity = async () => {
      try {
        //Buscar perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }

        //Buscar su actividad reciente (ultimas 5)
        if (profileData) {
          const { data: activityData, error: activityError } = await supabase
            .from('scores')
            .select(`
              id,
              score,
              created_at,
              game:games(title)
            `)
            .eq('user_id', profileData.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!activityError && activityData) {
            setRecentActivity(activityData);
          }
        }

        
          const scores = await getAccountHighScores(profileData.id);
          setHighScores(scores);

      } catch (error) {
        console.error("Error cargando el perfil público:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileAndActivity();
    }
  }, [username]);

  //Funcion auxiliar para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <UserIcon size={64} className="opacity-20" />
        <h2 className="text-2xl font-bold text-white">Usuario no encontrado</h2>
        <p>El jugador que buscas no existe o ha cambiado de nombre.</p>
        <Link to="/cuenta" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mt-4">
          <ArrowLeft size={16} /> Volver a mi cuenta
        </Link>
      </div>
    );
  }


  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

 
  const executeRemoveFriend = async () => {
    if (!currentUserId || !profile?.id) return;
    
    setDeleteErrorMsg('');
    try {
        const success = await removeFriend(currentUserId, profile.id);
        if (success) {
            setShowDeleteModal(false);
            setDeleteSuccessMsg("Amigo eliminado correctamente");
            
           
            setTimeout(() => {
                navigate('/cuenta');
            }, 2000);
        } else {
            setDeleteErrorMsg("Hubo un error al eliminar al amigo");
            setShowDeleteModal(false);
        }
    } catch (error) {
        setDeleteErrorMsg("Error de conexión al eliminar.");
        setShowDeleteModal(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      setReportFeedback({ type: 'error', text: 'Por favor, selecciona un motivo.' });
      return;
    }
    if (!currentUserId || !profile?.id) return;

    setIsSubmittingReport(true);
    setReportFeedback(null);

    const result = await reportUser(supabase, currentUserId, profile.id, reportReason, reportDetails);

    setIsSubmittingReport(false);

    if (result.success) {
      setReportFeedback({ type: 'success', text: 'Reporte enviado. Gracias por ayudar a mantener la comunidad segura.' });
      // Cerramos el modal después de 3 segundos
      setTimeout(() => {
        setShowReportModal(false);
        setReportFeedback(null);
        setReportReason('');
        setReportDetails('');
      }, 3000);
    } else {
      setReportFeedback({ type: 'error', text: result.error || 'Error al enviar el reporte.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Boton volver */}
        <Link to="/cuenta" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Volver a mis amigos
        </Link>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-indigo-400" />
              )}
            </div>
 
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">{profile?.username}</h1>
                  
                  {/* BOTÓN DE REPORTAR (Debajo del nombre en móvil, al lado en escritorio) */}
                  {currentUserId && currentUserId !== profile?.id && (
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2"
                    >
                      <Flag size={16} />
                      Reportar jugador
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  {/* Botón de Eliminar Amigo */}
                  {currentUserId && profile?.id && currentUserId !== profile.id && (
                    <button 
                      onClick={handleOpenDeleteModal}
                      disabled={!!deleteSuccessMsg} 
                      className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/20 disabled:opacity-50"
                    >
                      <UserIcon size={18} />
                      Eliminar amigo
                    </button>
                  )}
                </div>
              </div>

              {/* Mensajes de éxito/error */}
              {deleteSuccessMsg && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                  <Check size={18} />
                  {deleteSuccessMsg}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400 mt-6">
                <span className="flex items-center gap-1.5">
                  <Activity size={16} /> 
                  Estado: <span className="text-green-400">{profile.status || 'Disponible'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> 
                  Miembro desde: {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>


  
        {highScores.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Brillo de fondo sutil */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
            
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
              <Medal className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> 
              Salón de la Fama
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              {highScores.map((record, index) => (
                <div 
                  key={`record-${record.id}`} 
                  className="p-5 bg-gradient-to-br from-slate-800/80 to-slate-800/30 border border-slate-700/50 hover:border-amber-500/40 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.15)]"
                >
                  {/* Número de Top y Medalla de fondo */}
                  <div className="absolute -right-4 -bottom-4 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Medal size={90} className="text-amber-400" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/20">
                        {index + 1}
                      </span>
                      <p className="text-sm text-slate-300 font-medium truncate">
                        {record.displayTitle}
                      </p>
                    </div>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 tracking-tight">
                      {record.score}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      Puntuación Máxima
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actividad reciente */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="text-indigo-400" /> Actividad Reciente
          </h3>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 border border-slate-800 border-dashed rounded-xl bg-slate-800/20">
              <p className="text-slate-500">Este usuario aún no ha jugado ninguna partida.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Jugó a <span className="text-indigo-400">{activity.game?.title || 'Juego Desconocido'}</span>
                      </p>
                      <p className="text-sm text-slate-400">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{activity.score}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Puntos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">¿Eliminar amigo?</h3>
              <p className="text-slate-400 text-sm">
                Estás a punto de eliminar a <span className="text-indigo-400 font-medium">{profile?.username}</span> de tus amigos. Esta acción no se puede deshacer.
              </p>
              
              <div className="flex gap-3 w-full pt-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeRemoveFriend}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    {/* Modal de Reporte */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <Flag size={24} />
              <h3 className="text-xl font-bold text-white">Reportar a {profile?.username}</h3>
            </div>
            
            <p className="text-slate-400 text-sm mb-4">
              Ayúdanos a entender qué está pasando. Los reportes son anónimos.
            </p>

            {reportFeedback && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${reportFeedback.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {reportFeedback.text}
              </div>
            )}

            {!reportFeedback || reportFeedback.type === 'error' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Motivo del reporte *</label>
                  <select 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecciona un motivo...</option>
                    <option value="Trampas / Hacks">Trampas / Uso de Hacks</option>
                    <option value="Lenguaje Tóxico">Lenguaje Tóxico u Ofensivo</option>
                    <option value="Acoso">Acoso a otros jugadores</option>
                    <option value="Nombre Inapropiado">Nombre o Avatar inapropiado</option>
                    <option value="Spam">Spam / Publicidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Detalles adicionales (Opcional)</label>
                  <textarea 
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe brevemente lo ocurrido..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  />
                </div>

                <div className="flex gap-3 w-full pt-4">
                  <button 
                    onClick={() => {
                      setShowReportModal(false);
                      setReportFeedback(null);
                    }}
                    disabled={isSubmittingReport}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSubmitReport}
                    disabled={isSubmittingReport}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingReport ? 'Enviando...' : 'Enviar Reporte'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      
    </div>


  );
}
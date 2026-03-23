import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User as UserIcon, Activity, ArrowLeft, Trophy, Calendar, Gamepad2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function PerfilUsuario() {
  const { username } = useParams(); 
  const [profile, setProfile] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Boton volver */}
        <Link to="/cuenta" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Volver a mis amigos
        </Link>

        {/* TARJETA DEL PERFIL */}
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
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.username}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
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
    </div>
  );
}
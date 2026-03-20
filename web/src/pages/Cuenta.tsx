import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Calendar, Activity, Shield, ShieldAlert } from 'lucide-react';
import { supabase } from '../supabase';
import FriendManager from '../features/social/components/FriendManager';

export default function Cuenta() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
          // Cargamos su configuración de privacidad (si no existe, por defecto true)
          setAllowRequests(data.allow_requests !== false); 
        }
      } catch (error) {
        console.error("Error cargando el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Función para cambiar y guardar la privacidad en la base de datos
  const togglePrivacy = async () => {
    if (!profile) return;
    setSavingPrivacy(true);
    const newValue = !allowRequests;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ allow_requests: newValue })
        .eq('id', profile.id);

      if (error) throw error;
      setAllowRequests(newValue);
    } catch (error) {
      console.error("Error actualizando privacidad:", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setSavingPrivacy(false);
    }
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <UserIcon size={48} className="mb-4 opacity-50" />
        <p>No se pudo cargar el perfil. Inicia sesión.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-indigo-400" />
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.username || 'Usuario Sin Nombre'}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                {profile.email && (
                  <span className="flex items-center gap-1.5"><Mail size={16} /> {profile.email}</span>
                )}
                <span className="flex items-center gap-1.5"><Activity size={16} /> Estado: <span className="text-green-400">{profile.status}</span></span>
              </div>
            </div>

            {/* Boton de privcidad */}
            <div className="mt-4 md:mt-0 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center md:items-end">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Privacidad de Amistad
              </span>
              <button 
                onClick={togglePrivacy}
                disabled={savingPrivacy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  allowRequests 
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                }`}
              >
                {savingPrivacy ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : allowRequests ? (
                  <Shield size={16} />
                ) : (
                  <ShieldAlert size={16} />
                )}
                {allowRequests ? 'Recibiendo Solicitudes' : 'Solicitudes Bloqueadas'}
              </button>
            </div>
          </div>
        </div>

        {/* Gestion de amigos */}
        <div className="animate-fade-in">
          <FriendManager />
        </div>

      </div>
    </div>
  );
}
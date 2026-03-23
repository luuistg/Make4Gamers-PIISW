import { useState, useEffect, useRef } from 'react';
// 1. NUEVO: Importamos icons y useRef
import { User as UserIcon, Mail, Activity, Shield, ShieldAlert, Edit2, Check, X, Camera, AlertTriangle } from 'lucide-react'; 
import { supabase } from '../supabase';
import FriendManager from '../features/social/components/FriendManager';

export default function Cuenta() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Estados para controlar la edición del nombre
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  // 2. NUEVO: Estados para la foto de perfil y el Modal
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarPolicyModal, setShowAvatarPolicyModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para el input file oculto

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
          setAllowRequests(data.allow_requests !== false); 
          setEditNameValue(data.username || ""); 

          if (!data.username || data.username.trim() === '') {
            setIsEditingName(true);
          }
        }
      } catch (error) {
        console.error("Error cargando el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const saveUsername = async () => {
    const newName = editNameValue.trim();
    
    if (!newName) {
      alert("El nombre de usuario no puede estar vacío.");
      return;
    }
    
    setSavingName(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from('profiles')
        .update({ username: newName })
        .eq('id', user.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        console.error("Supabase no aplicó el cambio. Posible bloqueo RLS.");
        alert("Error de permisos: Revisa que la tabla 'profiles' tenga una política UPDATE permitida para los usuarios.");
        return;
      }

      setProfile({ ...profile, username: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error actualizando el nombre:", error);
      alert("Hubo un error al guardar. Es posible que ese nombre de usuario ya esté en uso, pruebe otro.");
    } finally {
      setSavingName(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    setProfile({ ...profile, status: newStatus });
    
    if (profile?.id) {
      try {
        localStorage.setItem(`chat_status_${profile.id}`, newStatus);
        
        const { error } = await supabase
          .from('profiles')
          .update({ status: newStatus })
          .eq('id', profile.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error actualizando el estado:", error);
      }
    }
  };

  // 3. NUEVO: Función para subir la imagen a Supabase
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Creamos un path único: user_id/avatar_timestamp.ext
      const filePath = `${profile.id}/avatar_${Date.now()}.${fileExt}`;

      // A. Subimos al Bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Obtenemos la URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // C. Actualizamos la tabla 'profiles'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Actualizamos la interfaz local
      setProfile({ ...profile, avatar_url: publicUrl });
      alert('¡Foto de perfil actualizada con éxito!');

    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploadingAvatar(false);
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
        <p>No se pudo cargar el perfil. Asegúrate de haber iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* CABECERA DEL PERFIL */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            
            {/* 4. NUEVO: Foto de Perfil Interactiva */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                {uploadingAvatar ? (
                  // Spinner durante la subida
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                ) : profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={40} className="text-indigo-400" />
                )}
              </div>
              
              {/* Overlay con icono de cámara (aparece en hover) */}
              <button
                title='Cambiar foto de perfil'
                onClick={() => setShowAvatarPolicyModal(true)} // Primero el Modal, luego la selección
                disabled={uploadingAvatar}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-indigo-500"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>
            
            {/* Input file oculto con ref */}
            <input
              title='Subir nueva foto de perfil'
              type="file"
              id="avatarSingle"
              accept="image/*"
              onChange={uploadAvatar}
              ref={fileInputRef}
              disabled={uploadingAvatar}
              className="hidden"
            />

            <div className="text-center md:text-left flex-1">
              {/* Lógica condicional para mostrar el input o el texto */}
              {isEditingName ? (
                // Modo edicion
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    placeholder="Escribe tu nuevo nombre..."
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button 
                    onClick={saveUsername} 
                    disabled={savingName}
                    className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                    title="Guardar"
                  >
                    {savingName ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Check size={20} />}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingName(false);
                      setEditNameValue(profile.username || "");
                    }} 
                    className="p-1.5 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30 transition-colors"
                    title="Cancelar"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                //Modo vista
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2 group">
                  <h1 className="text-3xl font-bold text-white">
                    {profile.username || 'Usuario Sin Nombre'}
                  </h1>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 text-slate-500 hover:text-indigo-400 bg-slate-800/50 hover:bg-slate-800 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                    title="Editar nombre"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                {profile.email && (
                  <span className="flex items-center gap-1.5"><Mail size={16} /> {profile.email}</span>
                )}
                
                {/* Selector de Estado */}
                <span className="flex items-center gap-1.5">
                  <Activity size={16} /> Estado: 
                  <select
                    title='Seleccionar estado de conexion'
                    value={profile.status || 'Disponible'}
                    onChange={handleStatusChange}
                    className="bg-slate-800/80 text-white border border-slate-700 rounded-md px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer text-sm ml-1"
                  >
                    <option value="🟢 Disponible">Disponible</option>
                    <option value="🟡 Ausente">Ausente</option>
                    <option value="🔴 Ocupado">Ocupado</option>
                    <option value="⚫ Invisible">Invisible</option>
                  </select>
                </span>

              </div>
            </div>

            {/* Boton de privacidad */}
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

      {/* Normativa de imagenes */}
      {showAvatarPolicyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400 mb-2 border-b border-slate-800 pb-3">
              <AlertTriangle size={32} />
              <h3 className="text-2xl font-bold text-white">Normativa de Imágenes</h3>
            </div>
            
            <p className="text-sm text-slate-400">
              Antes de subir una nueva foto de perfil, por favor recuerda las normas de la comunidad para asegurar un entorno agradable para todos:
            </p>
            
            <ul className="text-sm text-slate-400 list-disc list-inside space-y-1.5 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <li>No se permiten imágenes con contenido adulto o violento</li>
              <li>Prohibido material ofensivo, discriminatorio o de odio</li>
              <li>Cualquier infracción resultará en la eliminacion de la foto o de la cuenta</li>
            </ul>

            <div className="flex gap-3 pt-3 justify-end">
              <button 
                onClick={() => setShowAvatarPolicyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowAvatarPolicyModal(false);
                  fileInputRef.current?.click(); //Selector de archivos
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                He leído y acepto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
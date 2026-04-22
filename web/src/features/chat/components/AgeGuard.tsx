import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AgeGuardProps {
  edadMinima: number;
  children: React.ReactNode;
}

export default function AgeGuard({ edadMinima, children }: AgeGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAge();
  }, [edadMinima]);

  const checkAge = async () => {
    setHasAccess(null);
    setNeedsConfirmation(false);

    if (!edadMinima || edadMinima <= 3) {
      setHasAccess(true);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('birth_date')
      .eq('id', session.user.id)
      .single();

    if (!profile?.birth_date) {
      setHasAccess(false);
      return;
    }

    //Calcular edad
    const birthDate = new Date(profile.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= edadMinima) {
      //Confirmacion +18
      if (edadMinima >= 18 && !sessionStorage.getItem(`confirmed_18_${session.user.id}`)) {
        setNeedsConfirmation(true);
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }
    } else {
      setHasAccess(false);
    }
  };

  const handleConfirm = async () => {
    // CORRECCIÓN: Leer el ID del usuario correctamente
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;
    
    if (userId) {
      sessionStorage.setItem(`confirmed_18_${userId}`, 'true');
      setNeedsConfirmation(false);
      setHasAccess(true);
    }
  };

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-slate-400 animate-pulse">Verificando acceso al juego...</div>
      </div>
    );
  }

  if (!hasAccess && !needsConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-10 bg-slate-900 border border-red-900/50 rounded-2xl text-center max-w-2xl mx-auto">
        <AlertOctagon size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
        <p className="text-slate-400 max-w-md">
          Lo sentimos, este título está clasificado para mayores de {edadMinima} años según tu fecha de nacimiento registrada.
        </p>
        <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-slate-800 text-indigo-400 rounded-lg hover:bg-slate-700 transition-colors">
          Volver atrás
        </button>
      </div>
    );
  }

  if (needsConfirmation) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md text-center shadow-2xl">
          <AlertOctagon size={48} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Contenido +18</h2>
          <p className="text-slate-300 mb-8">
            Este juego contiene material dirigido exclusivamente a adultos. Al continuar, confirmas que tienes al menos 18 años y aceptas ver este contenido.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              Cancelar
            </button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold transition-colors">
              Confirmar acceso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
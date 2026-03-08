import { supabase } from './supabase';

/**
 * SCRUM-95: Sistema de Puntuación y Hitos
 * Esta función se encarga de registrar los puntos que gana un usuario.
 */
export const registrarPuntos = async (userId: string, puntos: number, nombreHito: string) => {
  
  // --- SCRUM-97: Control de Abuso ---
  // Establecemos un límite de 1000 puntos por acción para evitar trampas.
  const LIMITE_SEGURIDAD = 1000;
  if (puntos > LIMITE_SEGURIDAD) {
    return { error: "Cantidad de puntos excede el límite permitido." };
  }

  try {
    const { data, error } = await supabase
      .from('puntuaciones') // Asegúrate de que tu tabla en Supabase se llame así
      .insert([
        { 
          user_id: userId, 
          cantidad: puntos, 
          hito: nombreHito, 
          creado_en: new Date().toISOString() 
        }
      ]);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
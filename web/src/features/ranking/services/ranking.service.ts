import { registrarPuntos as registrarPuntosFromApi } from '../../../../../packages/api/src';
import { supabase } from '../../../supabase';

/**
 * SCRUM-95: Sistema de Puntuación y Hitos
 * Esta función se encarga de registrar los puntos que gana un usuario.
 */
export const registrarPuntos = async (userId: string, puntos: number, nombreHito: string) => {
  return registrarPuntosFromApi(supabase, userId, puntos, nombreHito);
};
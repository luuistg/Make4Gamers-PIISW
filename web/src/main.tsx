import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n.js'
import './index.css'
import App from './App.tsx'

// --- SCRUM-60: IMPORTACIONES PARA RANKING Y PUNTUACIÓN ---
import { registrarPuntos } from './rankingService'
import { CATALOGO_HITOS } from './hitosConfig'

/**
 * PRUEBA TÉCNICA DE INTEGRACIÓN (SCRUM-95 y SCRUM-96)
 * Este bloque demuestra que el sistema es capaz de:
 * 1. Leer un hito del catálogo configurable (SCRUM-96).
 * 2. Enviar los puntos correctamente a Supabase (SCRUM-95).
 */
console.log("🚀 Iniciando prueba técnica de Ranking...");

// Seleccionamos un hito del catálogo para la prueba
const hitoDePrueba = CATALOGO_HITOS.PARTIDA_GANADA;

registrarPuntos("test-user-10", hitoDePrueba.puntos, hitoDePrueba.nombre)
  .then(res => {
    if (res.error) {
      console.error("❌ Error en la prueba de puntos:", res.error);
    } else {
      console.log(`✅ ¡ÉXITO! Se han guardado ${hitoDePrueba.puntos} puntos por: ${hitoDePrueba.nombre}`);
    }
  });
// -------------------------------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
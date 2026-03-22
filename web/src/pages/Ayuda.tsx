import { useState } from 'react';
import { BookOpen, FileText, HelpCircle, Download, ChevronDown, ChevronUp } from 'lucide-react';

export default function Ayuda() {
  //Info manuales
  /*
  const manuales = [
    { 
      id: 1, 
      titulo: 'Manual de Usuario Básico', 
      descripcion: 'Aprende a navegar por la plataforma, editar tu perfil y gestionar tu cuenta.', 
      pdf_url: '#' 
    },
    { 
      id: 2, 
      titulo: 'Guía del Sistema de Amigos', 
      descripcion: 'Descubre cómo añadir amigos, aceptar solicitudes y ver la actividad de otros jugadores.', 
      pdf_url: '#' 
    },
  ];
  */

  //FAQs
  const faqs = [
    { 
      id: 1, 
      pregunta: '¿Cómo puedo cambiar mi nombre de usuario?', 
      respuesta: 'Ve a la sección "Cuenta" desde el menú de navegación. Allí verás tu tarjeta de perfil con un icono de un lápiz junto a tu nombre. Haz clic en él, escribe tu nuevo nombre y dale a guardar (puede que el nombre ya este ocupado).' 
    },
    { 
      id: 2, 
      pregunta: '¿Dónde puedo ver a qué han jugado mis amigos?', 
      respuesta: 'Dentro de la sección "Cuenta", baja hasta "Comunidad". Si haces clic sobre la tarjeta de cualquiera de tus amigos, irás a su perfil público donde podrás ver sus últimas 5 partidas.' 
    },
    { 
      id: 3, 
      pregunta: '¿Cómo reporto un error en un juego?', 
      respuesta: 'Desde el menu del juego podras reportar errores que le llegaran al desarrollador.' 
    },
    { 
      id: 4, 
      pregunta: '¿Cómo reporto a un usuario?', 
      respuesta: 'Desde el perfil de su usuario podras reportar al usuario, y seleccionar el motivo.' 
    },
    { 
      id: 5, 
      pregunta: '¿Cómo añado un usuario como amigo?', 
      respuesta: 'Desde tu perfil personal, podras buscar a un usuario mediante su usuario para mandarle una solicitud.' 
    },
    { 
      id: 6, 
      pregunta: 'He mandado una solicitud a un usuario, pero no he obtenido respuesta', 
      respuesta: 'Cuando mandas una solicitud, puede que el otro usuario no lo haya aceptado.' 
    },
    { 
      id: 7, 
      pregunta: '¿De que sirve la privacidad del perfil?', 
      respuesta: 'La privacidad publica sirve para que otros usuarios puedan mandarte solicitud de amistad, si es privada, no se te mandaran solicitudes de amistad.' 
    }
  ];

  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    if (faqAbierta === id) {
      setFaqAbierta(null);
    } else {
      setFaqAbierta(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Cabecera */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full text-indigo-400 mb-2">
            <BookOpen size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white">Centro de Ayuda de M4G</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Encuentra manuales, tutoriales y respuestas a las preguntas más comunes para sacarle el máximo partido a Make4Gamers.
          </p>
        </div>

        {/* Manuales */}
        {/*
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="text-indigo-400" /> Manuales y Documentación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manuales.map((manual) => (
              <div key={manual.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group">
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {manual.titulo}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {manual.descripcion}
                </p>
                <a 
                  href={manual.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors w-full justify-center"
                >
                  <Download size={16} /> Descargar PDF
                </a>
              </div>
            ))}
          </div>
        </section>
        */}

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-indigo-400" /> Preguntas Frecuentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors focus:outline-none"
                >
                  <span className="font-medium text-white">{faq.pregunta}</span>
                  {faqAbierta === faq.id ? (
                    <ChevronUp className="text-indigo-400 shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-500 shrink-0" size={20} />
                  )}
                </button>
                
                {/* Contenido desplegable */}
                {faqAbierta === faq.id && (
                  <div className="px-6 pb-4 pt-1 text-slate-400 border-t border-slate-800/50 bg-slate-800/20">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
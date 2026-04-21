import { supabase } from '../supabase';
import { useState } from 'react';
import { BookOpen, FileText, HelpCircle, ChevronDown, ChevronUp, User, Users, Gamepad2, Search, X, Send, LifeBuoy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Ayuda() {
  const [activeTab, setActiveTab] = useState<'faq' | 'manuales'>('manuales');
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);
  const [manualAbierto, setManualAbierto] = useState<string | null>('cuenta');
  const [busqueda, setBusqueda] = useState('');

  // --- ESTADOS PARA EL TICKET DE SOPORTE ---
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Técnico');
  const [mensaje, setMensaje] = useState('');
  const [enviandoTicket, setEnviandoTicket] = useState(false);

  const faqs = [
    { id: 1, pregunta: '¿Cómo puedo cambiar mi nombre de usuario?', respuesta: 'Ve a la sección "Cuenta" desde el menú de navegación. Allí verás tu tarjeta de perfil con un icono de un lápiz junto a tu nombre. Haz clic en él, escribe tu nuevo nombre y dale a guardar (puede que el nombre ya este ocupado).' },
    { id: 2, pregunta: '¿Dónde puedo ver a qué han jugado mis amigos?', respuesta: 'Dentro de la sección "Cuenta", baja hasta "Comunidad". Si haces clic sobre la tarjeta de cualquiera de tus amigos, irás a su perfil público donde podrás ver sus últimas 5 partidas.' },
    { id: 3, pregunta: '¿Cómo reporto un error en un juego?', respuesta: 'Desde el menu del juego podras reportar errores que le llegaran al desarrollador.' },
    { id: 4, pregunta: '¿Cómo reporto a un usuario?', respuesta: 'Desde el perfil de su usuario podras reportar al usuario, y seleccionar el motivo.' },
    { id: 5, pregunta: '¿Cómo añado un usuario como amigo?', respuesta: 'Desde tu perfil personal, podras buscar a un usuario mediante su usuario para mandarle una solicitud.' },
    { id: 6, pregunta: 'He mandado una solicitud a un usuario, pero no he obtenido respuesta', respuesta: 'Cuando mandas una solicitud, puede que el otro usuario no lo haya aceptado.' },
    { id: 7, pregunta: '¿De que sirve la privacidad del perfil?', respuesta: 'La privacidad publica sirve para que otros usuarios puedan mandarte solicitud de amistad, si es privada, no se te mandaran solicitudes de amistad.' }
  ];

  const manuales = [
    {
      id: 'cuenta',
      titulo: 'Gestión de Cuenta y Perfil',
      icono: <User className="text-blue-400" size={24} />,
      descripcion: 'Aprende a configurar tu identidad en Make4Gamers.',
      pasos: [
        { titulo: 'Accede a tu perfil', desc: 'Haz clic en tu avatar en la esquina superior derecha de la pantalla y selecciona "Cuenta".' },
        { titulo: 'Edita tu información', desc: 'Usa el icono del lápiz junto a tu nombre para modificar tu apodo. Recuerda que debe ser único.' },
        { titulo: 'Ajusta tu privacidad', desc: 'En la sección de ajustes, puedes decidir si quieres que tu perfil sea público o privado.' }
      ]
    },
    {
      id: 'amigos',
      titulo: 'Sistema de Amigos y Chat',
      icono: <Users className="text-green-400" size={24} />,
      descripcion: 'Conecta con otros jugadores y no pierdas el contacto.',
      pasos: [
        { titulo: 'Busca a un jugador', desc: 'Ve a la pestaña de Comunidad y usa el buscador introduciendo el nombre exacto de tu amigo.' },
        { titulo: 'Envía la solicitud', desc: 'Entra en su perfil y pulsa "Añadir amigo". Tendrás que esperar a que la acepte.' },
        { titulo: 'Abre el Chat', desc: 'Una vez seáis amigos, ve a la pestaña "Chat" en el menú principal. Su nombre aparecerá en tu lista a la izquierda.' }
      ]
    },
    {
      id: 'juegos',
      titulo: 'Jugar y Reportar Errores',
      icono: <Gamepad2 className="text-purple-400" size={24} />,
      descripcion: 'Sácale el máximo partido al catálogo de juegos.',
      pasos: [
        { titulo: 'Explora el catálogo', desc: 'Ve a la sección "Juegos" en el menú superior para ver todos los títulos disponibles.' },
        { titulo: 'Consulta el Ranking', desc: 'Puedes ver quién es el mejor en cada juego accediendo a la pestaña "Ranking".' },
        { titulo: 'Reporta un problema', desc: 'Si un juego falla, usa el botón de "Reportar" dentro del propio menú del juego para avisar al desarrollador.' }
      ]
    }
  ];

  const toggleFaq = (id: number) => setFaqAbierta(faqAbierta === id ? null : id);
  
  const term = busqueda.toLowerCase();
  
  const faqsFiltradas = faqs.filter(faq => 
    faq.pregunta.toLowerCase().includes(term) || 
    faq.respuesta.toLowerCase().includes(term)
  );

  const manualesFiltrados = manuales.filter(manual => 
    manual.titulo.toLowerCase().includes(term) || 
    manual.descripcion.toLowerCase().includes(term) ||
    manual.pasos.some(p => p.titulo.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term))
  );

  const isSearching = busqueda.trim().length > 0;

  //Enviar Ticket
  // --- FUNCIÓN PARA ENVIAR EL TICKET REVISADA Y LIMPIA ---
  const handleEnviarTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asunto.trim() || !mensaje.trim()) {
      toast.error("Por favor, rellena todos los campos para poder ayudarte.");
      return;
    }

    setEnviandoTicket(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        toast.error("Debes iniciar sesión para enviar un ticket.");
        setEnviandoTicket(false);
        return;
      }

      const numTicket = `TK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      let prioridadInicial = 'Normal';
      if (categoria === 'Pagos') prioridadInicial = 'Alta';
      if (categoria === 'Denuncia') prioridadInicial = 'Urgente';

      const { error } = await supabase
        .from('support_tickets')
        .insert([
          {
            user_id: user.id,
            ticket_number: numTicket,
            asunto,
            categoria,
            mensaje,
            prioridad: prioridadInicial
          }
        ]);

      if (error) throw error;

      toast.success(`¡Ticket ${numTicket} enviado! Revisaremos tu caso pronto.`);
      
      setAsunto('');
      setMensaje('');
      setCategoria('Técnico');
    } catch (error: any) {
      console.error('Error al enviar ticket:', error);
      toast.error("Hubo un error al enviar tu ticket. Inténtalo de nuevo.");
    } finally {
      setEnviandoTicket(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera Épica */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full text-indigo-400 mb-2 ring-1 ring-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <BookOpen size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Centro de Ayuda</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Aprende a dominar Make4Gamers. Elige entre nuestros manuales paso a paso o consulta las preguntas más comunes.
          </p>
        </div>

        {/* Buscador Real */}
        <div className="max-w-2xl mx-auto relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-indigo-400' : 'text-slate-500'}`} size={20} />
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="¿Qué necesitas buscar? (Ej. cambiar nombre, añadir amigo...)" 
              className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-lg"
            />
            {isSearching && (
              <button 
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
        </div>

   
        {!isSearching && (
          <div className="flex justify-center gap-4 border-b border-slate-800 pb-px">
            <button
              onClick={() => setActiveTab('manuales')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === 'manuales' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText size={20} />
              Manuales Interactivos
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === 'faq' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle size={20} />
              Preguntas Frecuentes
            </button>
          </div>
        )}

     
        {isSearching && (
          <div className="animate-in fade-in duration-300 space-y-8">
            <div className="text-center text-slate-400">
              Resultados para <span className="text-indigo-400 font-semibold">"{busqueda}"</span>
            </div>

            {manualesFiltrados.length === 0 && faqsFiltradas.length === 0 && (
              <div className="text-center text-slate-500 py-10 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                No hemos encontrado resultados que coincidan con tu búsqueda. Prueba con otras palabras.
              </div>
            )}

            {faqsFiltradas.length > 0 && (
              <div className="max-w-3xl mx-auto space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Preguntas Frecuentes</h3>
                {faqsFiltradas.map((faq) => (
                  <div key={faq.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 focus:outline-none"
                    >
                      <span className="font-medium text-white">{faq.pregunta}</span>
                      {faqAbierta === faq.id ? <ChevronUp className="text-indigo-400 shrink-0" size={20} /> : <ChevronDown className="text-slate-500 shrink-0" size={20} />}
                    </button>
                    {faqAbierta === faq.id && (
                      <div className="px-6 pb-4 pt-1 text-slate-400 border-t border-slate-800/50 bg-slate-800/20 leading-relaxed">
                        {faq.respuesta}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {manualesFiltrados.length > 0 && (
              <div className="max-w-3xl mx-auto space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 mt-8">Manuales</h3>
                {manualesFiltrados.map((manual) => (
                  <div key={manual.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {manual.icono}
                      <h4 className="text-lg font-bold text-white">{manual.titulo}</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{manual.descripcion}</p>
                    <div className="space-y-4 pl-4 border-l-2 border-slate-800">
                      {manual.pasos.map((paso, idx) => (
                        <div key={idx}>
                          <span className="font-medium text-slate-300 block">Paso {idx + 1}: {paso.titulo}</span>
                          <span className="text-sm text-slate-500 block">{paso.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      
        {!isSearching && activeTab === 'manuales' && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="md:col-span-1 space-y-3">
              {manuales.map((manual) => (
                <button
                  key={manual.id}
                  onClick={() => setManualAbierto(manual.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    manualAbierto === manual.id 
                      ? 'bg-slate-800/80 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        {manual.icono}
                    </div>
                    <h3 className={`font-semibold ${manualAbierto === manual.id ? 'text-white' : 'text-slate-300'}`}>
                        {manual.titulo}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
              {manuales.map((manual) => manualAbierto === manual.id && (
                <div key={manual.id} className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-white mb-2">{manual.titulo}</h2>
                  <p className="text-slate-400 mb-8 pb-6 border-b border-slate-800">{manual.descripcion}</p>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                    {manual.pasos.map((paso, index) => (
                      <div key={index} className="relative flex items-start md:justify-between gap-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 font-bold z-10 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                          {index + 1}
                        </div>
                        <div className="flex-1 bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl hover:bg-slate-800/60 transition-colors">
                          <h4 className="text-lg font-semibold text-slate-200 mb-1">{paso.titulo}</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{paso.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

     
        {!isSearching && activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700">
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
                {faqAbierta === faq.id && (
                  <div className="px-6 pb-4 pt-1 text-slate-400 border-t border-slate-800/50 bg-slate-800/20 leading-relaxed">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Formulario de Soporte */}
        <div className="mt-16 pt-16 border-t border-slate-800/50 animate-in fade-in duration-500">
          <div className="max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden relative shadow-lg">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="p-6 md:p-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <LifeBuoy size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">¿No has encontrado la solución?</h2>
                  <p className="text-slate-400 text-sm mt-1">Abre un ticket y nuestro equipo de soporte te ayudará.</p>
                </div>
              </div>

              <form onSubmit={handleEnviarTicket} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="asunto" className="block text-sm font-medium text-slate-300">
                      Asunto <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      id="asunto"
                      type="text"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      placeholder="Ej: Problema al iniciar partida..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="categoria" className="block text-sm font-medium text-slate-300">
                      Categoría <span className="text-indigo-400">*</span>
                    </label>
                    <select
                      id="categoria"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                    >
                      <option value="Técnico">Problema Técnico</option>
                      <option value="Pagos">Pagos y Facturación</option>
                      <option value="Denuncia">Denunciar un abuso</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="mensaje" className="block text-sm font-medium text-slate-300">
                    Descripción detallada <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Explícanos tu problema con el mayor detalle posible para que podamos ayudarte mejor..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors h-32 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={enviandoTicket}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      enviandoTicket 
                        ? 'bg-indigo-500/50 text-indigo-200 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]'
                    }`}
                  >
                    {enviandoTicket ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <Send size={18} />
                        Enviar Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}